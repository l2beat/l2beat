import { env } from '~/env'

export type SearchBarPage = {
  type?: 'scaling' | 'bridges' | 'da'
  name: string
  tags?: string[]
  href: string
}

export const searchBarPages = withIndex([
  {
    type: 'scaling',
    name: 'Summary',
    tags: ['pages', 'scaling'],
    href: '/scaling/summary',
  },
  {
    type: 'scaling',
    name: 'Risk Analysis',
    tags: ['pages', 'scaling', 'risks'],
    href: '/scaling/risk',
  },
  {
    type: 'scaling',
    name: 'Value Locked',
    tags: ['pages', 'scaling', 'tvl'],
    href: '/scaling/tvl',
  },
  {
    type: 'scaling',
    name: 'Activity',
    tags: ['pages', 'scaling'],
    href: '/scaling/activity',
  },
  {
    type: 'scaling',
    name: 'Data Availability',
    tags: ['pages', 'scaling'],
    href: '/scaling/data-availability',
  },
  {
    type: 'scaling',
    name: 'Liveness',
    tags: ['pages', 'scaling'],
    href: '/scaling/liveness',
  },
  {
    type: 'scaling',
    name: 'Finality',
    tags: ['pages', 'scaling'],
    href: '/scaling/finality',
  },
  {
    type: 'scaling',
    name: 'Costs',
    tags: ['pages', 'scaling'],
    href: '/scaling/costs',
  },
  {
    type: 'scaling',
    name: 'Upcoming',
    tags: ['pages', 'scaling'],
    href: '/scaling/upcoming',
  },
  {
    type: 'scaling',
    name: 'Archived',
    tags: ['pages', 'scaling'],
    href: '/scaling/archived',
  },
  {
    type: 'bridges',
    name: 'Summary',
    tags: ['pages', 'bridges'],
    href: '/bridges/summary',
  },
  {
    type: 'bridges',
    name: 'Risk Analysis',
    tags: ['pages', 'bridges', 'risks'],
    href: '/bridges/risk',
  },
  {
    type: 'bridges',
    name: 'Archived',
    tags: ['pages', 'bridges'],
    href: '/bridges/archived',
  },
  ...(env.FEATURE_FLAG_DA_BEAT
    ? [
        {
          type: 'da' as const,
          name: 'Summary',
          tags: ['pages', 'da', 'data', 'availability'],
          href: '/data-availability/summary',
        },
        {
          type: 'da' as const,
          name: 'Risk Analysis',
          tags: ['pages', 'da', 'data', 'availability', 'risks'],
          href: '/data-availability/risk',
        },
      ]
    : []),
  {
    name: 'ZK Catalog',
    href: '/zk-catalog',
    tags: ['pages', 'zk', 'catalog'],
  },
  {
    name: 'Donate',
    href: '/donate',
    tags: ['pages'],
  },
  {
    name: 'Governance',
    href: '/governance',
    tags: ['pages'],
  },
  {
    name: 'Glossary',
    href: '/glossary',
    tags: ['pages'],
  },
  {
    name: 'FAQ',
    href: '/faq',
    tags: ['pages'],
  },
])

function withIndex(arr: SearchBarPage[]) {
  return arr.map((e, i) => ({ ...e, index: i }))
}

export const searchBarTypeOrderValue: SearchBarPage['type'][] = [
  'da',
  'bridges',
  'scaling',
]
