import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const aztecV2: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('aztec-v2'),
  display: {
    name: 'Aztec',
    slug: 'aztec',
    description:
      'Aztec is an open source layer 2 network that brings programmable privacy and scalability to Ethereum.',
    purpose: 'Privacy',
    category: 'ZK Rollup',
    dataAvailabilityMode: 'NotApplicable',
    links: {
      websites: ['https://aztec.network/'],
      apps: [],
      documentation: ['https://docs.aztec.network/'],
      explorers: [],
      repositories: [
        'https://github.com/AztecProtocol/aztec-packages',
        'https://github.com/AztecProtocol/powdr',
        'https://github.com/AztecProtocol/aztec-nr',
        'https://github.com/AztecProtocol/barretenberg',
      ],
      socialMedia: [
        'https://twitter.com/aztecnetwork',
        'https://medium.com/aztec-protocol',
        'https://t.me/aztecprotocol',
        'https://forum.aztec.network/',
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
    {
      name: 'Noir<> Halo2 Integration',
      date: '2023-11-29T00:00:00Z', 
      link: 'https://twitter.com/aztecnetwork/status/1729934013358600576',
      description: "Noir's flexibility meets Halo2's performance.",
    },
    {
      name: 'ACVM Docs',
      date: '2023-11-29T00:00:00Z',
      link: 'https://twitter.com/aztecnetwork/status/1729934013358600576',
      description: 'These docs will serve as a valuable resource for understanding Noirs codebase, aiding in audits, and learning about proving backend integrations.',
    },
  ],
  riskView: UPCOMING_RISK_VIEW,
  contracts: CONTRACTS.EMPTY,
  technology: TECHNOLOGY.UPCOMING,
}