import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const molten: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('molten'),
  display: {
    name: 'Molten Network',
    slug: 'molten',
    description:
      'Molten Network is an upcoming scaling solution by Unidex team. It is powered by the OP Stack.',
    purpose: 'DeFi',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'OP Stack',
    links: {
      websites: ['https://www.unidex.exchange/molten-network'],
      apps: [],
      documentation: ['https://docs.unidex.exchange/appchain/markdown'],
      explorers: ['https://unidex-celestium.calderaexplorer.xyz/'], //Temporarily Unavailable
      repositories: [],
      socialMedia: [
        'https://twitter.com/UniDexFinance',
        'https://discord.gg/unidex',
        'https://mirror.xyz/unidexexchange.eth',
        'https://t.me/unidexfinance',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}
