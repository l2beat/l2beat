import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const morph: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('morph'),
  display: {
    name: 'Morph',
    slug: 'morph',
    description:
      'Morph is an EVM compatible rollup. It operates as an optimistic rollup with ZK fault proofs.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    links: {
      websites: ['https://www.morph.xyz'],
      apps: ['https://bridge-testnet.morph.xyz'],
      documentation: ['https://docs.morph.xyz'],
      explorers: ['https://explorer-testnet.morph.xyz'],
      repositories: ['https://github.com/morph-labs'],
      socialMedia: [
        'https://twitter.com/Morph_xyz',
        'https://medium.com/@Morph_xyz',
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
