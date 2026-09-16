import type { ExistingSubmission, GuardStore } from './types'
import type { FeedbackSuccessResponse } from '../../shared/feedback-contract'

const IDEMPOTENCY_RETENTION_SECONDS = 24 * 60 * 60

export class D1GuardStore implements GuardStore {
  constructor(private readonly database: D1Database) {}

  async reserveSubmission(
    idempotencyKey: string,
    now: number,
  ): Promise<ExistingSubmission | null> {
    await this.cleanup(now)

    const result = await this.database
      .prepare(
        `INSERT OR IGNORE INTO submission_idempotency
          (idempotency_key, status, created_at, expires_at)
         VALUES (?1, 'pending', ?2, ?3)`,
      )
      .bind(idempotencyKey, now, now + IDEMPOTENCY_RETENTION_SECONDS)
      .run()

    if ((result.meta.changes ?? 0) > 0) {
      return null
    }

    const existing = await this.database
      .prepare(
        `SELECT status, issue_number AS issueNumber, issue_url AS issueUrl
         FROM submission_idempotency
         WHERE idempotency_key = ?1 AND expires_at > ?2`,
      )
      .bind(idempotencyKey, now)
      .first<ExistingSubmission>()

    return existing ?? { status: 'pending', issueNumber: null, issueUrl: null }
  }

  async completeSubmission(
    idempotencyKey: string,
    result: FeedbackSuccessResponse,
    now: number,
  ): Promise<void> {
    await this.database
      .prepare(
        `UPDATE submission_idempotency
         SET status = 'complete', issue_number = ?2, issue_url = ?3, expires_at = ?4
         WHERE idempotency_key = ?1`,
      )
      .bind(
        idempotencyKey,
        result.issueNumber,
        result.issueUrl,
        now + IDEMPOTENCY_RETENTION_SECONDS,
      )
      .run()
  }

  async releaseSubmission(idempotencyKey: string): Promise<void> {
    await this.database
      .prepare('DELETE FROM submission_idempotency WHERE idempotency_key = ?1')
      .bind(idempotencyKey)
      .run()
  }

  async consumeRateLimit(
    fingerprint: string,
    now: number,
    windowSeconds: number,
    maximum: number,
  ): Promise<boolean> {
    const windowStart = Math.floor(now / windowSeconds) * windowSeconds
    const result = await this.database
      .prepare(
        `INSERT INTO rate_limits
          (fingerprint, window_start, request_count, expires_at)
         VALUES (?1, ?2, 1, ?3)
         ON CONFLICT (fingerprint, window_start)
         DO UPDATE SET request_count = request_count + 1
         RETURNING request_count AS requestCount`,
      )
      .bind(fingerprint, windowStart, windowStart + windowSeconds * 2)
      .first<{ requestCount: number }>()

    return Boolean(result && result.requestCount <= maximum)
  }

  private async cleanup(now: number): Promise<void> {
    await this.database.batch([
      this.database.prepare('DELETE FROM rate_limits WHERE expires_at <= ?1').bind(now),
      this.database.prepare('DELETE FROM submission_idempotency WHERE expires_at <= ?1').bind(now),
    ])
  }
}
