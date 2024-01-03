import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const specular: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('specular'),
  display: {
    name: 'Specular',
    slug: 'specular',
    description:
      'Specular is an EVM-native optimistic rollup designed to scale Ethereum securely, with minimal additional trust assumptions.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'NotApplicable',
    links: {
      websites: ['https://specular.network/'],
      apps: [],
      documentation: ['https://docs.specular.network/overview/welcome'],
      explorers: ['https://explorer.specular.network/'],
      repositories: ['https://github.com/SpecularL2/'],
      socialMedia: ['https://twitter.com/SpecularL2'],
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
