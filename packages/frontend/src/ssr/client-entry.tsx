import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import type { Plausible } from '~/hooks/use-tracking'
import { ClientPageRouter, type SsrData } from '../pages/ClientPageRouter'

declare global {
  interface Window {
    __SSR_DATA__: SsrData
    __ENV__: Record<string, string>
    plausible: Plausible
  }
}

// biome-ignore lint/style/noNonNullAssertion: It's there
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = document.getElementById('root')!
hydrateRoot(
  root,
  <StrictMode>
    <ClientPageRouter ssrData={window.__SSR_DATA__} />
  </StrictMode>,
)
