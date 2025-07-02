import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { underReviewL2 } from '../../templates/underReview'

const discovery = new ProjectDiscovery('katana')

export const katana: ScalingProject = underReviewL2({
  id: ProjectId('katana'),
  capability: 'universal',
  addedAt: UnixTime(1749119953),
  display: {
    name: 'Katana',
    slug: 'katana',
    description:
      'Katana is a Layer 2 specializing on DeFi. Its unique architecture combines an OP stack base with Agglayer shared bridge interoperability and OP-Succinct SP1 validity proofs.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    stack: 'Agglayer CDK',
    links: {
      websites: ['https://katana.network/'],
      bridges: [
        'https://app.katana.network/krates?p=deposit',
        'https://app.turtle.club/campaigns/katana',
      ],
      explorers: ['https://explorer.katanarpc.com'],
      socialMedia: [
        'https://x.com/katana',
        'https://discord.com/invite/KatanaNetwork',
      ],
    },
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  chainConfig: {
    name: 'katana',
    chainId: 747474,
    explorerUrl: 'https://explorer.katanarpc.com',
    sinceTimestamp: UnixTime(1746742811),
    apis: [
      { type: 'rpc', url: 'https://rpc.katana.network', callsPerMinute: 1500 },
      { type: 'blockscout', url: 'https://explorer.katanarpc.com/api' },
    ],
  },
  escrows: [],
  discoveryInfo: getDiscoveryInfo([discovery]),
})
