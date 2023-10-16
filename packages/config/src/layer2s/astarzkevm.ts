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
      "Astar zkEVM is an Ethereum Layer-2 scaling solution that leverages Polygon's CDK and cutting edge zero-knowledge cryptography to enable off-chain transactions while maintaining EVM equivalence. Additionally, it includes a canonical bridge that connects the Astar zkEVM to Ethereum.",
    purpose: 'Universal',
    category: 'ZK Rollup',
    provider: 'Polygon',
    links: {
      websites: ['https://astar.network/astar2'],
      apps: [],
      documentation: ['https://docs.astar.network/docs/learn/zkEVM/'],
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
