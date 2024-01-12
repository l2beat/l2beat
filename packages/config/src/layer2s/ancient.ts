import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const ancient: Layer2 = upcoming({
  id: 'ancient',
  display: {
    name: 'Ancient8',
    slug: 'ancient',
    description:
      'Ancient8 Chain is a gaming-focused community-driven Ethereum Layer 2 built using OP Stack.',
    purposes: ['Gaming'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://ancient8.gg/'],
      apps: [],
      documentation: ['https://docs.ancient8.gg/'],
      explorers: ['https://testnet.a8scan.io/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/Ancient8_gg',
        'https://discord.gg/ancient8',
        'https://blog.ancient8.gg/',
        'https://t.me/ancient8_gg',
      ],
    },
  },
})
