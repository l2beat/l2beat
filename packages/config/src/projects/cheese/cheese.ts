import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const cheese: ScalingProject = underReviewL3({
  hostChain: ProjectId('arbitrum'),
  id: ProjectId('cheese'),
  capability: 'universal',
  addedAt: UnixTime(1722512887), // 2024-08-01T11:48:07Z
  badges: [
    BADGES.L3ParentChain.Arbitrum,
    BADGES.DA.Celestia,
    BADGES.Stack.Orbit,
    BADGES.VM.EVM,
    BADGES.RaaS.Caldera,
  ],
  display: {
    category: 'Optimium',
    stack: 'Arbitrum',
    name: 'CheeseChain',
    slug: 'cheese',
    description: 'CheeseChain is an Orbit stack Optimium using $CHEESE.',
    purposes: ['Universal'],
    links: {
      websites: ['https://docs.cheesechain.xyz/'],
      apps: [
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
