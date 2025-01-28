import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import type { Layer2 } from './types'

export const millicent: Layer2 = upcomingL2({
  id: 'millicent',
  addedAt: new UnixTime(1720191862), // 2024-07-05T15:04:22Z
  display: {
    name: 'Millicent One',
    slug: 'millicent',
    description:
      'Millicent is an upcoming Layer 2 on Ethereum, built on the Orbit stack. It is focused on tokenized Real World Assets (RWAs) and digital currencies like tokenized bank deposits, stablecoins, and central bank assets.',
    purposes: ['RWA'],
    category: 'Optimistic Rollup',
    stack: 'Arbitrum',
    links: {
      websites: ['https://millicent.io/'],
      apps: [],
      documentation: ['https://docs.millicent.io'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/MillicentLabs'],
    },
  },
})
