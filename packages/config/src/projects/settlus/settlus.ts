import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('settlus')
const genesisTimestamp = UnixTime(1736459256)

export const settlus: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: false,
  },
  capability: 'universal',
  addedAt: UnixTime(1737636288), // 2025-01-23T12:44:48+00:00
  additionalBadges: [BADGES.RaaS.Alchemy],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  isPartOfSuperchain: false,
  display: {
    name: 'Settlus',
    slug: 'settlus',
    stacks: ['OP Stack'],
    description:
      'Settlus is an OP stack L2 designed to provide transparent settlement system for the creator economy.',
    links: {
      websites: ['https://settlus.org/'],
      bridges: ['https://settlus-mainnet.bridge.alchemy.com/'],
      explorers: ['https://mainnet.settlus.network/'],
      documentation: ['https://docs.settlus.org/'],
      repositories: ['https://github.com/settlus'],
      socialMedia: [
        'https://x.com/Settlusofficial',
        'https://github.com/settlus',
      ],
    },
  },
  chainConfig: {
    name: 'settlus',
    chainId: 5371,
    apis: [],
  },
  discovery,
  genesisTimestamp,
  isNodeAvailable: 'UnderReview',
})
