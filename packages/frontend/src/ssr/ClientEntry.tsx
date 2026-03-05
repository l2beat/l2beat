import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { ClientPageRouter } from '../pages/ClientPageRouter'

// biome-ignore lint/style/noNonNullAssertion: It's there
const root = document.getElementById('root')!
hydrateRoot(
  root,
  <StrictMode>
    <ClientPageRouter ssrData={window.__SSR_DATA__} />
  </StrictMode>,
)
