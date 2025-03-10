import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { BADGES } from '../badges'
import { underReviewL3 } from '../layer2s/templates/underReview'

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
    stack: 'Arbitrum',
    links: {
      websites: ['https://skynet.io/'],
      explorers: ['https://explorer.skynet.io/'],
      documentation: [],
      repositories: [],
      apps: [
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
    chainId: 619,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.skynet.io',
        callsPerMinute: 1500,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
}) //no escrow since gas token is not on CoinGecko, very low TVS
