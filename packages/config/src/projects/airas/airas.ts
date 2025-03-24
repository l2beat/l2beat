import { UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const airas: ScalingProject = underReviewL2({
  id: 'airas',
  capability: 'universal',
  addedAt: UnixTime(1742829632), //24 March 2025 15:20:32
  badges: [BADGES.VM.EVM, BADGES.RaaS.Zeeve, BADGES.Stack.PolygonCDK],
  display: {
    name: 'AIRAS',
    slug: 'airas',
    description:
      'AIRAS (Artificial Intelligence Real Assets System) is a ZK Rollup designed to power autonomous applications for real-world assets, leveraging AI and blockchain to drive efficiency, transparency, and automation in asset management.',
    purposes: ['RWA'],
    category: 'ZK Rollup',
    stack: 'Polygon',
    links: {
      websites: ['https://airas.com/'],
      apps: ['https://bridge.airas.com'],
      documentation: ['https://airas.gitbook.io/airas'],
      explorers: ['https://explorer.airas.com'],
      repositories: [],
      socialMedia: [
        'https://x.com/airasnetwork',
        'https://discord.gg/Z6KqsfB3',
        'https://t.me/airas_network',
      ],
    },
  },
  chainConfig: {
    gasTokens: ['AIRAS'],
    name: 'airas',
    chainId: 762419583,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.airas.com',
        callsPerMinute: 1500,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
  },
  // no escrow (0x0a3014e1D323517e3895f4db75757f2c7781D0e6) because native token is not on CG
})
