import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const koi: Layer2 = upcomingL2({
  id: 'koi',
  createdAt: new UnixTime(1736912127), // 2025-01-14T10:55:27Z
  display: {
    name: 'Koi Finance',
    slug: 'koi',
    description:
      'Koi Finance is a DEX, farming platform, and Bond platform built on zkRollup and zkSync.',
    purposes: ['Exchange'],
    category: 'ZK Rollup',
    provider: 'ZK Stack',
    links: {
      websites: ['https://koi.finance/'],
      apps: ['https://dapp.koi.finance/'],
      documentation: ['https://docs.koi.finance/'],
      explorers: [],
      repositories: ['https://github.com/koifinance'],
      socialMedia: [
        'https://t.me/mute_io',
        'https://twitter.com/koi_finance',
        'https://discord.koi.finance'
      ],
    },
  },
})
