import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const stealthchain: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('stealthchain'),
  display: {
    name: 'StealthChain',
    slug: 'stealthchain',
    description: 'Degen Stealth Launchpad, Cross Chain Token Bridge & LP Pool.',
    purpose: 'Launchpad',
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://stealthchain.org'],
      apps: [],
      documentation: ['https://docs.stealthchain.org'],
      explorers: [
        'https://test.stealthscan.xyz/',
        'https://stealthpad.instatus.com/',
      ],
      repositories: ['https://github.com/stealthpadxyz'],
      socialMedia: [
        'https://twitter.com/stealthpadxyz',
        'https://discord.gg/tWA5AhUS',
        'https://mirror.xyz/stealthpad.eth',
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
