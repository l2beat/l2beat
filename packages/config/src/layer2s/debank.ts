import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const debank: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('debank'),
  display: {
    name: 'Debank Chain',
    slug: 'debank',
    description:
      'Debank Chain is an upcoming scaling solution by Debank team. It is powered by the OP Stack.',
    purpose: 'Universal, Social',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'OP Stack',
    links: {
      websites: ['https://debank.com/account'],
      apps: [],
      documentation: [],
      explorers: ['https://explorer.testnet.debank.com/'],
      repositories: ['https://github.com/DeBankDeFi/DeBankChain'],
      socialMedia: [
        'https://twitter.com/DebankDeFi',
        'https://medium.com/debank',
        'https://debank.com/official/DeBank',
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
