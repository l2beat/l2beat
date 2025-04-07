import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('settlus')
const genesisTimestamp = UnixTime(1736459256)

export const settlus: ScalingProject = opStackL2({
  capability: 'universal',
  addedAt: UnixTime(1737636288), // 2025-01-23T12:44:48+00:00
  additionalBadges: [BADGES.RaaS.Alchemy],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Settlus',
    slug: 'settlus',
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    description:
      'Settlus is an OP stack L2 designed to provide transparent settlement system for the creator economy.',
    links: {
      websites: ['https://settlus.org/'],
      apps: ['https://settlus-mainnet.bridge.alchemy.com/'],
      explorers: ['https://mainnet.settlus.network/'],
      documentation: ['https://docs.settlus.org/'],
      socialMedia: [
        'https://x.com/Settlusofficial',
        'https://github.com/settlus',
      ],
    },
  },
  finality: {
    type: 'OPStack',
    minTimestamp: genesisTimestamp,
    genesisTimestamp: genesisTimestamp,
    l2BlockTimeSeconds: 1,
    lag: 0,
    stateUpdate: 'disabled',
  },
  chainConfig: {
    name: 'settlus',
    chainId: 5371,
    apis: [
      {
        type: 'rpc',
        url: 'https://settlus-septestnet.g.alchemy.com/public',
        callsPerMinute: 1500,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  discovery,
  genesisTimestamp,
  isNodeAvailable: 'UnderReview',
})
