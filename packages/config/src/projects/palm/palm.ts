import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const palm: ScalingProject = upcomingL2({
  id: 'palm',
  capability: 'universal',
  addedAt: UnixTime(1692958606), // 2023-08-25T10:16:46Z
  display: {
    name: 'Palm',
    slug: 'palm',
    description:
      'The Palm Network is the L2 for Sports, Culture and Entertainment.',
    purposes: ['NFT'],
    category: 'Validium',
    stack: 'Polygon',
    links: {
      websites: ['https://palm.network/'],
      apps: ['https://app.palm.io/bridge'],
      documentation: ['https://docs.palm.io/'],
      explorers: ['https://ondora.xyz/network/palm'],
      socialMedia: [
        'https://x.com/buildOnPalm',
        'https://instagram.com/palm_network/',
        'https://t.me/PalmDAO_Community',
        'https://linkedin.com/company/92910058/',
      ],
    },
  },
})
