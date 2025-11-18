import { useState, useEffect } from 'react'

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const cookiesAccepted = document.cookie.indexOf('cookiesAccepted=true') !== -1
    if (!cookiesAccepted) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    setShowBanner(false)
    document.cookie = `cookiesAccepted=true; max-age=${60 * 60 * 24 * 30}; path=/`
  }

  if (!showBanner) return null

  return (
    <div className="bg-light text-dark p-3 fixed-bottom">
      <div className="container d-flex justify-content-between align-items-center">
        <span>We use cookies to ensure you get the best experience on our website.</span>
        <button className="btn btn-primary" onClick={acceptCookies}>
          Got it!
        </button>
      </div>
    </div>
  )
}

export default CookieBanner
