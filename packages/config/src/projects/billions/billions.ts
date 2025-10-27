import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const billions: ScalingProject = upcomingL2({
  id: 'billions',
  capability: 'universal',
  addedAt: UnixTime(1757948433), // 2025-09-15T15:00:20Z
  display: {
    name: 'Billions',
    slug: 'billions',
    description:
      'Billions is a network, built on mobile-first verification to scale the internet of value. It aims to verifiy the identity and uniqueness of humans and AI agents, empowering users with personalized experiences and rewards.',
    purposes: ['Universal'],
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://billions.network/'],
      bridges: [],
      socialMedia: ['https://x.com/billions_ntwk'],
      repositories: ['https://github.com/0xPolygonID'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  proofSystem: {
    type: 'Validity',
  },
})
