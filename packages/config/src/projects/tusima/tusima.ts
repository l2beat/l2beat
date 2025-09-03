import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const tusima: ScalingProject = upcomingL2({
  id: 'tusima',
  capability: 'universal',
  addedAt: UnixTime(1738142567), // 2025-01-29T15:22:47Z
  display: {
    name: 'Tusima',
    slug: 'tusima',
    description:
      'Tusima is an infrastructure that bridges Web3.0 and real-world business. It aims to be a consumer payment network for any asset.',
    purposes: ['Universal', 'Payments'],
    links: {
      websites: ['https://tusima.network/'],
      bridges: ['https://tusima.network/Galactic/Withdraw'],
      documentation: ['https://docs.tusima.network/'],
      explorers: [],
      repositories: ['https://github.com/TusimaNetwork'],
      socialMedia: [
        'https://x.com/TusimaNetwork',
        'https://t.me/tusimaofficial',
        'https://discord.com/invite/yB3SWxTRej',
        'https://medium.com/@TusimaNetwork',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
})
