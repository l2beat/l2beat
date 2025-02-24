import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { BADGES } from '../badges'
import { underReviewL2 } from './templates/underReview'

export const snaxchain: Layer2 = underReviewL2({
  id: 'snaxchain',
  capability: 'universal',
  addedAt: new UnixTime(1740099913),
  badges: [BADGES.Stack.OPStack, BADGES.VM.EVM, BADGES.RaaS.Conduit],
  display: {
    name: 'SNAXchain',
    slug: 'snaxchain',
    description:
      "SNAXchain, developed by Synthetix, is a Layer-2 blockchain built on the OP Stack. It aims to enhance Synthetix V3's decentralized governance and streamline operations.",
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://governance.synthetix.io/'],
      repositories: ['https://github.com/Synthetixio/snaxchain-config'],
      documentation: ['https://sips.synthetix.io/sips/sip-384/'],
      socialMedia: ['https://x.com/synthetix_io'],
      explorers: ['https://explorer.snaxchain.io'],
    },
  },
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://mainnet.snaxchain.io',
    defaultCallsPerMinute: 1500,
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
  escrows: [
    {
      address: EthereumAddress('0x936D881b4760D5e9b6D55b774f65c509236b4743'), // optiPortal
      sinceTimestamp: new UnixTime(1723518000),
      tokens: ['ETH'],
      chain: 'ethereum',
    },
  ],
})
