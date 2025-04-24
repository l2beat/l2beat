import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const spire: ScalingProject = upcomingL2({
  id: 'spire',
  addedAt: UnixTime(1745421141), // '2025-04-23T17:12:38Z'
  capability: 'universal',
  display: {
    name: 'Spire',
    slug: 'spire',
    description:
      'Spire is an upcoming appchain stack, focused on scaling Ethereum while maintaining close integration and alignment with L1.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://spire.dev/'],
      documentation: ['https://docs.spire.dev/'],
      repositories: ['https://github.com/spire-labs'],
      socialMedia: ['https://x.com/Spire_Labs', 'https://paragraph.com/@spire'],
    },
  },
})
