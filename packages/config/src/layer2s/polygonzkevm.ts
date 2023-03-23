import { ProjectId } from '@l2beat/shared'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const polygonzkevm: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('polygonzkevm'),
  display: {
    name: 'Polygon zkEVM',
    slug: 'polygonzkevm',
    description:
      'Polygon zkEVM is an EVM compatible zkRollup that has been designed for use on the Ethereum network. At present, it is undergoing further testing and optimization on the Goerli testnet before deployment.',
    purpose: 'Universal',
    links: {
      websites: ['https://polygon.technology/polygon-zkevm'],
      apps: ['https://public.zkevm-test.net'],
      documentation: [
        'https://wiki.polygon.technology/docs/zkEVM/introduction',
      ],
      explorers: [],
      repositories: ['https://github.com/0xPolygonHermez'],
      socialMedia: [
        'https://twitter.com/0xPolygon',
        'https://discord.gg/XvpHAxZ',
        'https://polygon.technology/blog-tags/polygon-zk',
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
