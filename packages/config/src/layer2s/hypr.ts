import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const hypr: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('hypr'),
  display: {
    name: 'Hypr',
    slug: 'hypr',
    description:
      'Hypr is a Layer 2 blockchain, focused on scaling ZK gaming.',
    purpose: 'Universal',
    category: 'ZK Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'OP Stack',
    links: {
      websites: ['https://www.hypr.network/'],
      apps: ['https://www.hypr.network/applications'],
      documentation: ['https://docs.hypr.network'],
      explorers: ['https://explorer.hypr.network/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/hypr_network',
        'https://t.me/hyprnetwork',
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
