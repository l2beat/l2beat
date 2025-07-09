import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const fhenix: ScalingProject = upcomingL2({
  id: 'fhenix',
  capability: 'universal',
  addedAt: UnixTime(1719225560), // 2024-06-24T10:39:20Z
  display: {
    name: 'Fhenix',
    slug: 'fhenix',
    description:
      'Fhenix is Fully Homomorphic Encryption rollup, build on top of Arbitrum Stack.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://fhenix.io/'],
      documentation: [
        'https://fhenix.io/fhe-rollups-scaling-confidential-smart-contracts-on-ethereum-and-beyond-whitepaper/',
      ],
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
})
