import type { SsrData } from '../app/App'
import type { HeadProps } from './head/Head'

export interface RenderData {
  ssr: SsrData
  head: HeadProps
}

export type Render = (data: RenderData) => string
