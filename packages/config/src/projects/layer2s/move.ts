import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const move: Layer2 = upcomingL2({
  id: 'move',
  createdAt: new UnixTime(1717924525), // 2024-06-09T09:15:25Z
  display: {
    name: 'M2',
    slug: 'move',
    description:
      'M2 is an upcoming L2 featuring a VM compatible with Move and the EVM (MEVM), using Celestia for data availability.',
    purposes: ['Universal'],
    category: 'Validium',
    links: {
      websites: ['https://movementlabs.xyz'],
      apps: [],
      documentation: ['https://docs.movementlabs.xyz/'],
      explorers: ['https://explorer.movementlabs.xyz/#/?network=local'],
      repositories: [],
      socialMedia: [
        'https://x.com/movementlabsxyz',
        'https://t.me/movementlabsxyz',
        'https://discord.com/invite/movementlabsxyz',
      ],
    },
  },
})
