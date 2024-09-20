import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const thanos: Layer2 = upcomingL2({
  id: 'thanos',
  display: {
    name: 'THANOS',
    slug: 'thanos',
    description:
      'Thanos is an upcoming Optimistic Rollup. By utilizing its native token within the L2 network, it aims to enable the creation of tailored Layer 2 environments where the token is used for transactions, offering a more efficient and cost-effective blockchain experience.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://tokamak.network/'],
      apps: [],
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
