import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('superseed')
const genesisTimestamp = UnixTime(1726179683)

export const superseed: ScalingProject = opStackL2({
  capability: 'universal',
  addedAt: UnixTime(1743379200), // 2025-03-31T00:00:00Z
  additionalBadges: [BADGES.RaaS.Conduit],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Superseed',
    slug: 'superseed',
    description:
      'Superseed is an Optimistic Rollup utilizing the OP Stack, aiming to provide a CDP lending platform enshrined in the protocol and redistribution of Layer 2 fees to its users.',
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://superseed.xyz/'],
      apps: ['https://bridge.superseed.xyz/'],
      documentation: ['https://docs.superseed.xyz/'],
      explorers: ['https://explorer.superseed.xyz/'],
      repositories: ['https://github.com/superseed-xyz'],
      socialMedia: [
        'https://x.com/SuperseedXYZ',
        'https://discord.com/invite/vjDDB5S4BN',
        'https://mirror.xyz/superseedxyz.eth',
        'https://t.me/superseedtelegram',
      ],
    },
  },
  isNodeAvailable: 'UnderReview',
  chainConfig: {
    name: 'superseed',
    chainId: 5330,
    // coingeckoPlatform: 'none',
    sinceTimestamp: genesisTimestamp,
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.superseed.xyz/',
        callsPerMinute: 1500,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
  discovery,
  genesisTimestamp,
  milestones: [
    {
      title: 'Superseed Mainnet Launch',
      url: 'https://x.com/SuperseedXYZ/status/1906710602506195433',
      date: '2025-03-31T00:00:00Z',
      description: 'Superseed Mainnet is now live.',
      type: 'general',
    },
  ],
})
