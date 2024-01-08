import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const kinto: Layer2 = upcoming({
  id: 'kinto',
  display: {
    name: 'Kinto',
    slug: 'kinto',
    description:
      'Kinto is the first KYCed Layer 2 capable of supporting both modern financial institutions and decentralized protocols.',
    purpose: 'DeFi',
    category: 'Optimistic Rollup',
    provider: 'Arbitrum',
    links: {
      websites: ['https://kinto.xyz'],
      apps: [],
      documentation: ['https://docs.kinto.xyz'],
      explorers: ['https://test-explorer.kinto.xyz/'],
      repositories: ['https://github.com/kintoxyz'],
      socialMedia: [
        'https://twitter.com/kintoxyz',
        'https://discord.gg/utEYFxKFgB',
        'https://mirror.xyz/kintoxyz.eth',
      ],
    },
  },
})
