import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const ancient: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('ancient'),
  display: {
    name: 'Ancient8',
    slug: 'ancient',
    description:
      'Ancient8 Chain is a gaming-focused community-driven Ethereum Layer 2 built using OP Stack.',
    purpose: 'Gaming',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'OP Stack',
    links: {
      websites: ['https://www.ancient8.gg/'],
      apps: [],
      documentation: ['https://docs.ancient8.gg/'],
      explorers: ['https://testnet.a8scan.io/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/Ancient8_gg',
        'https://discord.gg/ancient8',
        'https://blog.ancient8.gg/',
        'https://t.me/ancient8_gg',
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
