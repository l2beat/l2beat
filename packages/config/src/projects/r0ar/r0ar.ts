import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const r0ar: ScalingProject = underReviewL2({
  id: 'r0ar',
  capability: 'universal',
  addedAt: UnixTime(1739282637), // 2025-02-11T14:03:57Z
  badges: [BADGES.Stack.OPStack, BADGES.VM.EVM, BADGES.RaaS.Zeeve],
  display: {
    name: 'R0ar',
    slug: 'r0ar',
    description: 'R0ar is an Optimistic Rollup utilizing the OP Stack.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://r0ar.io/'],
      apps: ['https://r0arbridge.io/'],
      documentation: [],
      explorers: ['https://r0arscan.io/'],
      socialMedia: ['https://x.com/th3r0ar', 'https://t.me/r0ar_community'],
    },
  },
  chainConfig: {
    name: 'r0ar',
    chainId: 193939,
    apis: [{ type: 'rpc', url: 'https://rpc-r0ar.io/', callsPerMinute: 1500 }],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  escrows: [
    {
      address: EthereumAddress('0x2c6af306f8d0cd6d9e76d43b2dc9a4e60a7f446e'),
      sinceTimestamp: UnixTime(1726179731),
      tokens: ['ETH'],
      chain: 'ethereum',
    },
  ],
})
