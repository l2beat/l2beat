import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const t1: Layer2 = upcomingL2({
  id: 't1',
  capability: 'universal',
  addedAt: new UnixTime(1729678881), // 2024-10-23T12:21:33
  display: {
    name: 't1',
    slug: 't1',
    description:
      'T1 is an upcoming Layer 2 focused on low latency proving and cross-chain interoperability to create composable scalability on Ethereum.',
    purposes: ['Universal', 'Interoperability'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://t1protocol.com'],
      repositories: ['https://github.com/t1protocol'],
      socialMedia: [
        'https://x.com/t1protocol',
        'https://discord.com/invite/nbvyXZHgke',
      ],
    },
  },
})
