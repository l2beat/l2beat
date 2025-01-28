import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { underReviewL3 } from '../layer2s/templates/underReview'

export const superposition: Layer3 = underReviewL3({
  id: 'superposition',
  capability: 'universal',
  addedAt: new UnixTime(1720082709), // 2024-07-04T08:45:09Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Superposition',
    slug: 'superposition',
    description:
      'Superposition is a Layer 3 powered by Arbitrum Orbit. It is a yield centric blockchain that pays users and developers to use it. Superposition offers novel incentive mechanisms such as Utility Mining and Super Assets and a native onchain order book built using Stylus that provides shared liquidity for the ecosystem.',
    purposes: ['Universal'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://superposition.so/'],
      apps: [
        'https://superposition-1v9rjalnat-12c2e35145933596.mainnets.rollbridge.app/',
      ],
      documentation: ['https://docs.superposition.so/'],
      explorers: ['https://explorer.superposition.so/'],
      socialMedia: ['https://x.com/Superpositionso'],
    },
  },
  rpcUrl: 'https://rpc.superposition.so',
  escrows: [
    {
      address: EthereumAddress('0xEca0fEB4aA6112a3923823559e7197294Bc49CC7'), // Bridge
      sinceTimestamp: new UnixTime(1725644220),
      tokens: ['ETH'],
      includeInTotal: false,
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x62bEd4b862254789825Cd6F2352aa2b76B16145e'), // standardGW
      sinceTimestamp: new UnixTime(1725644465),
      tokens: '*',
      includeInTotal: false,
      chain: 'arbitrum',
    },
  ],
})
