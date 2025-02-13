import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { underReviewL3 } from '../layer2s/templates/underReview'

export const skynet: Layer3 = underReviewL3({
  id: 'skynet',
  capability: 'universal',
  addedAt: new UnixTime(1739372930), // 2025-02-12T15:08:50Z
  hostChain: ProjectId('arbitrum'),
  badges: [Badge.Stack.Orbit, Badge.VM.EVM, Badge.RaaS.Zeeve],
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
  transactionApi: {
    type: 'rpc',
    startBlock: 1,
    defaultUrl: 'https://rpc.skynet.io',
    defaultCallsPerMinute: 1500,
    adjustCount: { type: 'SubtractOne' },
  },
}) //no escrow since gas token is not on CoinGecko, very low TVS
