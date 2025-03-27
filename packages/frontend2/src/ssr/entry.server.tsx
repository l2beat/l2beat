import { StrictMode } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { App } from '../app/App'
import { Head } from './head/Head'
import type { RenderData } from './types'

export interface RenderResult {
  html: string
  head: string
}

export function render(data: RenderData): RenderResult {
  const html = renderToString(
    <StrictMode>
      <App ssrData={data.ssr} />
    </StrictMode>,
  )
  const head = renderToStaticMarkup(
    <StrictMode>
      <Head {...data.head} />
    </StrictMode>,
  )
  return { html, head }
}
