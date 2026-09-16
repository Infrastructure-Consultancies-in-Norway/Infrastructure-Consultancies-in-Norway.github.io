import { useEffect, useRef } from 'react'

interface TurnstileRenderOptions {
  sitekey: string
  callback: (token: string) => void
  'expired-callback': () => void
  'error-callback': () => void
  action: string
  theme: 'light'
  language: 'no' | 'en'
}

interface TurnstileApi {
  render(container: HTMLElement, options: TurnstileRenderOptions): string
  remove(widgetId: string): void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let turnstileLoader: Promise<TurnstileApi> | null = null

const loadTurnstile = (): Promise<TurnstileApi> => {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile)
  }
  if (turnstileLoader) {
    return turnstileLoader
  }

  turnstileLoader = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-snacks-turnstile]',
    )
    const script = existingScript ?? document.createElement('script')

    const handleLoad = () => {
      if (window.turnstile) {
        resolve(window.turnstile)
      } else {
        reject(new Error('Turnstile did not initialize'))
      }
    }
    const handleError = () => reject(new Error('Turnstile could not be loaded'))

    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', handleError, { once: true })

    if (!existingScript) {
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.dataset.snacksTurnstile = 'true'
      document.head.appendChild(script)
    }
  }).catch((error: unknown) => {
    turnstileLoader = null
    throw error
  })

  return turnstileLoader
}

interface TurnstileChallengeProps {
  siteKey: string
  language: 'no' | 'en'
  onToken: (token: string) => void
  onUnavailable: () => void
}

const TurnstileChallenge = ({
  siteKey,
  language,
  onToken,
  onUnavailable,
}: TurnstileChallengeProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let disposed = false
    let widgetId: string | null = null

    void loadTurnstile()
      .then((turnstile) => {
        if (disposed || !containerRef.current) return
        widgetId = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: onToken,
          'expired-callback': () => onToken(''),
          'error-callback': onUnavailable,
          action: 'feedback_submit',
          theme: 'light',
          language,
        })
      })
      .catch(onUnavailable)

    return () => {
      disposed = true
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId)
      }
    }
  }, [language, onToken, onUnavailable, siteKey])

  return <div ref={containerRef} className="feedback-turnstile" />
}

export default TurnstileChallenge
