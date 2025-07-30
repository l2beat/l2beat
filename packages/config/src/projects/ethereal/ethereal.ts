import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const ethereal: ScalingProject = upcomingL3({
  id: 'ethereal',
  capability: 'universal',
  addedAt: UnixTime(1753781100),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Ethereal',
    slug: 'ethereal',
    description:
      'Ethereal is a decentralized exchange offering institutional-grade performance (sub-20 ms latency, ~1M orders per second) with DeFi-enabled self-custody and security guarantees.',
    purposes: ['Exchange'],
    category: 'Optimistic Rollup',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://ethereal.trade'],
      explorers: ['https://explorer.etherealtest.net/'],
      documentation: ['https://docs.ethereal.trade/'],
      socialMedia: [
        'https://discord.com/invite/etherealdex',
        'https://x.com/etherealdex',
        'https://mirror.xyz/0x71331A0991C312fcCF766c3Ca8F7a11c4f5F756B',
      ],
    },
  },
})
