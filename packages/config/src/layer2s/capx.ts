import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const capx: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('capx'),
  display: {
    name: 'Capx',
    slug: 'capx',
    description:
      'Capx is a sector-specific Layer 2 blockchain, specialised for token distribution and trading, facilitating curated distributions for project communities, token streaming for investor distributions, and a liquid secondary market for tokens.',
    purpose: 'DeFi',
    category: 'ZK Rollup',
    provider: 'Polygon',
    links: {
      websites: ['https://www.capx.fi/'],
      apps: ['https://app.capx.fi/explore'],
      documentation: ['https://capx.gitbook.io/docs'],
      explorers: ['https://explorer.palm.io/'],
      repositories: [],
      socialMedia: [
        'https://discord.com/invite/HAGATNqT8J',
        'https://twitter.com/capxfi',
        'https://t.me/capxfi',
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
