import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const arcology: ScalingProject = upcomingL2({
  id: 'arcology',
  addedAt: UnixTime(1719931771), // 2024-07-02T14:49:31Z
  capability: 'universal',
  display: {
    name: 'Arcology Network',
    slug: 'arcology',
    description:
      'Powered by its parallel execution engine with STM (Software Transactional Memory) based concurrency control, Arcology Network is the first Rollup to process transactions fully in parallel. With EVM equivalence and horizontal scaling, it’s perfect for developers building high-performance, resource-intensive decentralized apps.',
    purposes: ['Universal'],
    links: {
      websites: ['https://arcology.network/'],
      documentation: ['https://doc.arcology.network/main'],
      repositories: ['https://github.com/arcology-network'],
      socialMedia: [
        'https://twitter.com/ArcologyN',
        'https://chatgpt.com/g/g-lkeB0ZG52-solidity-concurrent-programming-gpt',
      ],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
