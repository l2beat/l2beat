import type { BadgeLookup } from '~/components/projects/BadgeLookup'
import type { pageLoaders } from './pageLoaders'

export type Pages = {
  [K in keyof typeof pageLoaders]: Awaited<ReturnType<(typeof pageLoaders)[K]>>
}

export type PageName = keyof Pages

export type SsrData = {
  [K in PageName]: {
    page: K
    props: Parameters<Pages[K]>[0]
    /** Badges that table rows point at by id; see `BadgeRef`. */
    badges?: BadgeLookup
  }
}[PageName]
