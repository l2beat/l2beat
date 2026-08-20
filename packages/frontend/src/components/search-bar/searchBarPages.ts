import { env } from '~/env'
import type { SearchBarEntry } from './types'

export const searchBarPages = withIndex([
  ...(env.CLIENT_SIDE_HOME_PAGE
    ? [
        {
          category: 'other' as const,
          name: 'Home',
          href: '/',
          tags: ['pages'],
        },
      ]
    : []),
  {
    category: 'l2',
    name: 'Summary',
    tags: ['pages', 'scaling'],
    href: '/layer2s/summary',
  },
  {
    category: 'l2',
    name: 'Risk Analysis',
    tags: ['pages', 'scaling', 'risks'],
    href: '/layer2s/risk',
  },
  {
    category: 'l2',
    name: 'Value Secured',
    tags: ['pages', 'scaling', 'tvs', 'tvl'],
    href: '/layer2s/tvs',
  },
  {
    category: 'l2',
    name: 'Activity',
    tags: ['pages', 'scaling'],
    href: '/layer2s/activity',
  },
  {
    category: 'l2',
    name: 'Data Availability',
    tags: ['pages', 'scaling'],
    href: '/layer2s/risk/data-availability',
  },
  {
    category: 'l2',
    name: 'State Validation',
    tags: ['pages', 'scaling', 'risks'],
    href: '/layer2s/risk/state-validation',
  },
  {
    category: 'l2',
    name: 'Sequencing',
    tags: ['pages', 'scaling'],
    href: '/layer2s/risk/sequencing',
  },
  {
    category: 'l2',
    name: 'Liveness',
    tags: ['pages', 'scaling'],
    href: '/layer2s/liveness',
  },
  {
    category: 'l2',
    name: 'Costs',
    tags: ['pages', 'scaling'],
    href: '/layer2s/costs',
  },
  {
    category: 'l2',
    name: 'Archived',
    tags: ['pages', 'scaling'],
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
  ...(env.CLIENT_SIDE_DEFI_ENABLED
    ? [
        {
          category: 'defi' as const,
          name: 'DeFi',
          href: '/defi/summary',
          tags: ['pages', 'defi'],
        },
      ]
    : []),
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
