import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const mode: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('mode'),
  display: {
    name: 'Mode Network',
    slug: 'mode',
    description:
      'Mode is the Ethereum L2 designed for builders and users to grow as the network grows.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://www.mode.network/'],
      apps: [],
      documentation: ['https://docs.mode.network/'],
      explorers: ['https://sepolia.explorer.mode.network/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/modenetwork',
        'https://discord.gg/modenetwork',
        'https://mode.mirror.xyz/',
        'https://t.me/ModeNetworkOfficial',
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
