import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const koi: ScalingProject = upcomingL2({
  id: 'koi',
  capability: 'universal',
  addedAt: UnixTime(1736912127), // 2025-01-14T10:55:27Z
  display: {
    name: 'Koi Finance',
    slug: 'koi',
    description:
      'Koi Finance is a DEX, farming platform, and Bond platform built on zkRollup and zkSync.',
    purposes: ['Exchange'],
    category: 'ZK Rollup',
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://koi.finance/'],
      bridges: ['https://dapp.koi.finance/'],
      documentation: ['https://docs.koi.finance/'],
      repositories: ['https://github.com/koifinance'],
      socialMedia: [
        'https://t.me/mute_io',
        'https://twitter.com/koi_finance',
        'https://discord.com/invite/tCCXxp5yS8',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
})
