import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { App, type SsrData } from '../app/App'

declare global {
  interface Window {
    __SSR_DATA__: SsrData
  }
}

// biome-ignore lint/style/noNonNullAssertion: It's there
const root = document.getElementById('root')!
hydrateRoot(
  root,
  <StrictMode>
    <App ssrData={window.__SSR_DATA__} />
  </StrictMode>,
)
