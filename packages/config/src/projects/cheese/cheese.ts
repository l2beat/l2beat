import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const cheese: ScalingProject = underReviewL3({
  hostChain: ProjectId('arbitrum'),
  id: ProjectId('cheese'),
  capability: 'universal',
  addedAt: UnixTime(1718150400), // 2024-06-12 https://x.com/LayerofCheese/status/1800704112214093955
  badges: [
    BADGES.L3ParentChain.Arbitrum,
    BADGES.DA.Celestia,
    BADGES.Stack.Orbit,
    BADGES.VM.EVM,
    BADGES.RaaS.Caldera,
  ],
  display: {
    stacks: ['Arbitrum'],
    name: 'CheeseChain',
    slug: 'cheese',
    description: 'CheeseChain is an Orbit stack Optimium using $CHEESE.',
    purposes: ['Universal'],
    links: {
      websites: ['https://docs.cheesechain.xyz/'],
      bridges: [
        'https://cheesechain.bridge.caldera.xyz/',
        'https://bridge.cheesechain.xyz/',
      ],
      documentation: ['https://docs.cheesechain.xyz/'],
      explorers: ['https://fetascan.xyz/'],
      socialMedia: [
        'https://x.com/layerofcheese',
        'https://t.me/cheesegateway',
      ],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
  chainConfig: {
    name: 'cheese',
    chainId: undefined,
    gasTokens: ['CHEESE'],
    apis: [],
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  associatedTokens: ['CHEESE'],
  escrows: [
    {
      chain: 'arbitrum',
      address: EthereumAddress('0xA337997ab18164Dfe1e8A94E8D912e8d4e2ce173'), // ERC20Bridge
      sinceTimestamp: UnixTime(1717552278),
      tokens: '*',
    },
  ],
})
