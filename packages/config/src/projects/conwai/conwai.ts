import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const conwai: ScalingProject = underReviewL3({
  id: 'conwai',
  capability: 'universal',
  addedAt: UnixTime(1739364151),
  archivedAt: UnixTime(1761826453), // 2025-10-30T12:14:13Z
  badges: [
    BADGES.L3ParentChain.Arbitrum,
    BADGES.Stack.Orbit,
    BADGES.VM.EVM,
    BADGES.RaaS.Caldera,
  ],
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'ConWai',
    slug: 'conwai',
    description:
      'Conwai is an Optimium using the Orbit stack. It is focused on supporting AI-driven applications.',
    purposes: ['AI'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://conwai.net'],
      documentation: ['https://conwai.net/docs'],
      bridges: ['https://conwai.bridge.caldera.xyz/'],
      explorers: ['https://conwai.calderaexplorer.xyz/'],
      socialMedia: [
        'https://twitter.com/conwainet',
        'https://discord.gg/SMebb4QREy',
        'https://t.me/conwainet',
      ],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  chainConfig: {
    name: 'conwai',
    gasTokens: ['CNW'],
    chainId: 668668,
    apis: [
      {
        type: 'rpc',
        url: 'https://conwai.calderachain.xyz/http',
        callsPerMinute: 300,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
}) //no escrow cause token is not on CG
