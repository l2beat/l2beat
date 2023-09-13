import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const mantapacific: Layer2 = {
  isUnderReview: true,
  type: 'layer2',
  id: ProjectId('mantapacific'),
  display: {
    name: 'Manta Pacific',
    slug: 'mantapacific',
    description:
      'Manta Pacific is an optimistic rollup empowering EVM-native zero-knowledge (ZK) applications and general dapps with a scalable, cost-effective environment to deploy simply using Solidity. Manta Pacific plans to eventually leverage Celestia for data availability to lower gas costs for users across all applications in its ecosystem.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://pacific.manta.network/'],
      apps: ['https://pacific-bridge.manta.network/'],
      documentation: ['https://docs.manta.network/'],
      explorers: ['https://pacific-explorer.manta.network/'],
      repositories: ['https://github.com/Manta-Network'],
      socialMedia: [
        'https://discord.gg/mantanetwork',
        'https://twitter.com/MantaNetwork',
        'https://medium.com/@mantanetwork',
      ],
    },
  },
  stage: {
    stage: 'UnderReview',
  },
  config: {
    escrows: [],
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  technology: TECHNOLOGY.UNDER_REVIEW,
  contracts: CONTRACTS.UNDER_REVIEW,
}
