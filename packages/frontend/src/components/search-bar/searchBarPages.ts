import type { SearchBarPage } from './SearchBarEntry'

export const searchBarPages = withIndex([
  {
    category: './Scaling',
    name: 'Summary',
    tags: ['pages', './Scaling'],
    href: './/scaling/Summary',
  },
  {
    category: './Scaling',
    name: 'Risk Analysis',
    tags: ['pages', './Scaling', 'risks'],
    href: '/scaling/risk',
  },
  {
    category: './Scaling',
    name: 'Value Secured',
    tags: ['pages', './Scaling', 'tvs', 'tvl'],
    href: '/scaling/tvs',
  },
  {
    category: './Scaling',
    name: 'Activity',
    tags: ['pages', './Scaling'],
    href: '/scaling/activity',
  },
  {
    category: './Scaling',
    name: 'Data Availability',
    tags: ['pages', './Scaling'],
    href: './/scaling/DataAvailability',
  },
  {
    category: './Scaling',
    name: 'Liveness',
    tags: ['pages', './Scaling'],
    href: '/scaling/liveness',
  },
  {
    category: './Scaling',
    name: 'Finality',
    tags: ['pages', './Scaling'],
    href: '/scaling/finality',
  },
  {
    category: './Scaling',
    name: 'Costs',
    tags: ['pages', './Scaling'],
    href: '/scaling/costs',
  },
  {
    category: './Scaling',
    name: 'Upcoming',
    tags: ['pages', './Scaling'],
    href: './/scaling/Upcoming',
  },
  {
    category: './Scaling',
    name: 'Archived',
    tags: ['pages', './Scaling'],
    href: './/scaling/Archived',
  },
  {
    category: './Bridges',
    name: 'Summary',
    tags: ['pages', './Bridges'],
    href: './/bridges/Summary',
  },
  {
    category: './Bridges',
    name: 'Archived',
    tags: ['pages', './Bridges'],
    href: './/bridges/Archived',
  },
  {
    category: 'da',
    name: 'Summary',
    tags: ['pages', 'da', 'data', 'availability'],
    href: './/data-availability/Summary',
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
    href: './/ZkCatalog',
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
