import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const skynet: ScalingProject = underReviewL3({
  id: 'skynet',
  capability: 'universal',
  addedAt: UnixTime(1739372930), // 2025-02-12T15:08:50Z
  hostChain: ProjectId('arbitrum'),
  badges: [BADGES.Stack.Orbit, BADGES.VM.EVM, BADGES.RaaS.Zeeve],
  display: {
    name: 'Skynet',
    slug: 'skynet',
    description:
      'Skynet is a scaling solution built on the Orbit stack that aims to act as infrastructure for AI Agents.',
    purposes: ['Universal'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://skynet.io/'],
      explorers: ['https://explorer.skynet.io/'],
      documentation: [],
      repositories: [],
      bridges: [
        'https://bridge.skynet.io/?destinationChain=Skynet%20Mainnet&sourceChain=arbitrum-one',
      ],
      socialMedia: [
        'https://x.com/Skynet_for_AI',
        'https://discord.com/invite/aHGxa3w5P9',
      ],
    },
  },
  chainConfig: {
    name: 'skynet',
    gasTokens: ['sUSD'],
    chainId: 619,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.skynet.io',
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
      address: EthereumAddress('0x54f3bad1ed5e67a1aee393f80d27542f9ef81c78'), // bridge
      sinceTimestamp: UnixTime(1734416521),
      tokens: ['ETH'], // gastoken skyUSD sUSD not on CG (tvs 300 doler)
      chain: 'arbitrum',
    },
  ],
})
