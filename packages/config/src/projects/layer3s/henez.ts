import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { underReviewL3 } from '../layer2s/templates/underReview'

export const henez: Layer3 = underReviewL3({
  id: 'henez',
  capability: 'universal',
  addedAt: new UnixTime(1737469444), // 2025-01-21T14:24:03+00:00
  hostChain: ProjectId('arbitrum'),
  badges: [
    Badge.RaaS.Caldera,
    Badge.L3ParentChain.Arbitrum,
    Badge.DA.DAC,
    Badge.Stack.Orbit,
    Badge.VM.EVM,
  ],
  display: {
    name: 'Henez',
    slug: 'henez',
    category: 'Optimium',
    stack: 'Arbitrum',
    description:
      'Henez is an Orbit stack L3 with AnyTrust DA powering chain- and account-abstracted DeFi applications.',
    purposes: ['Universal'],
    links: {
      websites: ['https://henez.fi/'],
      apps: ['https://henez.bridge.caldera.xyz/'],
      documentation: ['https://docs.henez.fi/'],
      explorers: ['https://henez.calderaexplorer.xyz/'],
      socialMedia: [
        'https://x.com/HenezFinance',
        'https://mirror.xyz/0xFCA778F8DC17E130E91c03843275939595DD9930',
        'https://t.me/HenezFinance',
      ],
    },
  },
  rpcUrl: 'https://henez.calderachain.xyz/http',
  escrows: [
    {
      address: EthereumAddress('0x66CDC656D5ACf342B2E4dC5a399Ba258Cd3f74c9'), // bridge
      sinceTimestamp: new UnixTime(1733345653),
      tokens: ['ETH'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0xB6028cb0Ee0021b1879eF6e7D3B2eF2C0ca22719'), // standardGW
      sinceTimestamp: new UnixTime(1733345657),
      tokens: '*',
      chain: 'arbitrum',
    },
  ],
})
