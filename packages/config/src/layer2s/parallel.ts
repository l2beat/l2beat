import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('parallel')

export const parallel: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('parallel'),
  display: {
    name: 'Parallel',
    slug: 'parallel',
    headerWarning:'',
    description:
      'Parallel will launch an Ethereum Layer2 supporting native yield. More information coming soon.',
    purpose: 'Universal, DeFi',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'NotApplicable',
    links: {
      websites: ['https://parallel.fi'],
      apps: ['https://parallel.fi/airdrop'],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/ParallelFi'],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: '*',
        tokens: '*',
        description: '*',
        isUpcoming: true,
      }),
    ],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}
