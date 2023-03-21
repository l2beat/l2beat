import { ProjectId } from '@l2beat/shared'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const consensys: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('consensys'),
  display: {
    name: 'ConsenSys zkEVM',
    slug: 'consensys',
    description: '',
    purpose: '',
    links: {
      websites: [],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: [],
    },
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: {
    ...TECHNOLOGY.UPCOMING,
    category: 'ZK Rollup',
  },
  contracts: CONTRACTS.EMPTY,
}
