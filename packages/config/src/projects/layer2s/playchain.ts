import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const playchain: Layer2 = upcomingL2({
  id: 'playchain',
  capability: 'universal',
  addedAt: new UnixTime(1715161986), // 2024-05-08T09:53:06Z
  display: {
    name: 'PlayChain',
    slug: 'playchain',
    description:
      'PlayChain is a Layer 2 solution built on the ZK Stack leveraging zkEVM in Validium mode. It serves as a Hyperchain allowing anyone to build gaming apps (gApps) on top of their favourite AAA games.',
    purposes: ['Gaming', 'Universal'],
    category: 'Validium',
    stack: 'ZK Stack',
    links: {
      websites: ['https://playfi.ai/'],
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
