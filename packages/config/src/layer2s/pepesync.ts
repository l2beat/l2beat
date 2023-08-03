import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const pepesync: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('pepesync'),
  display: {
    name: 'PepeSync',
    slug: 'pepesync',
    description:
      'PepeSync is a decentralized, EVM Rollup built for the World of Meme Coins. PepeSync is a Layer 2 Launchpad Scaled on Ethureum!',
    purpose: 'Launchpad,AMM',
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://pepesync.xyz'],
      apps: ['https://bridge.test.pepesync.xyz'],
      documentation: ['https://docs.pepesync.xyz'],
      explorers: [
        'https://explorer.test.pepesync.xyz',
        'https://pepesync.instatus.com',
      ],
      repositories: ['https://github.com/pepesync'],
      socialMedia: [
        'https://twitter.com/Pepe_Sync',
        'https://discord.gg/aBFkJatT',
        'https://mirror.xyz/0x80591D2e5bf600fc4f00cc4A92DfA5840f34Ed4E',
      ],
    },
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}
