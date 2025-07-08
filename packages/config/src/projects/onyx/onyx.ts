import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const onyx: ScalingProject = underReviewL3({
  id: 'onyx',
  capability: 'universal',
  addedAt: UnixTime(1744637831),
  hostChain: ProjectId('base'),
  badges: [
    BADGES.RaaS.Conduit,
    BADGES.Stack.Orbit,
    BADGES.DA.DAC,
    BADGES.VM.EVM,
  ],
  associatedTokens: ['XCN'],
  display: {
    name: 'Onyx',
    slug: 'onyx',
    description:
      'Onyx is a modular blockchain designed for financial-grade applications, offering near-instant confirmations and low fees.',
    purposes: ['Universal'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://onyx.org/'],
      repositories: ['https://github.com/Onyx-Protocol'],
      documentation: ['https://docs.onyx.org/'],
      explorers: ['https://explorer.onyx.org/'],
      bridges: ['https://app.onyx.org/', 'https://bridge.onyx.org/'],
      socialMedia: [
        'https://x.com/OnyxDAO',
        'https://t.me/Onyx',
        'https://blog.onyx.org/',
      ],
    },
  },
  chainConfig: {
    name: 'onyx',
    gasTokens: ['XCN'],
    chainId: 80888,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.onyx.org',
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
      address: EthereumAddress('0xcdf10130c75D42a3880Ae521734EaA8631aC2905'), // bridge
      sinceTimestamp: UnixTime(1737855297),
      tokens: ['XCN'],
      chain: 'base',
    },
  ],
})
