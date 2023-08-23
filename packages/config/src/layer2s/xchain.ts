import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const xchain: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('xchain'),
  display: {
    name: 'XCHAIN',
    slug: 'xchain',
    description:
      'XCHAIN is an upcoming validium leveraging Polygon zkEVM Supernets.',
    purpose: 'DEX Chain',
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
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}
