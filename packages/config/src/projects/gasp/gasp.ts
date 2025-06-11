import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const gasp: ScalingProject = underReviewL2({
  id: 'gasp',
  capability: 'universal',
  addedAt: UnixTime(1741266827),
  display: {
    name: 'Gasp',
    slug: 'gasp',
    description:
      'Gasp aims to deliver omnichain liquidity, empowering efficient trading across blockchain networks through a modular rollup secured by Ethereum and an Eigenlayer AVS.',
    purposes: ['Universal', 'Interoperability'],
    category: 'Optimistic Rollup', // no zk found here on first sight, so OP or Other
    links: {
      websites: ['https://gasp.xyz/'],
      bridges: ['https://app.gasp.xyz/'],
      documentation: ['https://docs.gasp.xyz/'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://x.com/gasp_xyz',
        'https://discord.com/invite/gasp-xyz',
      ],
    },
  },
  escrows: [
    {
      address: EthereumAddress('0x79d968d9017B96f202aD4673A2c1BBbdc905A4ca'), // core contract ant multi asset escrow
      sinceTimestamp: UnixTime(1734103235),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
  // no rpc found
})
