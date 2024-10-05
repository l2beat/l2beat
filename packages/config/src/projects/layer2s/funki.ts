import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const funki: Layer2 = upcomingL2({
  id: 'funki',
  display: {
    name: 'Funki',
    slug: 'funki',
    description:
      'Funki chain is an L2 Ethereum Rollup Network, powered by the OP Stack.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://funkichain.com'],
      apps: ['https://funkichain.com/bridge', 'https://swap.funkichain.com'],
      documentation: ['https://docs.funkichain.com/'],
      explorers: [],
      repositories: ['https://github.com/funkichain'],
      socialMedia: [
        'https://x.com/funkichain',
        'https://facebook.com/funkichain',
        'https://instagram.com/funkichain',
        'https://t.me/funkichain',
      ],
    },
  },
})