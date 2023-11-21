import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('blast')

export const blast: Layer2 = {
  isUnderReview: true,
  type: 'layer2',
  id: ProjectId('blast'),
  display: {
    name: 'Blast',
    slug: 'blast',
    description:
      'Blast is an EVM-compatile Optimistic Rollup supporting native yield.',
    purpose: 'Universal, DeFi',
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://blast.io/en'],
      apps: ['https://blast.io/en/airdrop/early-access'],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/Blast_L2'],
    },
  },
  stage: {
    stage: 'UnderReview',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d'),
        tokens: '*',
        description: 'Blast bridge.',
      }),
    ],
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  technology: TECHNOLOGY.UNDER_REVIEW,
  contracts: CONTRACTS.UNDER_REVIEW,
}
