import type { SearchBarPage } from './SearchBarEntry'

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
    category: 'bridges',
    name: 'Summary',
    tags: ['pages', 'bridges'],
    href: '/bridges/summary',
  },
  {
    category: 'bridges',
    name: 'Archived',
    tags: ['pages', 'bridges'],
    href: '/bridges/archived',
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
