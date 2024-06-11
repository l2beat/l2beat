import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const move: Layer2 = upcomingL2({
  id: 'move',
  display: {
    name: 'Move',
    slug: 'move',
    description:
      'M2 is the first MoveVM L2 leveraging Celestia for Data Availability.',
    purposes: ['Universal'],
    category: 'Optimium',
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
