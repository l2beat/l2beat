import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const hypr: Layer2 = upcoming({
  id: 'hypr',
  display: {
    name: 'Hypr',
    slug: 'hypr',
    description: 'Hypr is a Layer 2 blockchain, focused on scaling ZK gaming.',
    purpose: ['Universal'],
    category: 'ZK Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://hypr.network/'],
      apps: ['https://hypr.network/applications'],
      documentation: ['https://docs.hypr.network'],
      explorers: ['https://explorer.hypr.network/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/hypr_network',
        'https://t.me/hyprnetwork',
      ],
    },
  },
})
