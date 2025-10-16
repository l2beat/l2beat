import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const blockfit: ScalingProject = underReviewL3({
  id: 'blockfit',
  capability: 'universal',
  addedAt: UnixTime(1739285196), // 2025-02-11T14:46:36Z
  archivedAt: UnixTime(1751446252), //2025-07-02T11:50:52Z
  hostChain: ProjectId('nova'),
  badges: [BADGES.Stack.Orbit, BADGES.VM.EVM, BADGES.RaaS.Zeeve],
  display: {
    name: 'BlockFit',
    slug: 'blockfit',
    description:
      'BlockFit is a scaling solution built on the Orbit stack. It aims to revolutionize healthcare.',
    purposes: ['Universal'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://blockfit.io/'],
      explorers: ['https://blockfitscan.io/'],
      documentation: [],
      repositories: [],
      bridges: [
        'https://bridge.blockfitscan.io/?destinationChain=BlockFit-Mainnet&sourceChain=arbitrum-nova',
      ],
      socialMedia: ['https://x.com/Fit24updates', 'https://t.me/fit24updates'],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
  chainConfig: {
    name: 'blockfit',
    chainId: 202424,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.blockfitscan.io',
        callsPerMinute: 300,
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
}) //no escrow since gas token is not on CoinGecko
