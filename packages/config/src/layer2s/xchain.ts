import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const xchain: Layer2 = upcoming({
  id: 'xchain',
  display: {
    name: 'XCHAIN',
    slug: 'xchain',
    description:
      'XCHAIN is an upcoming validium leveraging Polygon zkEVM Supernets.',
    purpose: ['DEX Chain'],
    category: 'Validium',
    provider: 'Polygon',
    links: {
      websites: ['https://idex.io/'],
      apps: ['https://exchange.idex.io/polygon/trading/IDEX-USDC/'],
      documentation: [
        'https://medium.com/idex/the-all-new-idex-a-quick-recap-b27df4cd981b',
      ],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/idexio',
        'https://discord.gg/idex',
        'https://t.me/IDEXChat',
      ],
    },
  },
})
