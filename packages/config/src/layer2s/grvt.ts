import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const grvt: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('grvt'),
  display: {
    name: 'GRVT',
    slug: 'grvt',
    description:
      'Gravity (GRVT) is a hybrid crypto derivatives exchange, providing a centralized exchange-like experience while being decentralized, featuring self-custodial funds and wallets.',
    purpose: 'DeFi',
    category: 'ZK Rollup',
    provider: 'zkSync',
    links: {
      websites: ['https://grvt.io'],
      apps: [],
      documentation: ['https://docs.grvt.io'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/grvt_io',
        'https://discord.gg/3jsVPwaGeB',
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
