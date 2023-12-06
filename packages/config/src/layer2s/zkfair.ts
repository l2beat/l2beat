import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const zkfair: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('zkfair'),
  display: {
    name: 'ZKFair',
    slug: 'zkfair',
    description:
      'ZKFair is the first community Validium based on Polygon CDK and Celestia DA, championing fairness.',
    purpose: 'Universal',
    category: 'Validium',
    dataAvailabilityMode: 'NotApplicable',
    provider: 'Polygon',
    links: {
      websites: ['https://zkfair.io/'],
      apps: [],
      documentation: ['https://docs.zkfair.io/'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/ZK_fair'],
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
