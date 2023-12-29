import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const lisk: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('lisk'),
  display: {
    name: 'Lisk',
    slug: 'lisk',
    description:
      'Lisk announced a strategic move to integrate with the Ethereum ecosystem as an OP Stack L2.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'OP Stack',
    links: {
      websites: ['https://lisk.com/'],
      apps: [],
      documentation: ['https://lisk.com/documentation/'],
      explorers: ['https://liskscan.com/'],
      repositories: ['https://github.com/LiskHQ'],
      socialMedia: [
        'https://twitter.com/LiskHQ',
        'https://lisk.chat/',
        'https://www.youtube.com/channel/UCuqpGfg_bOQ8Ja4pj811PWg/featured',
        'https://t.me/Lisk_HQ',
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
