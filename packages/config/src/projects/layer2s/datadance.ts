import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const datadance: Layer2 = upcomingL2({
  id: 'datadance',
  createdAt: new UnixTime(1735718845), // 2025-01-17T07:40:45Z
  display: {
    name: 'DataDance',
    slug: 'datadance',
    description:
      'DataDance is an Ethereum-based Layer 2 network focused on protecting user privacy in the AI era while enabling smooth and secure transactions of user assets.',
    purposes: ['Privacy', 'AI'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://datadance.co/'],
      apps: [],
      documentation: ['https://datadance.gitbook.io'],
      explorers: [],
      repositories: ['https://github.com/DataDanceChain'],
      socialMedia: ['https://x.com/DataDanceChain', 'https://datadance.medium.com'],
    },
  },
})
