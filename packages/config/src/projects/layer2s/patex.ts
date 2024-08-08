import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const patex: Layer2 = underReviewL2({
  id: ProjectId('patex'),
  display: {
    category: 'Optimistic Rollup',
    name: 'Patex Network',
    slug: 'patex',
    description:
      'Patex Network is an L2 focusing on Real World Assets, forked from the OP stack codebase.',
    purposes: ['RWA'],
    links: {
      websites: ['https://patex.io/network'],
      apps: ['https://patex.io/cabinet/converter'],
      documentation: ['https://docs.patex.io/tech/patex-network'],
      explorers: ['https://patexscan.io/'],
      repositories: ['https://github.com/patex-ecosystem/patex-network'],
      socialMedia: [
        'https://x.com/patex_ecosystem',
        'https://t.me/cpatexeng',
        'https://discord.gg/ntjQYv9VAA',
        'https://youtube.com/channel/UCLmHyM6kZ5bViyh7my6ZkpA',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.patex.io/', //chainid 789
  escrows: [
    {
      chain: 'ethereum',
      address: EthereumAddress('0x0d6e11E2A3B2B3a245bf839c07D775983aCB787d'), // unverified
      sinceTimestamp: new UnixTime(1686211235),
      tokens: ['ETH'],
    },
  ],
})
