import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { ClientPageRouter } from '../pages/ClientPageRouter'

// Reload when restored from bfcache so cookie-dependent SSR content (e.g. unread changelog count) stays fresh
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload()
  }
})

// biome-ignore lint/style/noNonNullAssertion: It's there
const root = document.getElementById('root')!
hydrateRoot(
  root,
  <StrictMode>
    <ClientPageRouter ssrData={window.__SSR_DATA__} />
  </StrictMode>,
)
