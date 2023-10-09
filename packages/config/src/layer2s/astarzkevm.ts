import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const astarzkevm: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('astarzkevm'),
  display: {
    name: 'Astar zkEVM',
    slug: 'astarzkevm',
    description:
      "Astar zkEVM is the Ethereum L2 scaling solution powered by Polygon's CDK",
    purpose: 'Universal',
    category: 'ZK Rollup',
    provider: 'Polygon',
    links: {
      websites: ['https://astar.network/blog/supernova-is-here!-39292'],
      apps: [],
      documentation: ['https://astar.network/blog/supernova-is-here!-39292'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/AstarzkEVM'],
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
