import { UnixTime } from '@l2beat/shared-pure'

import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL3 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('syndicateframe')

export const syndicateframe: ScalingProject = opStackL3({
  addedAt: UnixTime(1711471599), // 2024-03-26T16:46:39Z
  discovery,
  hostChain: 'base',
  additionalBadges: [BADGES.L3ParentChain.Base, BADGES.RaaS.Caldera],
  additionalPurposes: ['Social'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Syndicate Frame Chain',
    shortName: 'Frame Chain',
    slug: 'syndicateframe',
    description:
      'Syndicate Frame Chain is an OP Stack L3 on Base for Farcaster Frame developers.',
    links: {
      websites: ['https://syndicate.io/blog/syndicate-frame-chain'],
      bridges: [
        'https://bridge-frame.syndicate.io/',
        'https://frame.syndicate.io/',
      ],
      documentation: [
        'https://docs.syndicate.io/docs/core/get-started/introduction',
      ],
      explorers: ['https://explorer-frame.syndicate.io/'],
      repositories: [
        'https://github.com/WillPapper/syndicate-farcaster-frame-starter',
      ],
      socialMedia: [
        'https://warpcast.com/syndicate',
        'https://x.com/syndicateio',
      ],
    },
  },
  chainConfig: {
    name: 'syndicateframe',
    chainId: 5101,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc-frame.syndicate.io',
        callsPerMinute: 300,
      },
    ],
  },
  genesisTimestamp: UnixTime(1707371473),
  isNodeAvailable: 'UnderReview',
})
