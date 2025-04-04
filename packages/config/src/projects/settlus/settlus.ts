import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const settlus: ScalingProject = underReviewL2({
  id: 'settlus',
  capability: 'universal',
  addedAt: UnixTime(1737636288), // 2025-01-23T12:44:48+00:00
  badges: [BADGES.RaaS.Alchemy, BADGES.Stack.OPStack, BADGES.VM.EVM],
  display: {
    name: 'Settlus',
    slug: 'settlus',
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    description:
      'Settlus is an OP stack L2 Settlus designed to provide transparent settlement system for the creator economy.',
    purposes: ['Universal'],
    links: {
      websites: ['https://settlus.org/'],
      apps: ['https://settlus-mainnet.bridge.alchemy.com/'],
      explorers: ['https://mainnet.settlus.network/'],
      documentation: ['https://docs.settlus.org/'],
      socialMedia: [
        'https://x.com/Settlusofficial',
        'https://github.com/settlus',
      ],
    },
  },
  chainConfig: {
    name: 'settlus',
    chainId: 5371,
    apis: [
      {
        type: 'rpc',
        url: 'https://settlus-septestnet.g.alchemy.com/public',
        callsPerMinute: 1500,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  escrows: [
    {
      address: EthereumAddress('0xFc1D560eB01443e31B0EB56620703E80e42A7E4e'),
      sinceTimestamp: UnixTime(1740096000),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
