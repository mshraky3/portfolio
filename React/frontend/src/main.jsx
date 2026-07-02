import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import './index.css'
import App from './App.jsx'
import Tracker from './components/Tracker/Tracker.jsx'

// Secret, passphrase-gated private route. Change this token to keep it obscure.
const SECRET_HASH = '#/hq'

function Root() {
  const isTracker = window.location.hash.startsWith(SECRET_HASH)
  if (isTracker) {
    // keep the private page out of search engines
    const m = document.createElement('meta')
    m.name = 'robots'
    m.content = 'noindex, nofollow'
    document.head.appendChild(m)
    return <Tracker />
  }
  return (
    <>
      <App />
      <SpeedInsights />
      <Analytics />
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
