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
      'Polygon zkEVM will be an EVM compatible zkRollup on Ethereum. Currently it is deployed on the Goerli testnet.',
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
