import { StrictMode } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { ClientPageRouter } from '../pages/ClientPageRouter'
import { Head } from './head/Head'
import type { RenderData, RenderResult } from './types'

export function render(data: RenderData, url: string): RenderResult {
  globalThis.__FIX_SSR_URL__ = url
  const html = renderToString(
    <StrictMode>
      <ClientPageRouter ssrData={data.ssr} />
    </StrictMode>,
  )
  const head = renderToStaticMarkup(
    <StrictMode>
      <Head {...data.head} />
    </StrictMode>,
  )
  return { html, head }
}
