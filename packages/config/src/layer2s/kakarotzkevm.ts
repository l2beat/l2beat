import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const kakarotzkevm: Layer2 = upcomingL2({
  id: 'kakarotzkevm',
  display: {
    name: 'Kakarot zkEVM',
    slug: 'kakarotzkevm',
    description:
      'Kakarot zkEVM is an EVM-Compatible Zk Rollup written in Cairo.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://www.kakarot.org/'],
      apps: [],
      documentation: ['https://docs.kakarot.org/'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/KakarotZkEvm',
        'https://t.me/KakarotZkEvm',
        'https://discord.gg/x53uKnGA',
      ],
    },
  },
})