import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const specular: Layer2 = upcomingL2({
  id: 'specular',
  createdAt: new UnixTime(1704292936), // 2024-01-03T14:42:16Z
  display: {
    name: 'Specular',
    slug: 'specular',
    description:
      'Specular is an EVM-native optimistic rollup designed to scale Ethereum securely, with minimal additional trust assumptions.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://specular.network/'],
      apps: [],
      documentation: ['https://docs.specular.network/overview/welcome'],
      explorers: ['https://explorer.specular.network/'],
      repositories: ['https://github.com/fabriqnetwork/specular'],
      socialMedia: ['https://twitter.com/SpecularL2'],
    },
  },
})
