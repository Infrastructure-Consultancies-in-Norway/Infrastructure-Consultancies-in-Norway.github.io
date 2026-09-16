import type { Env, TurnstileVerifier } from './types'

interface TurnstileResponse {
  success?: boolean
  action?: string
  hostname?: string
}

export class CloudflareTurnstileVerifier implements TurnstileVerifier {
  constructor(
    private readonly secret: string,
    private readonly allowedHosts: string[],
    private readonly expectedAction: string,
  ) {}

  async verify(token: string, remoteIp: string | null, idempotencyKey: string): Promise<boolean> {
    const body = new FormData()
    body.set('secret', this.secret)
    body.set('response', token)
    body.set('idempotency_key', idempotencyKey)
    if (remoteIp) {
      body.set('remoteip', remoteIp)
    }

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body },
    )
    if (!response.ok) {
      return false
    }

    const result = (await response.json()) as TurnstileResponse
    return (
      result.success === true &&
      result.action === this.expectedAction &&
      typeof result.hostname === 'string' &&
      this.allowedHosts.includes(result.hostname.toLowerCase())
    )
  }
}

const bytesToHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

export const createRateLimitFingerprint = async (
  remoteIp: string | null,
  env: Pick<Env, 'RATE_LIMIT_SECRET'>,
): Promise<string> => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(env.RATE_LIMIT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(remoteIp ?? 'unknown'),
  )
  return bytesToHex(new Uint8Array(signature))
}
