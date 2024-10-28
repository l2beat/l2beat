import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('shape')

export const shape: Layer2 = opStackL2({
  createdAt: new UnixTime(1730131160), // 2024-10-28
  badges: [Badge.RaaS.Alchemy],
  discovery,
  usesBlobs: true,
  display: {
    name: 'River',
    slug: 'river',
    description:
      'River is a Rollup based on the OP Stack. It is used by the River protocol - a protocol for building decentralized real-time messaging apps - acting as its backbone.',
    links: {
      websites: ['https://river.build/'],
      apps: ['https://river-mainnet.bridge.river.build/'],
      documentation: [],
      explorers: ['https://explorer.river.build/'],
      repositories: [],
      socialMedia: ['https://x.com/buildonriver'],
    },
    activityDataSource: 'Blockchain RPC',
    architectureImage: 'opstack',
  },
  isNodeAvailable: true,
  rpcUrl: 'https://explorer.river.build/api',
  genesisTimestamp: new UnixTime(1716094800), //first sequencer tx
  discoveryDrivenData: true,
})
