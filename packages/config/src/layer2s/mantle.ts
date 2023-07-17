import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const mantle: Layer2 = {
  type: 'layer2',
  id: ProjectId('mantle'),
  display: {
    name: 'Mantle',
    slug: 'mantle',
    description:
      'Mantle is an EVM compatible zkRollup that has been designed for use on the Ethereum network.',
    purpose: 'Universal',
    category: 'Optimistic Chain',
    links: {
      websites: ['https://www.mantle.xyz/'],
      apps: ['https://bridge.mantle.xyz'],
      documentation: ['https://docs.mantle.xyz/'],
      explorers: ['https://explorer.mantle.xyz/'],
      repositories: ['https://github.com/mantlenetworkio'],
      socialMedia: [
        'https://discord.gg/0xMantle',
        'https://twitter.com/0xMantle',
        'https://medium.com/0xmantle',
        'https://t.me/mantlenetwork',
      ],
    },
  },
  config: {
    escrows: [],
  },
  stage: {
    stage: 'UnderReview',
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  technology: TECHNOLOGY.UNDER_REVIEW,
  contracts: CONTRACTS.UNDER_REVIEW,
}
