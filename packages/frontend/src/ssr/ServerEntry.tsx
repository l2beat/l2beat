import { StrictMode } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { getPageElement } from '../pages/getPageElement'
import { Head } from './head/Head'
import type { RenderData, RenderResult } from './types'

export async function render(
  data: RenderData,
  url: string,
): Promise<RenderResult> {
  const pageElement = await getPageElement(data.ssr)
  // Set after the await: concurrent requests would otherwise overwrite it
  // before this synchronous render reads it.
  globalThis.__FIX_SSR_URL__ = url
  const html = renderToString(<StrictMode>{pageElement}</StrictMode>)
  const head = renderToStaticMarkup(
    <StrictMode>
      <Head {...data.head} />
    </StrictMode>,
  )
  return { html, head }
}
