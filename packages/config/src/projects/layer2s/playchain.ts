import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const playchain: Layer2 = upcomingL2({
  id: 'playchain',
  display: {
    name: 'PlayChain',
    slug: 'playchain',
    description:
      'PlayChain is a Layer 2 solution built on the ZK Stack leveraging zkEVM. It serves as a Hyperchain allowing anyone to build gaming apps (gApps) on top of their favourite AAA games.',
    purposes: ['Gaming', 'Universal'],
    category: 'ZK Rollup',
    provider: 'ZK Stack',
    links: {
      websites: ['https://playfi.ai/'],
      apps: [],
      documentation: ['https://docs.playfi.ai/'],
      explorers: ['https://albireo-explorer.playfi.ai/'],
      repositories: ['https://github.com/playFi-Labs'],
      socialMedia: [
        'https://twitter.com/PlayFiGaming',
        'https://warpcast.com/playfi',
      ],
    },
  },
})
