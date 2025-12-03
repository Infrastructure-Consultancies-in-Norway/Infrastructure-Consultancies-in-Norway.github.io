import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App'
import './index.css'

const REDIRECT_STORAGE_KEY = 'snacksAppRedirectPath'

if (typeof window !== 'undefined') {
  const redirectPath = window.sessionStorage.getItem(REDIRECT_STORAGE_KEY)

  if (redirectPath) {
    window.sessionStorage.removeItem(REDIRECT_STORAGE_KEY)
    const currentLocation = window.location.pathname + window.location.search + window.location.hash

    if (redirectPath !== currentLocation) {
      window.history.replaceState(null, '', redirectPath)
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
