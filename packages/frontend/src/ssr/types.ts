import type { GlossaryTerm } from '../components/markdown/GlossaryContext'
import type { SsrData } from '../pages/pageTypes'
import type { HeadProps } from './head/Head'

export interface RenderData {
  ssr: SsrData
  head: HeadProps
}

export type RenderFunction = (data: RenderData, url: string) => Promise<string>

/** What the client reads from `window.__SSR_DATA__`. */
export type ClientSsrData = SsrData & {
  /** Only the terms this page can link, not the whole glossary. */
  glossaryTerms: GlossaryTerm[]
}

export interface RenderResult {
  html: string
  head: string
  glossaryTerms: GlossaryTerm[]
}

export type ServerRenderFunction = (
  data: RenderData,
  url: string,
) => RenderResult | Promise<RenderResult>
