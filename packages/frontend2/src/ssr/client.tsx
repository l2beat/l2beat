import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { ClientPageRouter, type SsrData } from '../pages/ClientPageRouter'

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
    <ClientPageRouter ssrData={window.__SSR_DATA__} />
  </StrictMode>,
)
