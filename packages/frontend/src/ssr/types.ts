import type { SsrData } from '../pages/pageTypes'
import type { GlossaryTerm } from '../utils/markdown/glossaryMatcher'
import type { HeadProps } from './head/Head'

export interface RenderData {
  ssr: SsrData
  head: HeadProps
}

export type RenderFunction = (data: RenderData, url: string) => Promise<string>

/** What the client reads from the `ssr-data` script. */
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
