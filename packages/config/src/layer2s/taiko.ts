import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const taiko: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('taiko'),
  display: {
    name: 'Taiko',
    slug: 'taiko',
    description:
      'Taiko is a decentralized, Ethereum-equivalent ZK Rollup that has been developed on the Ethereum network. At present, Taiko is deployed on the Sepolia testnet for further testing and optimization.',
    purpose: 'Universal',
    category: 'ZK Rollup',
    links: {
      websites: ['https://taiko.xyz'],
      apps: ['https://bridge.test.taiko.xyz'],
      documentation: ['https://taiko.xyz/docs'],
      explorers: [
        'https://explorer.test.taiko.xyz',
        'https://status.test.taiko.xyz',
      ],
      repositories: ['https://github.com/taikoxyz'],
      socialMedia: [
        'https://twitter.com/taikoxyz',
        'https://discord.gg/taikoxyz',
        'https://taiko.mirror.xyz',
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
