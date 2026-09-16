import { afterEach, describe, expect, it, vi } from 'vitest'
import { CloudflareTurnstileVerifier, createRateLimitFingerprint } from '../src/security'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CloudflareTurnstileVerifier', () => {
  it('accepts only successful feedback challenges from an allowed hostname', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          action: 'feedback_submit',
          hostname: 'bimsnacks.no',
        }),
        { status: 200 },
      ),
    )
    const verifier = new CloudflareTurnstileVerifier(
      'secret',
      ['bimsnacks.no'],
      'feedback_submit',
    )

    await expect(verifier.verify('token', '192.0.2.1', 'request-id')).resolves.toBe(true)
  })

  it.each([
    { success: false, action: 'feedback_submit', hostname: 'bimsnacks.no' },
    { success: true, action: 'other_action', hostname: 'bimsnacks.no' },
    { success: true, action: 'feedback_submit', hostname: 'attacker.example' },
  ])('rejects an invalid challenge response', async (body) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(body), { status: 200 }),
    )
    const verifier = new CloudflareTurnstileVerifier(
      'secret',
      ['bimsnacks.no'],
      'feedback_submit',
    )

    await expect(verifier.verify('token', null, 'request-id')).resolves.toBe(false)
  })
})

describe('createRateLimitFingerprint', () => {
  it('creates a stable keyed hash without exposing the IP address', async () => {
    const first = await createRateLimitFingerprint('192.0.2.1', {
      RATE_LIMIT_SECRET: 'secret',
    })
    const second = await createRateLimitFingerprint('192.0.2.1', {
      RATE_LIMIT_SECRET: 'secret',
    })

    expect(first).toBe(second)
    expect(first).not.toContain('192.0.2.1')
    expect(first).toMatch(/^[a-f0-9]{64}$/)
  })
})
