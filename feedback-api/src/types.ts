import type {
  FeedbackErrorCode,
  FeedbackRequest,
  FeedbackSuccessResponse,
} from '../../shared/feedback-contract'

export interface Env {
  DB: D1Database
  ALLOWED_ORIGINS: string
  ALLOWED_PAGE_HOSTS: string
  FEEDBACK_ENABLED: string
  GITHUB_OWNER: string
  GITHUB_REPOSITORY: string
  RATE_LIMIT_MAX: string
  RATE_LIMIT_WINDOW_SECONDS: string
  TURNSTILE_EXPECTED_ACTION: string
  TURNSTILE_EXPECTED_HOSTS: string
  TURNSTILE_SECRET_KEY: string
  RATE_LIMIT_SECRET: string
  GITHUB_APP_ID: string
  GITHUB_APP_INSTALLATION_ID: string
  GITHUB_APP_PRIVATE_KEY: string
}

export interface TurnstileVerifier {
  verify(token: string, remoteIp: string | null, idempotencyKey: string): Promise<boolean>
}

export interface IssueCreator {
  create(request: FeedbackRequest): Promise<FeedbackSuccessResponse>
  findByIdempotencyKey(idempotencyKey: string): Promise<FeedbackSuccessResponse | null>
}

export interface ExistingSubmission {
  status: 'pending' | 'complete'
  issueNumber: number | null
  issueUrl: string | null
}

export interface GuardStore {
  reserveSubmission(idempotencyKey: string, now: number): Promise<ExistingSubmission | null>
  completeSubmission(
    idempotencyKey: string,
    result: FeedbackSuccessResponse,
    now: number,
  ): Promise<void>
  releaseSubmission(idempotencyKey: string): Promise<void>
  consumeRateLimit(
    fingerprint: string,
    now: number,
    windowSeconds: number,
    maximum: number,
  ): Promise<boolean>
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: FeedbackErrorCode,
  ) {
    super(code)
  }
}
