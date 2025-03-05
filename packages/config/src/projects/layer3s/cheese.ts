import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../internalTypes'
import { BADGES } from '../badges'
import { underReviewL3 } from '../layer2s/templates/underReview'

export const cheese: Layer3 = underReviewL3({
  hostChain: ProjectId('arbitrum'),
  id: ProjectId('cheese'),
  capability: 'universal',
  addedAt: new UnixTime(1722512887), // 2024-08-01T11:48:07Z
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
      websites: ['https://docs.cheesechain.lol/'],
      apps: [
        'https://cheesechain.bridge.caldera.xyz/',
        'https://bridge.cheesechain.lol/',
      ],
      documentation: ['https://docs.cheesechain.lol/'],
      explorers: ['https://fetascan.io/'],
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
      sinceTimestamp: new UnixTime(1717552278),
      tokens: '*',
    },
  ],
})
