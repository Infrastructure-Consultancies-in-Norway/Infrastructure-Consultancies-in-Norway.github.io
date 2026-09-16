import {
  FEEDBACK_CATEGORIES,
  type FeedbackCategory,
  type FeedbackLanguage,
  type FeedbackRequest,
} from '../../shared/feedback-contract'
import { ApiError, type Env } from './types'

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isStringWithin = (value: unknown, minimum: number, maximum: number): value is string =>
  typeof value === 'string' && value.length >= minimum && value.length <= maximum

const normalizeDescription = (value: string): string =>
  value.replace(/\r\n?/g, '\n').replace(/\u0000/g, '').trim()

export const parseFeedbackRequest = (
  value: unknown,
  env: Pick<Env, 'ALLOWED_PAGE_HOSTS'>,
): FeedbackRequest => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ApiError(400, 'invalid_request')
  }

  const input = value as Record<string, unknown>
  const description =
    typeof input.description === 'string' ? normalizeDescription(input.description) : ''

  if (
    !FEEDBACK_CATEGORIES.includes(input.category as FeedbackCategory) ||
    !isStringWithin(description, 10, 4000) ||
    !isStringWithin(input.pageUrl, 1, 2000) ||
    !isStringWithin(input.pagePath, 1, 1000) ||
    !isStringWithin(input.pageTitle, 1, 200) ||
    (input.language !== 'no' && input.language !== 'en') ||
    !isStringWithin(input.appVersion, 1, 64) ||
    input.honeypot !== '' ||
    !isStringWithin(input.idempotencyKey, 1, 64) ||
    !UUID_PATTERN.test(input.idempotencyKey) ||
    !isStringWithin(input.turnstileToken, 1, 2048)
  ) {
    throw new ApiError(400, 'invalid_request')
  }

  let pageUrl: URL
  try {
    pageUrl = new URL(input.pageUrl)
  } catch {
    throw new ApiError(400, 'invalid_request')
  }

  const allowedHosts = env.ALLOWED_PAGE_HOSTS.split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean)
  const isLocalDevelopment =
    pageUrl.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(pageUrl.hostname)

  if (
    (pageUrl.protocol !== 'https:' && !isLocalDevelopment) ||
    (!allowedHosts.includes(pageUrl.hostname.toLowerCase()) && !isLocalDevelopment) ||
    `${pageUrl.pathname}${pageUrl.search}${pageUrl.hash}` !== input.pagePath
  ) {
    throw new ApiError(400, 'invalid_request')
  }

  return {
    category: input.category as FeedbackCategory,
    description,
    pageUrl: pageUrl.toString(),
    pagePath: input.pagePath,
    pageTitle: input.pageTitle.trim(),
    language: input.language as FeedbackLanguage,
    appVersion: input.appVersion.trim(),
    honeypot: '',
    idempotencyKey: input.idempotencyKey,
    turnstileToken: input.turnstileToken,
  }
}
