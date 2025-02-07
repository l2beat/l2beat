import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { upcomingL3 } from '../layer2s/templates/upcoming'

export const spheron: Layer3 = upcomingL3({
  id: 'spheron',
  capability: 'universal',
  addedAt: new UnixTime(1738898515), // 2025-02-05T14:15:15Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Spheron',
    slug: 'spheron',
    description:
      'Spheron is a decentralized platform designed to harness compute resources across the globe.',
    purposes: ['AI'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://spheron.network/'],
      documentation: ['https://docs.spheron.network/'],
      repositories: ['https://github.com/spheronFdn'],
      apps: [],
      socialMedia: [
        'https://x.com/SpheronFDN',
        'https://t.me/Spheron',
        'https://youtube.com/@spheronfdn',
      ],
    },
  },
})
