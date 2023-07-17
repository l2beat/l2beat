import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const base: Layer2 = {
  type: 'layer2',
  id: ProjectId('base'),
  display: {
    name: 'Base',
    slug: 'base',
    description:
      'Base is an Optimistic Rollup that has been developed on the Ethereum network, utilizing OP Stack technology.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    provider: 'Optimism',
    links: {
      websites: ['https://base.org/'],
      apps: ['https://bridge.base.org/'],
      documentation: ['https://docs.base.org/', 'https://stack.optimism.io/'],
      explorers: ['https://basescan.org/'],
      repositories: ['https://github.com/base-org'],
      socialMedia: [
        'https://twitter.com/BuildOnBase',
        'https://discord.gg/buildonbase',
        'https://base.mirror.xyz/',
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
