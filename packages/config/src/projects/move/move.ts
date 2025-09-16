import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const move: ScalingProject = upcomingL2({
  id: 'move',
  capability: 'universal',
  addedAt: UnixTime(1717924525), // 2024-06-09T09:15:25Z
  display: {
    name: 'M2',
    slug: 'move',
    description:
      'M2 is an upcoming L2 featuring a VM compatible with Move and the EVM (MEVM), using Celestia for data availability.',
    purposes: ['Universal'],
    links: {
      websites: ['https://movementlabs.xyz'],
      documentation: ['https://docs.movementlabs.xyz/'],
      explorers: ['https://explorer.movementlabs.xyz/#/?network=local'],
      repositories: ['https://github.com/movementlabsxyz'],
      socialMedia: [
        'https://x.com/movementlabsxyz',
        'https://t.me/movementlabsxyz',
        'https://discord.com/invite/movementlabsxyz',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
})
