import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const x1: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('x1'),
  display: {
    name: 'X1',
    slug: 'x1',
    description:
      'X1 is an upcoming Validium by OKX. It is powered by the Polygon CDK.',
    purpose: 'Universal',
    category: 'Validium',
    dataAvailabilityMode: 'NotApplicable',
    provider: 'Polygon',
    links: {
      websites: ['https://okx.com/x1'],
      apps: [],
      documentation: ['https://okx.com/x1/docs'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/X1_Network'],
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
