import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const memento: ScalingProject = upcomingL2({
  id: 'memento',
  capability: 'universal',
  addedAt: UnixTime(1730879100), // 2024-11-6T07:45:00Z
  display: {
    name: 'Memento ZK Chain',
    slug: 'memento',
    description:
      'Memento ZKchain is a ZK Rollup dedicated to institutional DeFi and digital asset management, providing a secure, permissioned environment for digital investment funds and asset distribution.',
    purposes: ['Interoperability', 'Privacy', 'RWA'],
    category: 'ZK Rollup',
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://mementoblockchain.com/'],
      socialMedia: [
        'https://x.com/Memento_Bc',
        'https://linkedin.com/company/memento-blockchain/',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
})
