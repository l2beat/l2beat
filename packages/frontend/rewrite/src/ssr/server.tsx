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

export type RenderFunction = (data: RenderData, url: string) => string

export interface RenderResult {
  html: string
  head: string
}

export function render(data: RenderData, url: string): RenderResult {
  // @ts-expect-error how to type this?
  globalThis.globalThis.__FIX_SSR_URL__ = url
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
