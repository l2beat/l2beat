import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const specular: ScalingProject = upcomingL2({
  id: 'specular',
  capability: 'universal',
  addedAt: UnixTime(1704292936), // 2024-01-03T14:42:16Z
  display: {
    name: 'Specular',
    slug: 'specular',
    description:
      'Specular is an EVM-native optimistic rollup designed to scale Ethereum securely, with minimal additional trust assumptions.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://specular.network/'],
      documentation: ['https://docs.specular.network/overview/welcome'],
      explorers: ['https://explorer.specular.network/'],
      repositories: ['https://github.com/fabriqnetwork/specular'],
      socialMedia: ['https://twitter.com/SpecularL2'],
    },
  },
})
