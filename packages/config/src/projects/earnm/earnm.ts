import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { BADGES } from '../../common/badges'
import { underReviewL3 } from '../../templates/underReview'

export const earnm: ScalingProject = underReviewL3({
  id: ProjectId('earnm'),
  hostChain: ProjectId('arbitrum'),
  capability: 'universal',
  addedAt: UnixTime(1761662340), 
  display: {
    name: 'Earnm',
    slug: 'earnm',
    description:
      'Earnm is a mobile-first Orbit stack L3 on Arbitrum that converts everyday mobile activity into cryptocurrency rewards through its EarnOS technology.',
    purposes: ['Universal', 'Social'],
    links: {
      websites: ['https://www.earnm.com/'],
      documentation: [],
      explorers: ['https://earnm-mainnet.explorer.alchemy.com/'],
      socialMedia: [
        'https://x.com/EARNM_HQ',
        'https://t.me/earnmofficial',
        'https://discord.gg/earnm',
      ],
      other: [
        'https://play.google.com/store/apps/details?id=us.current.android&hl=en',
      ],
      repositories: [],
    },
    stacks: ['Arbitrum'],
  },
  associatedTokens: ['EARNM'],
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
  chainConfig: {
    name: 'earnm',
    chainId: 32766,
    gasTokens: ['EARNM'],
    apis: [
      {
        type: 'rpc',
        url: 'https://earnm-mainnet.g.alchemy.com/public',
        callsPerMinute: 300,
      },
    ],
  },
  badges: [
    BADGES.L3ParentChain.Arbitrum,
    BADGES.Stack.Orbit,
    BADGES.VM.EVM,
    BADGES.RaaS.Alchemy,
  ],
  escrows: [
    {
      address: EthereumAddress('0xA9F4ee72439afC704db48dc049CbFb7E914aD300'),
      sinceTimestamp: UnixTime(1745356800),
      tokens: ['ETH'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x0b6b5aFEe8602A4d88dC26Fc2E85b2d1236156F6'),
      sinceTimestamp: UnixTime(1745356800),
      tokens: '*',
      chain: 'arbitrum',
    },
  ],
  activityConfig: {
    type: 'block',
    startBlock: 1,
  },
})
