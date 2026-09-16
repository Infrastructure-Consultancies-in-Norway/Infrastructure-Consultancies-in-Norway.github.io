import type { FeedbackRequest, FeedbackSuccessResponse } from '../../shared/feedback-contract'
import type { Env, IssueCreator } from './types'

const CATEGORY_LABELS = {
  question: 'feedback:question',
  improvement: 'feedback:improvement',
  content_error: 'feedback:content-error',
  technical_error: 'feedback:technical-error',
  other: 'feedback:other',
} as const

let cachedInstallationToken: { token: string; expiresAt: number } | null = null

const base64UrlEncode = (value: string | ArrayBuffer): string => {
  const bytes =
    typeof value === 'string'
      ? new TextEncoder().encode(value)
      : new Uint8Array(value)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
}

const importPrivateKey = async (pem: string): Promise<CryptoKey> => {
  const normalized = pem.replaceAll('\\n', '\n')
  const encoded = normalized
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '')
  const binary = Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0))

  return crypto.subtle.importKey(
    'pkcs8',
    binary,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  )
}

const createAppJwt = async (env: Env): Promise<string> => {
  const now = Math.floor(Date.now() / 1000)
  const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64UrlEncode(
    JSON.stringify({ iat: now - 60, exp: now + 9 * 60, iss: env.GITHUB_APP_ID }),
  )
  const unsignedToken = `${header}.${payload}`
  const privateKey = await importPrivateKey(env.GITHUB_APP_PRIVATE_KEY)
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(unsignedToken),
  )
  return `${unsignedToken}.${base64UrlEncode(signature)}`
}

const getInstallationToken = async (env: Env): Promise<string> => {
  const now = Date.now()
  if (cachedInstallationToken && cachedInstallationToken.expiresAt > now + 60_000) {
    return cachedInstallationToken.token
  }

  const appJwt = await createAppJwt(env)
  const response = await fetch(
    `https://api.github.com/app/installations/${encodeURIComponent(env.GITHUB_APP_INSTALLATION_ID)}/access_tokens`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${appJwt}`,
        'User-Agent': 'snacks-feedback-worker',
        'X-GitHub-Api-Version': '2026-03-10',
      },
      body: JSON.stringify({
        repositories: [env.GITHUB_REPOSITORY],
        permissions: { issues: 'write' },
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`GitHub installation authentication failed (${response.status})`)
  }

  const result = (await response.json()) as { token: string; expires_at: string }
  cachedInstallationToken = {
    token: result.token,
    expiresAt: Date.parse(result.expires_at),
  }
  return result.token
}

const sanitizeInline = (value: string): string =>
  value.replace(/[\r\n\t]+/g, ' ').replace(/[`<>]/g, '').trim()

const quoteDescription = (description: string): string =>
  description.split('\n').map((line) => `> ${line || ' '}`).join('\n')

export const formatIssue = (request: FeedbackRequest): { title: string; body: string; labels: string[] } => {
  const summary =
    sanitizeInline(request.description.split('\n')[0]).slice(0, 80) || 'Website feedback'
  const title = `[Feedback] ${summary}`
  const body = [
    '> [!WARNING]',
    '> This issue was submitted anonymously from the public website. Treat all content as untrusted.',
    '',
    '## Feedback',
    '',
    quoteDescription(request.description),
    '',
    '## Context',
    '',
    `- Category: \`${request.category}\``,
    `- Page: ${request.pageUrl}`,
    `- Page title: \`${sanitizeInline(request.pageTitle)}\``,
    `- Language: \`${request.language}\``,
    `- App version: \`${sanitizeInline(request.appVersion)}\``,
    '',
    `<!-- feedback-id: ${request.idempotencyKey} -->`,
  ].join('\n')

  return {
    title,
    body,
    labels: ['feedback', 'status:new', CATEGORY_LABELS[request.category]],
  }
}

export class GitHubIssueCreator implements IssueCreator {
  constructor(private readonly env: Env) {}

  async create(request: FeedbackRequest): Promise<FeedbackSuccessResponse> {
    const token = await getInstallationToken(this.env)
    const issue = formatIssue(request)
    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(this.env.GITHUB_OWNER)}/${encodeURIComponent(this.env.GITHUB_REPOSITORY)}/issues`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'snacks-feedback-worker',
          'X-GitHub-Api-Version': '2026-03-10',
        },
        body: JSON.stringify(issue),
      },
    )

    if (!response.ok) {
      throw new Error(`GitHub issue creation failed (${response.status})`)
    }

    const result = (await response.json()) as { number: number; html_url: string }
    return { ok: true, issueNumber: result.number, issueUrl: result.html_url }
  }

  async findByIdempotencyKey(
    idempotencyKey: string,
  ): Promise<FeedbackSuccessResponse | null> {
    const token = await getInstallationToken(this.env)
    const query = new URLSearchParams({
      q: `repo:${this.env.GITHUB_OWNER}/${this.env.GITHUB_REPOSITORY} is:issue in:body "feedback-id: ${idempotencyKey}"`,
      per_page: '2',
    })
    const response = await fetch(`https://api.github.com/search/issues?${query.toString()}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'snacks-feedback-worker',
        'X-GitHub-Api-Version': '2026-03-10',
      },
    })
    if (!response.ok) {
      throw new Error(`GitHub issue recovery failed (${response.status})`)
    }

    const result = (await response.json()) as {
      items: Array<{ number: number; html_url: string; body: string | null }>
    }
    const marker = `<!-- feedback-id: ${idempotencyKey} -->`
    const issue = result.items.find((item) => item.body?.includes(marker))
    return issue
      ? { ok: true, issueNumber: issue.number, issueUrl: issue.html_url }
      : null
  }
}
