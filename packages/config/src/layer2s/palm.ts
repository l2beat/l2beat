import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const palm: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('palm'),
  display: {
    name: 'Palm',
    slug: 'palm',
    description:
      'The Palm network uses IBFT 2.0 Proof of Authority (PoA) consensus, with network validators being run by key stakeholders.',
    purpose: 'NFT Chain',
    category: 'ZK Rollup',
    links: {
      websites: ['https://palm.network/'],
      apps: ['https://app.palm.io/bridge', 'https://uniswap-v3.scroll.io'],
      documentation: ['https://docs.palm.io/'],
      explorers: [
        'https://explorer.palm.io/',
      ],
      repositories: [
        '',
  
      ],
      socialMedia: [
        'https://twitter.com/palmnetwork3',
   
      ],
    },
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}

