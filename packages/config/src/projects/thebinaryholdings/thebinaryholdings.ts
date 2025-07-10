import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('thebinaryholdings')

export const thebinaryholdings: ScalingProject = opStackL2({
  addedAt: UnixTime(1726668186), // 2024-09-18T14:03:06Z
  archivedAt: UnixTime(1737676800), // 2025-01-24T00:00:00.000Z,
  discovery,
  additionalBadges: [BADGES.RaaS.Zeeve],
  associatedTokens: ['BNRY'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'The Binary Holdings',
    slug: 'thebinaryholdings',
    shortName: 'Binary',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    description:
      'The Binary Holdings is a web3 infrastructure that integrates into telecommunication and banking apps to increase user engagement, retention, and ARPU (Average Revenue Per User) - while rewarding users for their engagement. It uses its own token (BNRY) for gas.',
    links: {
      websites: ['https://thebinaryholdings.com/'],
      documentation: ['https://docs.thebinaryholdings.com/'],
      explorers: ['https://explorer.thebinaryholdings.com'],
      socialMedia: [
        'https://twitter.com/thebinaryhldgs',
        'https://t.me/tbhofficialchat',
        'https://discord.gg/wCXJmTBGr2',
      ],
    },
  },
  chainConfig: {
    name: 'thebinaryholdings',
    chainId: 624,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.zero.thebinaryholdings.com',
        callsPerMinute: 1500,
      },
    ],
  },
  genesisTimestamp: UnixTime(1719397465),
  isNodeAvailable: 'UnderReview',
  milestones: [],
  nonTemplateOptimismPortalEscrowTokens: ['BNRY'],
})
