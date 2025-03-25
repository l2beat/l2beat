import type { SsrData } from '../app/App'

export type Render = (url: string, ssrData: SsrData) => Promise<string>
