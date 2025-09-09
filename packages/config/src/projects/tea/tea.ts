import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const tea: ScalingProject = upcomingL2({
  id: 'tea',
  capability: 'universal',
  hasTestnet: true,
  addedAt: UnixTime(1739629387),
  display: {
    name: 'Tea',
    slug: 'tea',
    description:
      'Tea is an upcoming Layer 2 solution built on the OP Stack. It aims to provide a collaborative space for Web3 builders and users.',
    purposes: ['Universal'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://tea.xyz/sepolia'],
      bridges: [
        'https://tea-assam-fo46m5b966-32f74f2af939fed4.testnets.rollbridge.app',
      ],
      explorers: ['https://sepolia.tea.xyz/'],
      documentation: ['https://docs.tea.xyz/tea'],
      repositories: ['https://github.com/teaxyz'],
      socialMedia: [
        'https://twitter.com/teaprotocol',
        'https://t.me/teaprotocol',
        'https://linkedin.com/company/teaxyz/',
        'https://discord.com/invite/tea-906608167901876256',
        'https://youtube.com/@teaxyz_',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
