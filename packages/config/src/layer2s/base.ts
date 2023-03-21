import { ProjectId } from '@l2beat/shared'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const base: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('base'),
  display: {
    name: 'Base',
    slug: 'base',
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
    category: 'Optimistic Rollup',
    provider: 'Optimism',
  },
  contracts: CONTRACTS.EMPTY,
}
