import type { SsrData } from '../pages/pageTypes'
import type { HeadProps } from './head/Head'

export interface RenderData {
  ssr: SsrData
  head: HeadProps
}

export type RenderFunction = (data: RenderData, url: string) => Promise<string>

export interface RenderResult {
  html: string
  head: string
}

export type ServerRenderFunction = (
  data: RenderData,
  url: string,
) => RenderResult | Promise<RenderResult>
