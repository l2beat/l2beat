import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const morphism: Layer2 = {
    isUpcoming: true,
    type: 'layer2',
    id: ProjectId('morphism'),
    display: {
      name: 'Morphism',
      slug: 'morphism',
      description:
        'Morphism is a decentralized Layer2 network that maintains EVM equivalence in terms of security, availability, and compatibility. It employs modular solutions and optimistic ZK-rollup to scale Ethereum securely and efficiently. ',
      purpose: 'Universal',
      category: 'Optimistic ZK Rollup',
      links: {
        websites: ['https://www.morphism.xyz'],
        apps: ['https://bridge-testnet.morphism.xyz'],
        documentation: ['https://docs.morphism.xyz'],
        explorers: ['https://explorer-testnet.morphism.xyz'],
        repositories: ['https://github.com/morphism-labs'],
        socialMedia: [
          'https://twitter.com/Morphism_xyz',
          'https://medium.com/@Morphism_xyz'
        ],
      },
    },
    stage: {
        stage: 'NotApplicable',
      },
    config: {
      escrows: [],
    },
    riskView: UPCOMING_RISK_VIEW,
    technology: { ...TECHNOLOGY.UPCOMING },
    contracts: CONTRACTS.EMPTY,
  }

