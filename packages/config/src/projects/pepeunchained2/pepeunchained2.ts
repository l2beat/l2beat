import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const pepeunchained2: ScalingProject = underReviewL2({
  id: 'pepeunchained2',
  capability: 'universal',
  addedAt: UnixTime(1752134764), //10-7-2025
  display: {
    name: 'Pepe Unchained',
    slug: 'pepe-unchained',
    description:
      'Pepe Unchained is an Optimium utilizing the Orbit Stack. It focuses on memes and provides a home for meme creators, traders, and communities to thrive.',
    purposes: ['Universal'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://pepeunchained.com/'],
      bridges: [
        'https://pepu-v2-mainnet-0-bbb002a8b0c2087b.mainnets.rollbridge.app/',
      ],
      documentation: ['https://guide.pepeunchained.com/'],
      explorers: ['https://pepuscan.com'],
      socialMedia: ['https://x.com/pepe_unchained'],
    },
  },
  chainConfig: {
    name: 'pepeunchained2',
    gasTokens: ['PEPU'],
    chainId: 97741,
    sinceTimestamp: UnixTime(1748891003),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc-pepu-v2-mainnet-0.t.conduit.xyz',
        callsPerMinute: 1500,
      },
    ],
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  escrows: [
    {
      address: EthereumAddress('0xd3643255ea784c75a5325CC5a4A549C7CD62E499'), // bridge
      sinceTimestamp: UnixTime(1748837581),
      tokens: ['PEPU'],
      chain: 'ethereum',
    },
  ],
})
