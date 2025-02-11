import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { underReviewL2 } from './templates/underReview'

export const r0ar: Layer2 = underReviewL2({
  id: 'r0ar',
  capability: 'universal',
  addedAt: new UnixTime(1739282637), // 2025-02-11T14:03:57Z
  badges: [Badge.Stack.OPStack, Badge.VM.EVM, Badge.RaaS.Zeeve],
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
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc-r0ar.io/',
    defaultCallsPerMinute: 1500,
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
  escrows: [
    {
      address: EthereumAddress('0x2c6af306f8d0cd6d9e76d43b2dc9a4e60a7f446e'),
      sinceTimestamp: new UnixTime(1726179731),
      tokens: ['ETH'],
      chain: 'ethereum',
    },
  ],
})
