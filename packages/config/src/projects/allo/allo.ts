import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const allo: ScalingProject = upcomingL2({
  id: 'allo',
  capability: 'universal',
  addedAt: UnixTime(1728665516),
  display: {
    name: 'Allo',
    slug: 'allo',
    description:
      'Allo is an OP Stack L2 which will be a part of Superchain. It is used to tokenize Real World Assets seamlessly - unlocking reduced transaction times and lower costs.',
    purposes: ['RWA'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://allo.xyz'],
      bridges: ['https://app.allo.xyz/'],
      documentation: ['https://docs.allo.xyz'],
      socialMedia: [
        'https://x.com/allo_xyz',
        'https://discord.gg/allo',
        'https://t.me/allo_xyz',
        'https://linkedin.com/company/alloxyz/',
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
