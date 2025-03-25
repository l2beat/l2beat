import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App, type SsrData } from './App'

export function render(ssrData: SsrData) {
  const html = renderToString(
    <StrictMode>
      <App ssrData={ssrData} />
    </StrictMode>,
  )
  return { html }
}
