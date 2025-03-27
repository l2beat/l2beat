import { StrictMode } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import type { SsrData } from '../pages/ClientPageRouter'
import { ClientPageRouter } from '../pages/ClientPageRouter'
import type { HeadProps } from './head/Head'
import { Head } from './head/Head'

export interface RenderData {
  ssr: SsrData
  head: HeadProps
}

export type RenderFunction = (data: RenderData) => string

export interface RenderResult {
  html: string
  head: string
}

export function render(data: RenderData): RenderResult {
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
