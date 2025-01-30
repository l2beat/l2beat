import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const thanos: Layer2 = upcomingL2({
  id: 'thanos',
  capability: 'universal',
  addedAt: new UnixTime(1726844759), // 2024-09-20T15:05:59Z
  display: {
    name: 'THANOS',
    slug: 'thanos',
    description:
      'Thanos is an upcoming Optimistic Rollup. By utilizing its native token within the L2 network, it aims to enable the creation of tailored Layer 2 environments where the token is used for transactions, offering a more efficient and cost-effective blockchain experience.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://tokamak.network/'],
      documentation: ['https://docs.tokamak.network/'],
      explorers: ['https://explorer.thanos-sepolia.tokamak.network/'],
      repositories: ['https://github.com/tokamak-network/tokamak-thanos'],
      socialMedia: [
        'https://t.me/tokamak_network',
        'https://discord.gg/FuwksZQQ7r',
        'https://twitter.com/Tokamak_Network',
        'https://medium.com/tokamak-network',
      ],
    },
  },
})
