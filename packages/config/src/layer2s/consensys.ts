import { ProjectId } from '@l2beat/shared'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const consensys: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('consensys'),
  display: {
    name: 'ConsenSys zkEVM',
    slug: 'consensys',
    description:
      'Consensys zkEVM is an EVM compatible zkRollup that has been designed for use on the Ethereum network. At present, it is undergoing further testing and optimization on the Goerli testnet before deployment.',
    purpose: 'Universal',
    links: {
      websites: ['https://consensys.net/zkevm/'],
      apps: ['https://goerli.zkevm.consensys.net/'],
      documentation: ['https://docs.zkevm.consensys.net/overview'],
      explorers: ['https://explorer.goerli.zkevm.consensys.net/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/consensys',
        'https://discord.gg/consensys',
      ],
    },
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: {
    ...TECHNOLOGY.UPCOMING,
    category: 'ZK Rollup',
  },
  contracts: CONTRACTS.EMPTY,
}
