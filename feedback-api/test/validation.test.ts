import { describe, expect, it } from 'vitest'
import type { FeedbackRequest } from '../../shared/feedback-contract'
import { ApiError } from '../src/types'
import { parseFeedbackRequest } from '../src/validation'

const validRequest: FeedbackRequest = {
  category: 'improvement',
  description: 'Please improve this explanation.',
  pageUrl: 'https://bimsnacks.no/begrep/example?lang=en',
  pagePath: '/begrep/example?lang=en',
  pageTitle: 'SNACks',
  language: 'en',
  appVersion: '1.0.1',
  honeypot: '',
  idempotencyKey: '8e4d8af8-cbf7-4fb7-8a29-1186966a2742',
  turnstileToken: 'verified-token',
}

const env = { ALLOWED_PAGE_HOSTS: 'bimsnacks.no' }

describe('parseFeedbackRequest', () => {
  it('normalizes and accepts a valid request', () => {
    const result = parseFeedbackRequest(
      { ...validRequest, description: '  First line\r\nSecond line  ' },
      env,
    )

    expect(result.description).toBe('First line\nSecond line')
  })

  it.each([
    ['unknown category', { category: 'security' }],
    ['short description', { description: 'short' }],
    ['foreign page host', { pageUrl: 'https://example.com/', pagePath: '/' }],
    ['mismatched page path', { pagePath: '/different' }],
    ['filled honeypot', { honeypot: 'bot value' }],
    ['invalid idempotency key', { idempotencyKey: 'not-a-uuid' }],
  ])('rejects %s', (_name, override) => {
    expect(() => parseFeedbackRequest({ ...validRequest, ...override }, env)).toThrow(ApiError)
  })

  it('permits localhost HTTP pages for local development', () => {
    const result = parseFeedbackRequest(
      {
        ...validRequest,
        pageUrl: 'http://localhost:5173/contact?lang=no',
        pagePath: '/contact?lang=no',
      },
      env,
    )

    expect(result.pageUrl).toBe('http://localhost:5173/contact?lang=no')
  })
})
