import type {
  FeedbackErrorResponse,
  FeedbackResponse,
  FeedbackSuccessResponse,
} from '../../shared/feedback-contract'
import { GitHubIssueCreator } from './github'
import { D1GuardStore } from './guards'
import { CloudflareTurnstileVerifier, createRateLimitFingerprint } from './security'
import {
  ApiError,
  type Env,
  type GuardStore,
  type IssueCreator,
  type TurnstileVerifier,
} from './types'
import { parseFeedbackRequest } from './validation'

interface Dependencies {
  guardStore: GuardStore
  issueCreator: IssueCreator
  turnstileVerifier: TurnstileVerifier
  now: () => number
}

const MAX_BODY_BYTES = 16_384

const readBoundedBody = async (request: Request): Promise<string> => {
  if (!request.body) {
    return ''
  }

  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let bytesRead = 0
  let body = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    bytesRead += value.byteLength
    if (bytesRead > MAX_BODY_BYTES) {
      await reader.cancel()
      throw new ApiError(413, 'invalid_request')
    }
    body += decoder.decode(value, { stream: true })
  }
  return body + decoder.decode()
}

const jsonResponse = (
  body: FeedbackResponse | { ok: true; status: 'available' | 'disabled' },
  status: number,
  origin: string | null,
): Response => {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  })
  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Vary', 'Origin')
  }
  return new Response(JSON.stringify(body), { status, headers })
}

const getAllowedOrigin = (request: Request, env: Env): string | null => {
  const origin = request.headers.get('Origin')
  const allowed = env.ALLOWED_ORIGINS.split(',').map((value) => value.trim()).filter(Boolean)
  return origin && allowed.includes(origin) ? origin : null
}

const errorResponse = (error: ApiError, origin: string | null): Response => {
  const body: FeedbackErrorResponse = { ok: false, error: error.code }
  return jsonResponse(body, error.status, origin)
}

const getDependencies = (env: Env): Dependencies => ({
  guardStore: new D1GuardStore(env.DB),
  issueCreator: new GitHubIssueCreator(env),
  turnstileVerifier: new CloudflareTurnstileVerifier(
    env.TURNSTILE_SECRET_KEY,
    env.TURNSTILE_EXPECTED_HOSTS.split(',').map((host) => host.trim().toLowerCase()),
    env.TURNSTILE_EXPECTED_ACTION,
  ),
  now: () => Math.floor(Date.now() / 1000),
})

export const handleRequest = async (
  request: Request,
  env: Env,
  injectedDependencies?: Dependencies,
): Promise<Response> => {
  const origin = getAllowedOrigin(request, env)
  const url = new URL(request.url)

  if (request.method === 'GET' && url.pathname === '/health') {
    return jsonResponse(
      { ok: true, status: env.FEEDBACK_ENABLED === 'true' ? 'available' : 'disabled' },
      200,
      origin,
    )
  }

  if (request.method === 'OPTIONS' && url.pathname === '/feedback') {
    if (!origin) {
      return errorResponse(new ApiError(403, 'invalid_request'), null)
    }
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '600',
        Vary: 'Origin',
      },
    })
  }

  if (request.method !== 'POST' || url.pathname !== '/feedback') {
    return errorResponse(new ApiError(404, 'invalid_request'), origin)
  }
  if (!origin) {
    return errorResponse(new ApiError(403, 'invalid_request'), null)
  }
  if (env.FEEDBACK_ENABLED !== 'true') {
    return errorResponse(new ApiError(503, 'disabled'), origin)
  }
  if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) {
    return errorResponse(new ApiError(415, 'invalid_request'), origin)
  }

  const declaredLength = Number(request.headers.get('Content-Length') ?? 0)
  if (declaredLength > MAX_BODY_BYTES) {
    return errorResponse(new ApiError(413, 'invalid_request'), origin)
  }

  const dependencies = injectedDependencies ?? getDependencies(env)
  let reservedIdempotencyKey: string | null = null

  try {
    const rawBody = await readBoundedBody(request)

    let parsedBody: unknown
    try {
      parsedBody = JSON.parse(rawBody)
    } catch {
      throw new ApiError(400, 'invalid_request')
    }
    const feedback = parseFeedbackRequest(parsedBody, env)
    const now = dependencies.now()

    const existing = await dependencies.guardStore.reserveSubmission(
      feedback.idempotencyKey,
      now,
    )
    if (existing?.status === 'complete' && existing.issueNumber && existing.issueUrl) {
      const result: FeedbackSuccessResponse = {
        ok: true,
        issueNumber: existing.issueNumber,
        issueUrl: existing.issueUrl,
      }
      return jsonResponse(result, 200, origin)
    }
    if (existing) {
      const recovered = await dependencies.issueCreator.findByIdempotencyKey(
        feedback.idempotencyKey,
      )
      if (recovered) {
        try {
          await dependencies.guardStore.completeSubmission(
            feedback.idempotencyKey,
            recovered,
            now,
          )
        } catch (error) {
          console.error('Feedback idempotency recovery failed', {
            errorType: error instanceof Error ? error.name : 'UnknownError',
          })
        }
        return jsonResponse(recovered, 200, origin)
      }
      throw new ApiError(409, 'duplicate_pending')
    }
    reservedIdempotencyKey = feedback.idempotencyKey

    const remoteIp = request.headers.get('CF-Connecting-IP')
    const challengePassed = await dependencies.turnstileVerifier.verify(
      feedback.turnstileToken,
      remoteIp,
      feedback.idempotencyKey,
    )
    if (!challengePassed) {
      throw new ApiError(400, 'challenge_failed')
    }

    const maximum = Number.parseInt(env.RATE_LIMIT_MAX, 10)
    const windowSeconds = Number.parseInt(env.RATE_LIMIT_WINDOW_SECONDS, 10)
    if (!Number.isInteger(maximum) || maximum < 1 || !Number.isInteger(windowSeconds) || windowSeconds < 60) {
      throw new ApiError(500, 'configuration_error')
    }
    const fingerprint = await createRateLimitFingerprint(remoteIp, env)
    const allowed = await dependencies.guardStore.consumeRateLimit(
      fingerprint,
      now,
      windowSeconds,
      maximum,
    )
    if (!allowed) {
      throw new ApiError(429, 'rate_limited')
    }

    const result = await dependencies.issueCreator.create(feedback)
    reservedIdempotencyKey = null
    try {
      await dependencies.guardStore.completeSubmission(feedback.idempotencyKey, result, now)
    } catch (error) {
      console.error('Feedback idempotency completion failed', {
        errorType: error instanceof Error ? error.name : 'UnknownError',
      })
    }
    return jsonResponse(result, 201, origin)
  } catch (error) {
    if (reservedIdempotencyKey) {
      await dependencies.guardStore.releaseSubmission(reservedIdempotencyKey)
    }
    if (error instanceof ApiError) {
      return errorResponse(error, origin)
    }
    console.error('Feedback submission failed', {
      errorType: error instanceof Error ? error.name : 'UnknownError',
    })
    return errorResponse(new ApiError(502, 'upstream_error'), origin)
  }
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env)
  },
} satisfies ExportedHandler<Env>
