import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from '../common'
import { Layer2 } from './types'

export const reddiozkvm: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('reddiozkvm'),
  display: {
    name: 'Reddio zkVM',
    slug: 'reddiozkvm',
    description:
      'Reddio zkVM is an upcoming ZK Rollup focused on general use cases like Games and Apps, powered by Starknet Stack.',
    purposes: ['Universal', 'Gaming'],
    category: 'ZK Rollup',

    provider: 'Starknet',
    links: {
      websites: ['https://reddio.com'],
      apps: [],
      documentation: [
        'https://docs.reddio.com/guide/starknet/smart-contracts/overview.html',
      ],
      explorers: [],
      repositories: ['https://github.com/reddio-com/starknet-appchain-utils'],
      socialMedia: [
        'https://twitter.com/reddio_com',
        'https://facebook.com/reddiocom',
        'https://linkedin.com/company/reddio',
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
