import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const arcology: Layer2 = upcomingL2({
  id: 'arcology',
  display: {
    name: 'Arcology Network',
    slug: 'arcology',
    description:
      'Powered by its parallel execution engine with STM (Software Transactional Memory) based concurrency control, Arcology Network is the first Rollup to process transactions fully in parallel. With EVM equivalence and horizontal scaling, it’s perfect for developers building high-performance, resource-intensive decentralized apps.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'Arcology',
    links: {
      websites: ['https://arcology.network/'],
      apps: [],
      documentation: ['https://doc.arcology.network/main'],
      explorers: [],
      repositories: ['https://github.com/arcology-network'],
      socialMedia: [
        'https://twitter.com/ArcologyN',
        'https://chatgpt.com/g/g-lkeB0ZG52-solidity-concurrent-programming-gpt',
      ],
    },
  },
})
