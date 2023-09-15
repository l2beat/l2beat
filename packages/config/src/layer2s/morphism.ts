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
      'Morphism is an EVM compatible rollup. It operates as an optimistic rollup with ZK fault proofs.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://www.morphism.xyz'],
      apps: ['https://bridge-testnet.morphism.xyz'],
      documentation: ['https://docs.morphism.xyz'],
      explorers: ['https://explorer-testnet.morphism.xyz'],
      repositories: ['https://github.com/morphism-labs'],
      socialMedia: [
        'https://twitter.com/Morphism_xyz',
        'https://medium.com/@Morphism_xyz',
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
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}
