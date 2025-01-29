import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('river')

export const river: Layer2 = opStackL2({
  addedAt: new UnixTime(1729867724), // 2024-10-25T17:48:44Z
  additionalBadges: [Badge.RaaS.Caldera],
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
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
  },
  isNodeAvailable: true,
  rpcUrl: 'https://mainnet.rpc.river.build',
  genesisTimestamp: new UnixTime(1716094800), //first sequencer tx
  discoveryDrivenData: true,
})
