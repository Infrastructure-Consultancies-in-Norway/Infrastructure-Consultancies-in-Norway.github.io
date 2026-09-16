import { describe, expect, it, vi } from 'vitest'
import type { FeedbackRequest, FeedbackSuccessResponse } from '../../shared/feedback-contract'
import { handleRequest } from '../src'
import type {
  Env,
  ExistingSubmission,
  GuardStore,
  IssueCreator,
  TurnstileVerifier,
} from '../src/types'

const payload: FeedbackRequest = {
  category: 'question',
  description: 'How should this property be used?',
  pageUrl: 'https://bimsnacks.no/?lang=no',
  pagePath: '/?lang=no',
  pageTitle: 'SNACks',
  language: 'no',
  appVersion: '1.0.1',
  honeypot: '',
  idempotencyKey: '8e4d8af8-cbf7-4fb7-8a29-1186966a2742',
  turnstileToken: 'token',
}

const env = {
  DB: {} as D1Database,
  ALLOWED_ORIGINS: 'https://bimsnacks.no',
  ALLOWED_PAGE_HOSTS: 'bimsnacks.no',
  FEEDBACK_ENABLED: 'true',
  GITHUB_OWNER: 'Infrastructure-Consultancies-in-Norway',
  GITHUB_REPOSITORY: 'Infrastructure-Consultancies-in-Norway.github.io',
  RATE_LIMIT_MAX: '5',
  RATE_LIMIT_WINDOW_SECONDS: '900',
  TURNSTILE_EXPECTED_ACTION: 'feedback_submit',
  TURNSTILE_EXPECTED_HOSTS: 'bimsnacks.no',
  TURNSTILE_SECRET_KEY: 'secret',
  RATE_LIMIT_SECRET: 'rate-secret',
  GITHUB_APP_ID: '1',
  GITHUB_APP_INSTALLATION_ID: '2',
  GITHUB_APP_PRIVATE_KEY: 'private-key',
} satisfies Env

class FakeGuardStore implements GuardStore {
  existing: ExistingSubmission | null = null
  rateAllowed = true
  released: string[] = []
  completed: FeedbackSuccessResponse[] = []

  reserveSubmission(): Promise<ExistingSubmission | null> {
    return Promise.resolve(this.existing)
  }

  completeSubmission(
    _idempotencyKey: string,
    result: FeedbackSuccessResponse,
  ): Promise<void> {
    this.completed.push(result)
    return Promise.resolve()
  }

  releaseSubmission(idempotencyKey: string): Promise<void> {
    this.released.push(idempotencyKey)
    return Promise.resolve()
  }

  consumeRateLimit(): Promise<boolean> {
    return Promise.resolve(this.rateAllowed)
  }
}

const createRequest = (body: unknown = payload, origin = 'https://bimsnacks.no') =>
  new Request('https://feedback.example/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(body),
  })

const createDependencies = (
  store: FakeGuardStore,
  overrides: {
    challengePassed?: boolean
    createIssue?: () => Promise<FeedbackSuccessResponse>
  } = {},
) => {
  const turnstileVerifier: TurnstileVerifier = {
    verify: vi.fn().mockResolvedValue(overrides.challengePassed ?? true),
  }
  const issueCreator: IssueCreator = {
    create:
      overrides.createIssue ??
      vi.fn().mockResolvedValue({
        ok: true,
        issueNumber: 42,
        issueUrl: 'https://github.com/org/repo/issues/42',
      }),
    findByIdempotencyKey: vi.fn().mockResolvedValue(null),
  }
  return { guardStore: store, turnstileVerifier, issueCreator, now: () => 1_800_000_000 }
}

describe('feedback Worker', () => {
  it('creates an issue and returns its reference', async () => {
    const store = new FakeGuardStore()
    const response = await handleRequest(createRequest(), env, createDependencies(store))

    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({
      ok: true,
      issueNumber: 42,
      issueUrl: 'https://github.com/org/repo/issues/42',
    })
    expect(store.completed).toHaveLength(1)
  })

  it('returns an existing completed submission without creating another issue', async () => {
    const store = new FakeGuardStore()
    store.existing = {
      status: 'complete',
      issueNumber: 17,
      issueUrl: 'https://github.com/org/repo/issues/17',
    }
    const dependencies = createDependencies(store)
    const response = await handleRequest(createRequest(), env, dependencies)

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ ok: true, issueNumber: 17 })
    expect(dependencies.issueCreator.create).not.toHaveBeenCalled()
  })

  it('rejects a submission whose idempotency key is already pending', async () => {
    const store = new FakeGuardStore()
    store.existing = { status: 'pending', issueNumber: null, issueUrl: null }
    const dependencies = createDependencies(store)
    const response = await handleRequest(createRequest(), env, dependencies)

    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({ ok: false, error: 'duplicate_pending' })
    expect(dependencies.issueCreator.create).not.toHaveBeenCalled()
  })

  it('recovers an issue created before D1 completion', async () => {
    const store = new FakeGuardStore()
    store.existing = { status: 'pending', issueNumber: null, issueUrl: null }
    const dependencies = createDependencies(store)
    vi.mocked(dependencies.issueCreator.findByIdempotencyKey).mockResolvedValue({
      ok: true,
      issueNumber: 23,
      issueUrl: 'https://github.com/org/repo/issues/23',
    })

    const response = await handleRequest(createRequest(), env, dependencies)

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ ok: true, issueNumber: 23 })
    expect(dependencies.issueCreator.create).not.toHaveBeenCalled()
    expect(store.completed).toHaveLength(1)
  })

  it('rejects an oversized streamed body without trusting content length', async () => {
    const oversizedBody = JSON.stringify({
      ...payload,
      description: 'a'.repeat(20_000),
    })
    const response = await handleRequest(
      new Request('https://feedback.example/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://bimsnacks.no',
        },
        body: oversizedBody,
      }),
      env,
      createDependencies(new FakeGuardStore()),
    )

    expect(response.status).toBe(413)
    expect(await response.json()).toEqual({ ok: false, error: 'invalid_request' })
  })

  it('rejects unapproved origins without CORS headers', async () => {
    const response = await handleRequest(
      createRequest(payload, 'https://attacker.example'),
      env,
      createDependencies(new FakeGuardStore()),
    )

    expect(response.status).toBe(403)
    expect(response.headers.has('Access-Control-Allow-Origin')).toBe(false)
  })

  it('releases the idempotency reservation after a failed challenge', async () => {
    const store = new FakeGuardStore()
    const response = await handleRequest(
      createRequest(),
      env,
      createDependencies(store, { challengePassed: false }),
    )

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ ok: false, error: 'challenge_failed' })
    expect(store.released).toEqual([payload.idempotencyKey])
  })

  it('rejects rate-limited submissions', async () => {
    const store = new FakeGuardStore()
    store.rateAllowed = false
    const response = await handleRequest(createRequest(), env, createDependencies(store))

    expect(response.status).toBe(429)
    expect(await response.json()).toEqual({ ok: false, error: 'rate_limited' })
  })

  it('returns a safe error when GitHub fails', async () => {
    const store = new FakeGuardStore()
    const response = await handleRequest(
      createRequest(),
      env,
      createDependencies(store, {
        createIssue: vi.fn().mockRejectedValue(new Error('secret upstream detail')),
      }),
    )

    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ ok: false, error: 'upstream_error' })
    expect(store.released).toEqual([payload.idempotencyKey])
  })

  it('supports CORS preflight only for allowed origins', async () => {
    const response = await handleRequest(
      new Request('https://feedback.example/feedback', {
        method: 'OPTIONS',
        headers: { Origin: 'https://bimsnacks.no' },
      }),
      env,
    )

    expect(response.status).toBe(204)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://bimsnacks.no')
  })
})
