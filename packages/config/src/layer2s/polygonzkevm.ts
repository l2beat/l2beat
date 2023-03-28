import { ProjectId, UnixTime } from '@l2beat/shared'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { ProjectDiscovery } from './common/ProjectDiscovery'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('polygonzkevm')

export const polygonzkevm: Layer2 = {
  type: 'layer2',
  id: ProjectId('polygonzkevm'),
  display: {
    name: 'Polygon zkEVM',
    slug: 'polygonzkevm',
    warning:
      'This project is currently undergoing review from our research team.',
    description:
      'Polygon zkEVM is aiming to become a decentralized Ethereum Layer 2 scalability solution that uses cryptographic zero-knowledge proofs to offer validity and finality of off-chain transactions. Polygon zkEVM wants to be equivalent with the Ethereum Virtual Machine.',
    purpose: 'Universal',
    links: {
      websites: ['https://polygon.technology/polygon-zkevm'],
      apps: ['https://bridge.zkevm-rpc.com'],
      documentation: [
        'https://wiki.polygon.technology/docs/zkEVM/introduction',
      ],
      explorers: ['https://zkevm.polygonscan.com/'],
      repositories: ['https://github.com/0xPolygonHermez'],
      socialMedia: [
        'https://twitter.com/0xPolygon',
        'https://discord.gg/XvpHAxZ',
        'https://polygon.technology/blog-tags/polygon-zk',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: discovery.getContract('Bridge').address,
        sinceTimestamp: new UnixTime(1679653127),
        tokens: '*',
      },
    ],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: {
    ...TECHNOLOGY.UPCOMING,
    category: 'ZK Rollup',
  },
  contracts: CONTRACTS.EMPTY,
}
