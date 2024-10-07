import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('polynomial')

export const polynomial: Layer2 = opStackL2({
  discovery,
  badges: [Badge.RaaS.Conduit],
  display: {
    name: 'Polynomial',
    slug: 'polynomial',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Polynomial Chain is a derivatives chain that addresses liquidity fragmentation with a unified liquidity layer, enabling innovative derivatives.',
    purposes: ['DeFi'],
    links: {
      websites: ['https://polynomial.fi/'],
      apps: [],
      documentation: ['https://docs.polynomial.fi/'],
      explorers: ['https://polynomialscan.io/'],
      repositories: ['https://github.com/Polynomial-Protocol'],
      socialMedia: [
        'https://x.com/PolynomialFi',
        'https://discord.gg/Mr9XKU5W',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.polynomial.fi',
  finality: {
    type: 'OPStack-blob',
    genesisTimestamp: new UnixTime(1718038307),
    minTimestamp: new UnixTime(1718049059),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  isNodeAvailable: 'UnderReview',
  genesisTimestamp: new UnixTime(1718038307),
  milestones: [
    {
      name: 'Polynomial Chain announced',
      date: '2024-07-16T00:00:00.000Z',
      description: 'Polynomial Chain announced on X.',
      link: 'https://x.com/PolynomialFi/status/1813259120629457403',
      type: 'general',
    },
  ],
  usesBlobs: true,
  discoveryDrivenData: true,
})
