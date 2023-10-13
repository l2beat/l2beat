import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const lyrafinance: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('lyrafinance'),
  display: {
    name: 'Lyra',
    slug: 'lyrafinance',
    description:
      'Lyra Chain is a L2 scaling solution build using OP Stack specially for Lyra protocol - a settlement protocol for spot, perpetuals and options trading.',
    purpose: 'Trading',
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://lyra.finance/v2'],
      apps: [],
      documentation: [
        'https://mirror.xyz/lyra.eth/JRj-8JInwtW8jp5y6QzyUHq0suTcH_B1iGO7V5LYwVQ',
      ],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/lyrafinance',
        'https://discord.gg/Lyra',
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
