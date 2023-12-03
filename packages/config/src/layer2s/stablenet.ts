import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const stablenet: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('stablenet'),
  display: {
    name: 'StableNet',
    slug: 'stablenet',
    description:
      'StableNet is an Ethereum L2 network powered by Lumoz utilizing Polygon CDK & Celestia DA.',
    purpose: 'Universal',
    category: 'ZK Rollup',
    dataAvailabilityMode: 'NotApplicable',
    provider: 'Polygon',
    links: {
      websites: ['https://stablenet.io/'],
      apps: [],
      documentation: ['https://docs.stablenet.io/'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/LumozOrg'],
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
