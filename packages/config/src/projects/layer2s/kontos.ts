import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const kontos: Layer2 = underReviewL2({
  id: 'kontos',
  display: {
    name: 'Kontos',
    slug: 'kontos',
    description:
      'Kontos is a zero-knowledge based layer-2 account protocol. Its architecture enables users to enjoy numerous features, including gas-less transactions, asset-less operations, and key-less with higher security.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://kontos.io/'],
      apps: ['https://wallet.kontos.io/'],
      documentation: ['https://docs.kontos.io/'],
      explorers: ['https://explorer.kontos.io/'],
      repositories: ['https://twitter.com/kontosio'],
      socialMedia: [
        'https://discord.com/invite/zecrey',
        'https://x.com/kontosio',
        'https://t.me/ZecreyAnnouncement',
        'https://kontosio.medium.com/',
      ],
    },
  },
})
