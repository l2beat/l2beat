import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App, type SsrData } from '../app/App'

export interface RenderResult {
  html: string
  head?: string
}

export function render(ssrData: SsrData): RenderResult {
  const html = renderToString(
    <StrictMode>
      <App ssrData={ssrData} />
    </StrictMode>,
  )
  return { html }
}
