import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const gameswift: ScalingProject = upcomingL2({
  id: 'gameswift',
  capability: 'universal',
  addedAt: UnixTime(1740488671),
  display: {
    name: 'GameSwift',
    slug: 'gameswift',
    description:
      'GameSwift Modular Chain is a Layer 2 solution built using the OP Stack. The GameSwift Modular Chain focuses on gaming, tailored to meet the specific needs and challenges of game developers.',
    purposes: ['Gaming'],
    category: 'Optimistic Rollup',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://gameswift.io/'],
      bridges: ['https://platform.gameswift.io/games'],
      documentation: ['https://docs.gameswift.io/'],
      explorers: ['https://testnet.gameswift.io/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/GameSwift_io',
        'https://discord.com/invite/gameswift',
        'https://youtube.com/@gameswiftofficial',
        'https://t.me/gameswift_io',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
})
