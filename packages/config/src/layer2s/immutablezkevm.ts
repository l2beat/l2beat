import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const immutablezkevm: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('immutablezkevm'),
  display: {
    name: 'Immutable zkEVM',
    slug: 'immutablezkevm',
    description:
      "Immutable zkEVM is an upcoming ZK Rollup focused on gaming and powered by Polygon's CDK.",
    purpose: 'Universal, Gaming',
    category: 'ZK Rollup',
    dataAvailabilityMode: 'NotApplicable',
    provider: 'Polygon',
    links: {
      websites: ['https://immutable.com/products/immutable-zkevm'],
      apps: [],
      documentation: ['https://docs.x.immutable.com/docs/zkEVM/overview'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/Immutable'],
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
