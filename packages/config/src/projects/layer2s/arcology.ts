import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const arcology: Layer2 = upcomingL2({
  id: 'arcology',
  addedAt: new UnixTime(1719931771), // 2024-07-02T14:49:31Z
  capability: 'universal',
  display: {
    name: 'Arcology Network',
    slug: 'arcology',
    description:
      'Powered by its parallel execution engine with STM (Software Transactional Memory) based concurrency control, Arcology Network is the first Rollup to process transactions fully in parallel. With EVM equivalence and horizontal scaling, it’s perfect for developers building high-performance, resource-intensive decentralized apps.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
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
})
