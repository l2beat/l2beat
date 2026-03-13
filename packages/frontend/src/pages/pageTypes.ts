import type { pageLoaders } from './pageLoaders'

export type Pages = {
  [K in keyof typeof pageLoaders]: Awaited<ReturnType<(typeof pageLoaders)[K]>>
}

export type PageName = keyof Pages

export type SsrData = {
  [K in PageName]: {
    page: K
    props: Parameters<Pages[K]>[0]
  }
}[PageName]
