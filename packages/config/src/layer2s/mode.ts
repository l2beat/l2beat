import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const mode: Layer2 = upcoming({
  id: 'mode',
  display: {
    name: 'Mode Network',
    slug: 'mode',
    description:
      'Mode is the Ethereum L2 designed for builders and users to grow as the network grows.',
    purpose: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://mode.network/'],
      apps: [],
      documentation: ['https://docs.mode.network/'],
      explorers: ['https://sepolia.explorer.mode.network/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/modenetwork',
        'https://discord.gg/modenetworkofficial',
        'https://mode.mirror.xyz/',
        'https://t.me/ModeNetworkOfficial',
      ],
    },
  },
})
