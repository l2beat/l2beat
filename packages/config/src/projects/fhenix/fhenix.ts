import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const fhenix: ScalingProject = upcomingL2({
  id: 'fhenix',
  capability: 'universal',
  hasTestnet: true,
  addedAt: UnixTime(1719225560), // 2024-06-24T10:39:20Z
  display: {
    name: 'Fhenix',
    slug: 'fhenix',
    description:
      'Fhenix is Fully Homomorphic Encryption rollup, built on top of Arbitrum Stack.',
    purposes: ['Universal'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://fhenix.io/'],
      bridges: ['https://bridge.helium.fhenix.zone'],
      documentation: ['https://cofhe-docs.fhenix.zone/'],
      repositories: ['https://github.com/orgs/FhenixProtocol/'],
      socialMedia: [
        'https://x.com/FhenixIO',
        'https://discord.com/invite/FuVgxrvJMY',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
