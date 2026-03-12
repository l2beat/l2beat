import type { SearchBarEntry } from './types'

export const searchBarPages = withIndex([
  {
    category: 'scaling',
    name: 'Summary',
    tags: ['pages', 'scaling'],
    href: '/scaling/summary',
  },
  {
    category: 'scaling',
    name: 'Risk Analysis',
    tags: ['pages', 'scaling', 'risks'],
    href: '/scaling/risk',
  },
  {
    category: 'scaling',
    name: 'Value Secured',
    tags: ['pages', 'scaling', 'tvs', 'tvl'],
    href: '/scaling/tvs',
  },
  {
    category: 'scaling',
    name: 'Activity',
    tags: ['pages', 'scaling'],
    href: '/scaling/activity',
  },
  {
    category: 'scaling',
    name: 'Data Availability',
    tags: ['pages', 'scaling'],
    href: '/scaling/data-availability',
  },
  {
    category: 'scaling',
    name: 'Liveness',
    tags: ['pages', 'scaling'],
    href: '/scaling/liveness',
  },
  {
    category: 'scaling',
    name: 'Costs',
    tags: ['pages', 'scaling'],
    href: '/scaling/costs',
  },
  {
    category: 'scaling',
    name: 'Upcoming',
    tags: ['pages', 'scaling'],
    href: '/scaling/upcoming',
  },
  {
    category: 'scaling',
    name: 'Archived',
    tags: ['pages', 'scaling'],
    href: '/scaling/archived',
  },
  {
    category: 'da',
    name: 'Summary',
    tags: ['pages', 'da', 'data', 'availability'],
    href: '/data-availability/summary',
  },
  {
    category: 'da',
    name: 'Risk Analysis',
    tags: ['pages', 'da', 'data', 'availability', 'risks'],
    href: '/data-availability/risk',
  },
  {
    category: 'da',
    name: 'Throughput',
    tags: ['pages', 'da', 'data', 'availability', 'throughput'],
    href: '/data-availability/throughput',
  },
  {
    category: 'da',
    name: 'Liveness',
    tags: ['pages', 'da', 'data', 'availability', 'liveness'],
    href: '/data-availability/liveness',
  },
  {
    category: 'da',
    name: 'Archived',
    tags: ['pages', 'da', 'data', 'availability', 'archived'],
    href: '/data-availability/archived',
  },
  {
    category: 'interop',
    name: 'Summary',
    tags: ['pages', 'interop', 'interoperability'],
    href: '/interop/summary',
  },
  {
    category: 'interop',
    name: 'Non-minting',
    tags: ['pages', 'interop', 'interoperability', 'non-minting'],
    href: '/interop/non-minting',
  },
  {
    category: 'interop',
    name: 'Lock & Mint',
    tags: ['pages', 'interop', 'interoperability', 'lock-and-mint'],
    href: '/interop/lock-and-mint',
  },
  {
    category: 'interop',
    name: 'Burn & Mint',
    tags: ['pages', 'interop', 'interoperability', 'burn-and-mint'],
    href: '/interop/burn-and-mint',
  },
  {
    category: 'zkCatalog',
    name: 'ZK Catalog',
    href: '/zk-catalog',
    tags: ['pages', 'zk', 'catalog'],
  },
  {
    category: 'other',
    name: 'Donate',
    href: '/donate',
    tags: ['pages'],
  },
  {
    category: 'other',
    name: 'Governance',
    href: '/governance',
    tags: ['pages'],
  },
  {
    category: 'other',
    name: 'Glossary',
    href: '/glossary',
    tags: ['pages'],
  },
  {
    category: 'other',
    name: 'FAQ',
    href: '/faq',
    tags: ['pages'],
  },
])

function withIndex(arr: Omit<SearchBarPage, 'type'>[]): (SearchBarPage & {
  index: number
})[] {
  return arr.map((e, i) => ({ ...e, index: i, type: 'page' }))
}
export type SearchBarPage = SearchBarEntry & {
  type: 'page'
}
