import { ProjectId } from '@l2beat/shared'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const mantle: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('mantle'),
  display: {
    name: 'Mantle',
    slug: 'mantle',
    description:
      'Mantle is an EVM compatible zkRollup that has been designed for use on the Ethereum network. At present, it is undergoing further testing and optimization on the Goerli testnet before deployment.',
    purpose: 'Universal',
    links: {
      websites: ['https://www.mantle.xyz/'],
      apps: ['https://bridge.testnet.mantle.xyz'],
      documentation: ['https://docs.mantle.xyz/'],
      explorers: ['https://explorer.testnet.mantle.xyz/'],
      repositories: ['https://github.com/mantlenetworkio'],
      socialMedia: [
        'https://discord.gg/0xMantle',
        'https://twitter.com/0xMantle',
        'https://medium.com/0xmantle',
        'https://t.me/mantlenetwork',
      ],
    },
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: { ...TECHNOLOGY.UPCOMING, category: 'Optimistic Chain' },
  contracts: CONTRACTS.EMPTY,
}
