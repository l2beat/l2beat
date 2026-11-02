import { StrictMode } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { getClientGlossaryTerms } from '~/server/features/glossary/getClientGlossaryTerms'
import { getGlossaryTerms } from '~/server/features/glossary/getGlossaryTerms'
import { linkGlossaryTerms } from '~/utils/markdown/glossaryPlugin'
import { getPageElement } from '../pages/getPageElement'
import { Head } from './head/Head'
import type { RenderData, RenderResult } from './types'

export async function render(
  data: RenderData,
  url: string,
): Promise<RenderResult> {
  const glossaryTerms = getGlossaryTerms()
  const linkedTermIds = new Set<string>()
  const pageElement = await getPageElement(
    data.ssr,
    linkGlossaryTerms(glossaryTerms, (termId) => linkedTermIds.add(termId)),
  )
  // Set after the await: concurrent requests would otherwise overwrite it
  // before this synchronous render reads it.
  globalThis.__FIX_SSR_URL__ = url
  const html = renderToString(pageElement)
  const head = renderToStaticMarkup(
    <StrictMode>
      <Head {...data.head} />
    </StrictMode>,
  )
  return {
    html,
    head,
    glossaryTerms: getClientGlossaryTerms(
      glossaryTerms,
      linkedTermIds,
      data.ssr.props,
    ),
  }
}
