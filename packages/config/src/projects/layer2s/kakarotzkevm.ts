import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const kakarotzkevm: Layer2 = upcomingL2({
  id: 'kakarotzkevm',
  createdAt: '2024-04-12T17:30:35',
  display: {
    name: 'Kakarot zkEVM',
    slug: 'kakarotzkevm',
    description:
      'Kakarot is an EVM-compatible ZK Rollup that leverages Cairo to spearhead innovations on Ethereum.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://kakarot.org/'],
      apps: [],
      documentation: ['https://docs.kakarot.org/'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/KakarotZkEvm',
        'https://t.me/KakarotZkEvm',
        'https://discord.gg/kakarotzkevm',
      ],
    },
  },
})
