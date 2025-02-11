import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { underReviewL3 } from '../layer2s/templates/underReview'

export const blockfit: Layer3 = underReviewL3({
  id: 'blockfit',
  capability: 'universal',
  addedAt: new UnixTime(1739285196), // 2025-02-11T14:46:36Z
  hostChain: ProjectId('nova'),
  badges: [Badge.Stack.Orbit, Badge.VM.EVM, Badge.RaaS.Zeeve],
  display: {
    name: 'BlockFit',
    slug: 'blockfit',
    description:
      'BlockFit is a scaling solution built on the Orbit stack. It aims to revolutionizing healthcare.',
    purposes: ['Universal'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://blockfit.io/'],
      explorers: ['https://blockfitscan.io/'],
      documentation: [],
      repositories: [],
      apps: [
        'https://bridge.blockfitscan.io/?destinationChain=BlockFit-Mainnet&sourceChain=arbitrum-nova',
      ],
      socialMedia: ['https://x.com/Fit24updates', 't.me/fit24updates'],
    },
  },
  transactionApi: {
    type: 'rpc',
    startBlock: 1,
    defaultUrl: 'https://rpc.blockfitscan.io',
    defaultCallsPerMinute: 1500,
    adjustCount: { type: 'SubtractOne' },
  },
}) //no escrow since gas token is not on CoinGecko
