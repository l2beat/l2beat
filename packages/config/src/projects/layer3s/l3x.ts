import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const l3x: Layer3 = underReviewL3({
  id: 'l3x',
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'L3X',
    slug: 'l3x',
    category: 'Optimium',
    description: 'L3X is a L3 Arbitrum Orbit DeFi-focused project.',
    purposes: ['DeFi'],
    provider: 'Arbitrum',
    links: {
      websites: ['https://l3x.com/'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=arbitrum-one&sourceChain=ethereum',
      ],
      documentation: ['https://docs.l3x.com/'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://t.me/l3x_protocol', 'https://x.com/l3x_protocol'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  escrows: [
    {
      address: EthereumAddress('0x59E088d827CB7983Cd0CC64312E472D7cc8a4F44'),
      sinceTimestamp: new UnixTime(1714618907),
      includeInTotal: false,
      tokens: ['ETH'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x4fF3E70f30f0394Ad62428751Fe3858740595908'),
      sinceTimestamp: new UnixTime(1714620855),
      includeInTotal: false,
      tokens: '*',
      chain: 'arbitrum',
    },
  ],
})
