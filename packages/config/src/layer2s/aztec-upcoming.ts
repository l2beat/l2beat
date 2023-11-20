import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const aztecUpcoming: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('aztecv2'),
  display: {
    name: 'Aztec',
    slug: 'aztec',
    description:
      'Aztec is an open source layer 2 network that brings programmable privacy and scalability to Ethereum.',
    purpose: 'Privacy',
    category: 'ZK Rollup',
    links: {
      websites: ['https://aztec.network/'],
      apps: [],
      documentation: ['https://docs.aztec.network/'],
      explorers: [],
      repositories: ['https://github.com/AztecProtocol/aztec-packages'],
      socialMedia: [
        'https://twitter.com/aztecnetwork',
        'https://medium.com/aztec-protocol',
        'https://t.me/aztecprotocol',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [],
  },
  stage: {
    stage: 'NotApplicable',
  },
  milestones: [
    {
      name: 'Aztec Sandbox',
      date: '2023-09-20T00:00:00Z',
      link: 'https://medium.com/aztec-protocol/announcing-aztec-sandbox-the-endgame-for-smart-contract-privacy-f7f883ae352d',
      description:
        'Announcing the Aztec Sandbox: The Endgame for Smart Contract Privacy.',
    },
  ],
  riskView: UPCOMING_RISK_VIEW,
  contracts: CONTRACTS.EMPTY,
  technology: TECHNOLOGY.UPCOMING,
}
