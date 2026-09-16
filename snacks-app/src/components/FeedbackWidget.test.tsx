import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '../contexts/LanguageContext'
import FeedbackWidget from './FeedbackWidget'

const renderWidget = () =>
  render(
    <BrowserRouter>
      <LanguageProvider>
        <FeedbackWidget />
      </LanguageProvider>
    </BrowserRouter>,
  )

describe('FeedbackWidget', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState(null, '', '/begrep/bru?lang=no')
    vi.stubEnv('VITE_FEEDBACK_API_URL', 'https://feedback.example')
    vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'test-site-key')
    window.turnstile = {
      render: vi.fn((_container, options) => {
        options.callback('turnstile-token')
        return 'widget-id'
      }),
      remove: vi.fn(),
    }
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
    delete window.turnstile
  })

  it('captures context and submits feedback to the API', async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          issueNumber: 42,
          issueUrl: 'https://github.com/org/repo/issues/42',
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    renderWidget()

    await user.click(screen.getByRole('button', { name: 'Gi tilbakemelding' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('/begrep/bru?lang=no')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Forbedringsforslag'))
    await user.click(screen.getByRole('button', { name: 'Neste' }))
    await user.type(
      screen.getByLabelText('Beskriv innspillet'),
      'Denne forklaringen kan bli tydeligere.',
    )

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Send inn' })).toBeEnabled(),
    )
    await user.click(screen.getByRole('button', { name: 'Send inn' }))

    expect(await screen.findByText('Takk for innspillet!')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Se sak #42' })).toHaveAttribute(
      'href',
      'https://github.com/org/repo/issues/42',
    )

    const request = vi.mocked(fetch).mock.calls[0]
    expect(request[0]).toBe('https://feedback.example/feedback')
    const body = JSON.parse((request[1] as RequestInit).body as string)
    expect(body).toMatchObject({
      category: 'improvement',
      pagePath: '/begrep/bru?lang=no',
      language: 'no',
      turnstileToken: 'turnstile-token',
    })
    expect(body).not.toHaveProperty('email')
    expect(body).not.toHaveProperty('name')
  })

  it('closes with Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup()
    renderWidget()
    const trigger = screen.getByRole('button', { name: 'Gi tilbakemelding' })

    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
