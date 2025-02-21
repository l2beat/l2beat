import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { BADGES } from '../badges'
import { underReviewL2 } from './templates/underReview'

export const pepeunchained: Layer2 = underReviewL2({
  id: 'pepeunchained',
  capability: 'universal',
  addedAt: new UnixTime(1739541812), // 2025-02-14T14:03:32Z
  badges: [BADGES.Stack.OPStack, BADGES.VM.EVM, BADGES.RaaS.Conduit],
  display: {
    name: 'Pepe Unchained',
    slug: 'pepeunchained',
    description:
      'Pepe Unchained is an Optimium utilizing the OP Stack. It focuses on memes and provides a home for meme creators, traders, and communities to thrive.',
    purposes: ['Universal'],
    category: 'Optimium', //Celestia
    stack: 'OP Stack',
    links: {
      websites: ['https://pepeunchained.com/'],
      apps: ['https://pepubridge.com/'],
      documentation: ['https://guide.pepeunchained.com/'],
      explorers: ['https://pepuscan.com'],
      socialMedia: ['https://x.com/pepe_unchained'],
    },
  },
  transactionApi: {
    type: 'rpc',
    defaultUrl: 'https://rpc-pepe-unchained-gupg0lo9wf.t.conduit.xyz',
    defaultCallsPerMinute: 1500,
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
  escrows: [
    {
      address: EthereumAddress('0x384e3ae4d5efc9471201039b555eae496b2a7240'),
      sinceTimestamp: new UnixTime(1733132700),
      tokens: ['PEPU'],
      chain: 'ethereum',
    },
  ],
})
