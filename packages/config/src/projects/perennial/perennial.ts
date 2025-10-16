import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const perennial: ScalingProject = underReviewL3({
  id: 'perennial',
  capability: 'universal',
  addedAt: UnixTime(1755235461),
  hostChain: ProjectId('base'),
  badges: [
    BADGES.L3ParentChain.Base,
    BADGES.DA.Celestia,
    BADGES.Stack.OPStack,
    BADGES.VM.EVM,
    BADGES.RaaS.Conduit,
  ],
  display: {
    name: 'Perennial',
    slug: 'perennial',
    description:
      'Perennial is an L3 purpose-built for perpetuals trading with near-zero fees, tight spreads, and deeper liquidity via an intent-AMM hybrid model.',
    purposes: ['Universal'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://perennial.finance/'],
      explorers: ['https://explorer.perennial.foundation/'],
      documentation: ['https://docs.perennial.finance/'],
      bridges: [
        'https://perennial-lsv53i0ed8-21a750cba5d9822e.mainnets.rollbridge.app/',
      ],
      repositories: ['https://github.com/equilibria-xyz/perennial-v2'],
      socialMedia: [
        'https://twitter.com/perenniallabs',
        'https://discord.com/invite/perennial-finance',
      ],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
  chainConfig: {
    name: 'perennial',
    gasTokens: ['ETH'],
    chainId: 1424,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.perennial.foundation',
        callsPerMinute: 300,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
}) //seems like they use external bridges? https://bridges.perennial.foundation/ to be checked
