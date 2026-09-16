import { describe, expect, it } from 'vitest'
import type { FeedbackRequest } from '../../shared/feedback-contract'
import { formatIssue } from '../src/github'

const request: FeedbackRequest = {
  category: 'content_error',
  description: '<script>alert(1)</script>\nIncorrect bridge definition.',
  pageUrl: 'https://bimsnacks.no/begrep/bru?lang=en',
  pagePath: '/begrep/bru?lang=en',
  pageTitle: 'Bridge `definition`',
  language: 'en',
  appVersion: '1.0.1',
  honeypot: '',
  idempotencyKey: '8e4d8af8-cbf7-4fb7-8a29-1186966a2742',
  turnstileToken: 'token',
}

describe('formatIssue', () => {
  it('separates untrusted feedback from managed metadata', () => {
    const issue = formatIssue(request)

    expect(issue.title).toBe('[Feedback] scriptalert(1)/script')
    expect(issue.body).toContain('> <script>alert(1)</script>')
    expect(issue.body).toContain('- Category: `content_error`')
    expect(issue.body).toContain('- Page title: `Bridge definition`')
    expect(issue.body).toContain(`<!-- feedback-id: ${request.idempotencyKey} -->`)
    expect(issue.labels).toEqual(['feedback', 'status:new', 'feedback:content-error'])
  })
})
