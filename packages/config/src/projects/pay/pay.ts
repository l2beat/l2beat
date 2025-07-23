import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const pay: ScalingProject = upcomingL2({
  id: 'pay',
  capability: 'universal',
  addedAt: UnixTime(1742821879), // 24 March 2025 13:11
  badges: [BADGES.VM.EVM, BADGES.RaaS.Zeeve],
  display: {
    name: 'Pay',
    slug: 'pay',
    description:
      'Pay is a zkEVM blockchain by Wirex, powered by the Polygon CDK stack. It aims to be a decentralized payments network.',
    purposes: ['Payments'],
    category: 'ZK Rollup',
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://wirexpaychain.com/'],
      documentation: [],
      explorers: [],
      socialMedia: ['https://x.com/wirexpaychain'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
})
