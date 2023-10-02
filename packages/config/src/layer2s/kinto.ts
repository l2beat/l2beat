import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const kinto: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('kinto'),
  display: {
    name: 'Kinto',
    slug: 'kinto',
    description:
      'Kinto is the first KYCed Layer 2 capable of supporting both modern financial institutions and decentralized protocols.',
    purpose: 'DeFi',
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://kinto.xyz'],
      apps: [],
      documentation: ['https://docs.kinto.xyz'],
      explorers: ['https://test-explorer.kinto.xyz/'],
      repositories: ['https://github.com/kintoxyz'],
      socialMedia: [
        'https://twitter.com/kintoxyz',
        'https://discord.gg/utEYFxKFgB',
        'https://mirror.xyz/kintoxyz.eth',
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
