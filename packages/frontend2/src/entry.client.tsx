import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { App } from './App'

// biome-ignore lint/style/noNonNullAssertion: It's there
const root = document.getElementById('root')!
hydrateRoot(
  root,
  <StrictMode>
    <App />
  </StrictMode>,
)
