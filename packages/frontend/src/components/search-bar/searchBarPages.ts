import type { SearchBarEntry } from './types'

export const searchBarPages = withIndex([
  {
    category: 'other',
    name: 'Home',
    href: '/',
    tags: ['pages'],
  },
  {
    category: 'layer2s',
    name: 'Summary',
    tags: ['pages', 'layer2s'],
    href: '/layer2s/summary',
  },
  {
    category: 'layer2s',
    name: 'Risk Analysis',
    tags: ['pages', 'layer2s', 'risks'],
    href: '/layer2s/risk',
  },
  {
    category: 'layer2s',
    name: 'Value Secured',
    tags: ['pages', 'layer2s', 'tvs', 'tvl'],
    href: '/layer2s/tvs',
  },
  {
    category: 'layer2s',
    name: 'Activity',
    tags: ['pages', 'layer2s'],
    href: '/layer2s/activity',
  },
  {
    category: 'layer2s',
    name: 'Data Availability',
    tags: ['pages', 'layer2s'],
    href: '/layer2s/risk/data-availability',
  },
  {
    category: 'layer2s',
    name: 'State Validation',
    tags: ['pages', 'layer2s', 'risks'],
    href: '/layer2s/risk/state-validation',
  },
  {
    category: 'layer2s',
    name: 'Sequencing',
    tags: ['pages', 'layer2s'],
    href: '/layer2s/risk/sequencing',
  },
  {
    category: 'layer2s',
    name: 'Liveness',
    tags: ['pages', 'layer2s'],
    href: '/layer2s/liveness',
  },
  {
    category: 'layer2s',
    name: 'Costs',
    tags: ['pages', 'layer2s'],
    href: '/layer2s/costs',
  },
  {
    category: 'layer2s',
    name: 'Archived',
    tags: ['pages', 'layer2s'],
    href: '/layer2s/archived',
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
    category: 'interop',
    name: 'Intent bridges',
    tags: ['pages', 'interop', 'interoperability', 'intent-bridges'],
    href: '/interop/intent-bridges',
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
    name: 'Native Rollups',
    href: '/native-rollups',
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
