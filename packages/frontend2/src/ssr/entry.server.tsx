import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App, type SsrData } from '../app/App'
import { initManifest } from '../common/manifest'

export interface RenderResult {
  html: string
  head?: string
}

export function render(ssrData: SsrData): RenderResult {
  initManifest(ssrData.manifest)
  const html = renderToString(
    <StrictMode>
      <App ssrData={ssrData} />
    </StrictMode>,
  )
  return { html }
}
