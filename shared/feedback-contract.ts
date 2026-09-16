export const FEEDBACK_CATEGORIES = [
  'question',
  'improvement',
  'content_error',
  'technical_error',
  'other',
] as const

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number]
export type FeedbackLanguage = 'no' | 'en'

export interface FeedbackRequest {
  category: FeedbackCategory
  description: string
  pageUrl: string
  pagePath: string
  pageTitle: string
  language: FeedbackLanguage
  appVersion: string
  honeypot: string
  idempotencyKey: string
  turnstileToken: string
}

export interface FeedbackSuccessResponse {
  ok: true
  issueNumber: number
  issueUrl: string
}

export const FEEDBACK_ERROR_CODES = [
  'disabled',
  'invalid_request',
  'challenge_failed',
  'rate_limited',
  'duplicate_pending',
  'configuration_error',
  'upstream_error',
] as const

export type FeedbackErrorCode = (typeof FEEDBACK_ERROR_CODES)[number]

export interface FeedbackErrorResponse {
  ok: false
  error: FeedbackErrorCode
}

export type FeedbackResponse = FeedbackSuccessResponse | FeedbackErrorResponse
