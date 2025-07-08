import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('r0ar')
const genesisTimestamp = UnixTime(1728285623)

export const r0ar: ScalingProject = opStackL2({
  capability: 'universal',
  addedAt: UnixTime(1739282637), // 2025-02-11T14:03:57Z
  additionalBadges: [BADGES.RaaS.Zeeve],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'R0ar',
    slug: 'r0ar',
    description:
      'R0ar is an Optimistic Rollup utilizing the OP Stack focusing on DeFi.',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://r0ar.io/'],
      bridges: ['https://r0arbridge.io/'],
      documentation: [],
      explorers: ['https://r0arscan.io/'],
      socialMedia: ['https://x.com/th3r0ar', 'https://t.me/r0ar_community'],
    },
  },
  chainConfig: {
    name: 'r0ar',
    chainId: 193939,
    apis: [{ type: 'rpc', url: 'https://rpc-r0ar.io/', callsPerMinute: 1500 }],
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
