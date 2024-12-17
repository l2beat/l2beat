import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const degenlayer: Layer2 = upcomingL2({
  id: 'degenlayer',
  createdAt: new UnixTime(1733383382), // 2024-12-05T07:23:02Z
  display: {
    name: 'DegenLayer',
    slug: 'degenlayer',
    description:
      'DegenLayer is a Memecoin-focused Ethereum Layer 2 blockchain designed to capitalize on the explosive growth of the memecoin market.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://degenlayer.wtf/'],
      apps: ['https://bridge-test.degenlayer.wtf/bridge/degenlayer'],
      documentation: ['https://docs.degenlayer.wtf'],
      explorers: ['https://scan-test.degenlayer.wtf/'],
      repositories: [],
      socialMedia: ['https://x.com/degenlayer', 'https://t.me/delayedfrens'],
    },
  },
})
