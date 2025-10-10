import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const zentachain: ScalingProject = upcomingL2({
  id: 'zentachain',
  capability: 'universal',
  addedAt: UnixTime(1706277671), // 2024-01-26T14:01:11Z
  display: {
    name: 'Zentachain',
    slug: 'zentachain',
    description:
      'Zentachain is a privacy-focused IoT blockchain networking project that is focused on communication and data storage. Innovative and useful solutions are provided for issues of security and data ownership.',
    purposes: ['Universal', 'Privacy'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://zentachain.io/'],
      bridges: [],
      documentation: ['https://docs.zentachain.io/'],
      explorers: [],
      repositories: ['https://github.com/ZentaChain'],
      socialMedia: [
        'https://twitter.com/zentachain',
        'https://discord.com/invite/wbzS8Ve6wW',
        'https://zentachain.blog/',
        'https://t.me/ZentachainOfficialChat',
        'https://reddit.com/r/Zentachain/',
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
