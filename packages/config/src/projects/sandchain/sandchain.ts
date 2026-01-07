import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const sandchain: ScalingProject = upcomingL2({
  id: 'sandchain',
  capability: 'universal',
  addedAt: UnixTime(1763446757),
  display: {
    name: 'SANDchain',
    slug: 'sandchain',
    description:
      'SANDchain is a dedicated Layer 2 network designed to empower creators and their communities by providing a financial backbone for the Creator Nation.',
    purposes: ['Universal'],
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://sandchain.com/'],
      bridges: ['https://sandchain-bridge.caldera.xyz/'],
      documentation: ['https://sandchain.gitbook.io/'],
      explorers: ['https://sandchain-explorer.caldera.xyz/'],
      socialMedia: [
        'https://x.com/0xSANDchain',
        'https://discord.gg/pjhTJh6CSn',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
})
