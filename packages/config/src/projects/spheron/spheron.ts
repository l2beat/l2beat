import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const spheron: ScalingProject = upcomingL3({
  id: 'spheron',
  capability: 'universal',
  addedAt: UnixTime(1738898515), // 2025-02-05T14:15:15Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Spheron',
    slug: 'spheron',
    description:
      'Spheron is a decentralized platform designed to harness compute resources across the globe.',
    purposes: ['AI'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://spheron.network/'],
      documentation: ['https://docs.spheron.network/'],
      repositories: ['https://github.com/spheronFdn'],
      bridges: [],
      socialMedia: [
        'https://x.com/SpheronFDN',
        'https://t.me/Spheron',
        'https://youtube.com/@spheronfdn',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
