import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { UPCOMING_RISK_VIEW, TECHNOLOGY, CONTRACTS} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mangata')

export const mangata: Layer2 = {
  type: 'layer2',
  id: ProjectId('mangata'),
  display: {
    name: 'Mangata',
    slug: 'mangata',
    description:
      'Mangata is the interchain DEX, a single place to trade all crypto, Forex and RWAs.',
    purpose: 'Exchange',
    links: {
      websites: ['https://mangata.finance/'],
      apps: [
        'https://app.mangata.finance/',
        'https://stakemgx.com/',
      ],
      documentation: [
        'https://mangata-finance.notion.site/Welcome-to-Mangata-09bac178e4aa40069690f4f6cc08bdd5',
        'https://docs.mangata.finance/sdk/',

      ],
      explorers: [
        'https://mangatax.subscan.io/',
        'https://www.mgx-analytics.xyz/',
      ],
      repositories: [
        'https://github.com/mangata-finance',
      ],
      socialMedia: [
        'https://medium.com/@mangata-finance',
        'https://twitter.com/MangataFinance',
        'https://discord.gg/mangata',
        'https://www.youtube.com/c/MangataFinance',
        'https://t.me/xmangata',
        'https://www.instagram.com/mangatafinance/',
        'https://www.tiktok.com/@mangatadex',
        'https://www.linkedin.com/company/mangata-finance',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: {
    ...TECHNOLOGY.UPCOMING,
    provider: undefined,
    category: 'ZK Rollup',
  },
  contracts: CONTRACTS.EMPTY,
}
