import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const koi: Layer2 = upcomingL2({
  id: 'koi',
  capability: 'universal',
  addedAt: new UnixTime(1736912127), // 2025-01-14T10:55:27Z
  display: {
    name: 'Koi Finance',
    slug: 'koi',
    description:
      'Koi Finance is a DEX, farming platform, and Bond platform built on zkRollup and zkSync.',
    purposes: ['Exchange'],
    category: 'ZK Rollup',
    stack: 'ZK Stack',
    links: {
      websites: ['https://koi.finance/'],
      apps: ['https://dapp.koi.finance/'],
      documentation: ['https://docs.koi.finance/'],
      repositories: ['https://github.com/koifinance'],
      socialMedia: [
        'https://t.me/mute_io',
        'https://twitter.com/koi_finance',
        'https://discord.com/invite/tCCXxp5yS8',
      ],
    },
  },
})
