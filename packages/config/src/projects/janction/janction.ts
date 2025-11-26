import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const janction: ScalingProject = upcomingL2({
  id: 'janction',
  capability: 'universal',
  addedAt: UnixTime(1763561938),
  display: {
    name: 'Janction',
    slug: 'janction',
    description:
      'Janction is aiming to become the first Layer 2 to provide verifiable, synergic and scalable AI services.',
    purposes: ['AI'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://janction.ai'],
      repositories: ['https://github.com/Janction-R-D'],
      documentation: ['https://docs.janction.ai/'],
      explorers: ['https://jctscan.com/'],
      socialMedia: [
        'https://t.me/jasmyofficial',
        'https://x.com/JANCTION_Global',
      ],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
