import { UnixTime } from '@l2beat/shared-pure'

import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { BADGES } from '../badges'
import { opStackL3 } from '../layer2s/templates/opStack'

const discovery = new ProjectDiscovery('syndicateframe', 'base')

export const syndicateframe: Layer3 = opStackL3({
  addedAt: new UnixTime(1711471599), // 2024-03-26T16:46:39Z
  discovery,
  additionalBadges: [BADGES.L3ParentChain.Base, BADGES.RaaS.Caldera],
  additionalPurposes: ['Social'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  usesBlobs: true,
  display: {
    name: 'Syndicate Frame Chain',
    shortName: 'Frame Chain',
    slug: 'syndicateframe',
    description:
      'Syndicate Frame Chain is an OP Stack L3 on Base for Farcaster Frame developers.',
    links: {
      websites: ['https://syndicate.io/blog/syndicate-frame-chain'],
      apps: [
        'https://bridge-frame.syndicate.io/',
        'https://frame.syndicate.io/',
      ],
      documentation: ['https://docs.syndicate.io/get-started/introduction'],
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
        callsPerMinute: 1500,
      },
    ],
  },
  genesisTimestamp: new UnixTime(1707371473),
  isNodeAvailable: 'UnderReview',
})
