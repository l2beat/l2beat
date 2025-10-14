import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const perennial: ScalingProject = underReviewL2({
  id: 'ethstorage',
  capability: 'universal',
  addedAt: UnixTime(1760437967),
  badges: [
    BADGES.Stack.OPStack,
    BADGES.VM.EVM,
  ],
  display: {
    name: 'EthStorage',
    slug: 'ethstorage',
    description:
      'EthStorage is a Layer 2 built on the OP Stack that offers users programmable data storage onchain. EthStorage enables long-term DA solutions for rollups and fully onchain applications like games, social networks, AI.',
    purposes: ['Universal'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://ethstorage.io/'],
      explorers: [],
      bridges: [],
      documentation: ['https://docs.ethstorage.io/'],
      repositories: ['https://github.com/ethstorage/'],
      socialMedia: [
        'https://x.com/EthStorage',
        'https://discord.com/invite/xhCwaMp7ps',
        'https://ethstorage.medium.com/',
      ],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
  chainConfig: {
    name: 'ethstorage',
    gasTokens: ['ETH'],
    chainId: 333,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.mainnet.ethstorage.io:9545',
        callsPerMinute: 300,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
}) 
