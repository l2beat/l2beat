import type { SsrData } from '../pages/ClientPageRouter'
import type { HeadProps } from './head/Head'

export interface RenderData {
  ssr: SsrData
  head: HeadProps
}

export type RenderFunction = (data: RenderData, url: string) => string

export interface RenderResult {
  html: string
  head: string
}
