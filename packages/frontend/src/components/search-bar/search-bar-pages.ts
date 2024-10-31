import { env } from '~/env'

export type SearchBarPage = {
  type?: 'scaling' | 'bridges' | 'da'
  name: string
  matchers?: string[]
  href: string
}
export const searchBarPages: SearchBarPage[] = [
  {
    type: 'scaling',
    name: 'Summary',
    matchers: ['scaling'],
    href: '/scaling/summary',
  },
  {
    type: 'scaling',
    name: 'Value Locked',
    matchers: ['scaling', 'tvl'],
    href: '/scaling/tvl',
  },
  {
    type: 'scaling',
    name: 'Risk Analysis',
    matchers: ['scaling', 'risks'],
    href: '/scaling/risk',
  },
  {
    type: 'scaling',
    name: 'Data Availability',
    matchers: ['scaling'],
    href: '/scaling/data-availability',
  },
  {
    type: 'scaling',
    name: 'Liveness',
    matchers: ['scaling'],
    href: '/scaling/liveness',
  },
  {
    type: 'scaling',
    name: 'Finality',
    matchers: ['scaling'],
    href: '/scaling/finality',
  },
  {
    type: 'scaling',
    name: 'Activity',
    matchers: ['scaling'],
    href: '/scaling/activity',
  },
  {
    type: 'scaling',
    name: 'Costs',
    matchers: ['scaling'],
    href: '/scaling/costs',
  },
  {
    type: 'scaling',
    name: 'Upcoming',
    matchers: ['scaling'],
    href: '/scaling/upcoming',
  },
  {
    type: 'scaling',
    name: 'Archived',
    matchers: ['scaling'],
    href: '/scaling/archived',
  },
  {
    type: 'bridges',
    name: 'Summary',
    matchers: ['bridges'],
    href: '/bridges/summary',
  },
  {
    type: 'bridges',
    name: 'Risk Analysis',
    matchers: ['bridges', 'risks'],
    href: '/bridges/risk',
  },
  {
    type: 'bridges',
    name: 'Archived',
    matchers: ['bridges'],
    href: '/bridges/archived',
  },
  ...(env.NEXT_PUBLIC_FEATURE_FLAG_DA_BEAT
    ? [
        {
          type: 'da' as const,
          name: 'Summary',
          matchers: [
            'da',
            'data availability',
            'dataavailability',
            'data-availability',
            'data',
            'availability',
            'dabeat',
            'da-beat',
          ],
          href: '/data-availability/summary',
        },
        {
          type: 'da' as const,
          name: 'Risk Analysis',
          matchers: [
            'da',
            'data availability',
            'dataavailability',
            'data-availability',
            'data',
            'availability',
            'dabeat',
            'da-beat',
            'risks',
          ],
          href: '/data-availability/risk',
        },
      ]
    : []),
  {
    name: 'ZK Catalog',
    href: '/zk-catalog',
    matchers: ['zk', 'catalog', 'zk-catalog', 'zkcatalog'],
  },
  {
    name: 'Donate',
    href: '/donate',
  },
  {
    name: 'Governance',
    href: '/governance',
  },
  {
    name: 'Glossary',
    href: '/glossary',
  },
  {
    name: 'FAQ',
    href: '/faq',
  },
]
