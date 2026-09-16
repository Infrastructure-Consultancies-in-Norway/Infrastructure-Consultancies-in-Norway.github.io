import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  FEEDBACK_CATEGORIES,
  type FeedbackCategory,
  type FeedbackErrorCode,
  type FeedbackRequest,
  type FeedbackResponse,
} from '../../../shared/feedback-contract'
import { useLanguage } from '../contexts/LanguageContext'
import TurnstileChallenge from './TurnstileChallenge'
import './FeedbackWidget.css'

const MINIMUM_DESCRIPTION_LENGTH = 10

const createIdempotencyKey = (): string => {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

const FeedbackWidget = () => {
  const location = useLocation()
  const { language, t } = useLanguage()
  const apiUrl = import.meta.env.VITE_FEEDBACK_API_URL?.replace(/\/$/, '') ?? ''
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? ''
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<1 | 2 | 'success'>(1)
  const [category, setCategory] = useState<FeedbackCategory | ''>('')
  const [description, setDescription] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [challengeGeneration, setChallengeGeneration] = useState(0)
  const [idempotencyKey, setIdempotencyKey] = useState(createIdempotencyKey)
  const [errorCode, setErrorCode] = useState<FeedbackErrorCode | 'network_error' | null>(
    null,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [issue, setIssue] = useState<{ number: number; url: string } | null>(null)

  const pageContext = useMemo(
    () => ({
      pageUrl: window.location.href,
      pagePath: `${location.pathname}${location.search}${location.hash}`,
      pageTitle: document.title,
    }),
    [location.hash, location.pathname, location.search],
  )

  const resetForm = useCallback(() => {
    setStep(1)
    setCategory('')
    setDescription('')
    setHoneypot('')
    setTurnstileToken('')
    setErrorCode(null)
    setIssue(null)
    setIsSubmitting(false)
    setChallengeGeneration((value) => value + 1)
    setIdempotencyKey(createIdempotencyKey())
  }, [])

  const open = () => {
    resetForm()
    setIsOpen(true)
  }

  const close = useCallback(() => {
    if (isSubmitting) return
    setIsOpen(false)
    window.setTimeout(() => triggerRef.current?.focus(), 0)
  }, [isSubmitting])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href]',
          ),
        ).filter((element) => element.tabIndex !== -1)
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first || !last) return

        if (event.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [close, isOpen])

  const handleChallengeUnavailable = useCallback(() => {
    setTurnstileToken('')
    setErrorCode('configuration_error')
  }, [])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErrorCode(null)

    if (
      !category ||
      description.trim().length < MINIMUM_DESCRIPTION_LENGTH ||
      !turnstileToken ||
      !apiUrl
    ) {
      setErrorCode(!apiUrl ? 'configuration_error' : 'invalid_request')
      return
    }

    const request: FeedbackRequest = {
      category,
      description: description.trim(),
      ...pageContext,
      language,
      appVersion: __APP_VERSION__,
      honeypot,
      idempotencyKey,
      turnstileToken,
    }

    setIsSubmitting(true)
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15_000)

    try {
      const response = await fetch(`${apiUrl}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      })
      const result = (await response.json()) as FeedbackResponse

      if (!response.ok || !result.ok) {
        setErrorCode(result.ok ? 'upstream_error' : result.error)
        setTurnstileToken('')
        setChallengeGeneration((value) => value + 1)
        return
      }

      setIssue({ number: result.issueNumber, url: result.issueUrl })
      setStep('success')
    } catch {
      setErrorCode('network_error')
      setTurnstileToken('')
      setChallengeGeneration((value) => value + 1)
    } finally {
      window.clearTimeout(timeout)
      setIsSubmitting(false)
    }
  }

  const errorMessage = errorCode ? t(`feedback.error.${errorCode}`) : null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="feedback-trigger"
        onClick={open}
        aria-haspopup="dialog"
      >
        <i className="bi bi-chat-dots" aria-hidden="true" />
        <span>{t('feedback.trigger')}</span>
      </button>

      {isOpen && (
        <div className="feedback-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) close()
        }}>
          <section
            ref={dialogRef}
            className="feedback-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
          >
            <header className="feedback-header">
              <div>
                <h2 id="feedback-title">{t('feedback.title')}</h2>
                {step !== 'success' && (
                  <p className="feedback-progress" aria-label={t('feedback.progressLabel')}>
                    <span className={step === 1 ? 'active' : 'complete'} />
                    <span className={step === 2 ? 'active' : ''} />
                  </p>
                )}
              </div>
              <button
                ref={closeRef}
                type="button"
                className="feedback-close"
                onClick={close}
                disabled={isSubmitting}
                aria-label={t('feedback.close')}
              >
                &times;
              </button>
            </header>

            {step === 1 && (
              <div className="feedback-content">
                <fieldset>
                  <legend>{t('feedback.category.legend')}</legend>
                  <div className="feedback-categories">
                    {FEEDBACK_CATEGORIES.map((value) => (
                      <label key={value} className={category === value ? 'selected' : ''}>
                        <input
                          type="radio"
                          name="feedback-category"
                          value={value}
                          checked={category === value}
                          onChange={() => setCategory(value)}
                        />
                        <span>{t(`feedback.category.${value}`)}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="feedback-context">
                  <h3>{t('feedback.context.title')}</h3>
                  <dl>
                    <div>
                      <dt>{t('feedback.context.page')}</dt>
                      <dd>{pageContext.pageTitle}</dd>
                    </div>
                    <div>
                      <dt>URL</dt>
                      <dd>{pageContext.pagePath}</dd>
                    </div>
                  </dl>
                  <p>{t('feedback.context.help')}</p>
                </div>

                <p className="feedback-public-note">
                  <i className="bi bi-info-circle" aria-hidden="true" />
                  {t('feedback.publicNotice')}
                </p>
                <div className="feedback-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!category}
                    onClick={() => setStep(2)}
                  >
                    {t('feedback.next')}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <form className="feedback-content" onSubmit={submit}>
                <label className="feedback-description-label" htmlFor="feedback-description">
                  {t('feedback.description.label')}
                </label>
                <textarea
                  id="feedback-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  minLength={MINIMUM_DESCRIPTION_LENGTH}
                  maxLength={4000}
                  rows={7}
                  required
                  placeholder={t('feedback.description.placeholder')}
                  disabled={isSubmitting}
                />
                <p className="feedback-character-count">
                  {description.length} / 4000
                </p>

                <div className="feedback-honeypot" aria-hidden="true">
                  <label htmlFor="feedback-company">Company</label>
                  <input
                    id="feedback-company"
                    value={honeypot}
                    onChange={(event) => setHoneypot(event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {turnstileSiteKey ? (
                  <TurnstileChallenge
                    key={challengeGeneration}
                    siteKey={turnstileSiteKey}
                    language={language}
                    onToken={setTurnstileToken}
                    onUnavailable={handleChallengeUnavailable}
                  />
                ) : (
                  <p className="alert alert-warning">{t('feedback.error.configuration_error')}</p>
                )}

                {errorMessage && (
                  <p className="alert alert-danger" role="alert">
                    {errorMessage}
                  </p>
                )}

                <div className="feedback-actions">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setErrorCode(null)
                      setStep(1)
                    }}
                    disabled={isSubmitting}
                  >
                    {t('feedback.back')}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      isSubmitting ||
                      description.trim().length < MINIMUM_DESCRIPTION_LENGTH ||
                      !turnstileToken ||
                      !apiUrl
                    }
                  >
                    {isSubmitting ? t('feedback.sending') : t('feedback.submit')}
                  </button>
                </div>
              </form>
            )}

            {step === 'success' && issue && (
              <div className="feedback-content feedback-success">
                <i className="bi bi-check-circle" aria-hidden="true" />
                <h3>{t('feedback.success.title')}</h3>
                <p>{t('feedback.success.message')}</p>
                <a href={issue.url} target="_blank" rel="noreferrer">
                  {t('feedback.success.reference')} #{issue.number}
                </a>
                <button type="button" className="btn btn-primary" onClick={close}>
                  {t('feedback.close')}
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  )
}

export default FeedbackWidget
