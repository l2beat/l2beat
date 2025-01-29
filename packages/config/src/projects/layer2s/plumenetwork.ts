import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const plumenetwork: Layer2 = upcomingL2({
  id: 'plumenetwork',
  capability: 'universal',
  addedAt: new UnixTime(1719224239), // 2024-06-24T10:17:19Z
  display: {
    name: 'Plume Network',
    slug: 'plumenetwork',
    description:
      'Plume is a modular L2 blockchain dedicated for all real-world assets (RWAs) that integrates asset tokenization and compliance providers directly into the chain.',
    purposes: ['RWA'],
    category: 'Optimistic Rollup',
    stack: 'Arbitrum',
    links: {
      websites: ['https://plumenetwork.xyz/'],
      apps: ['https://miles.plumenetwork.xyz'],
      documentation: ['https://docs.plumenetwork.xyz/plume'],
      explorers: ['https://test-explorer.plumenetwork.xyz'],
      repositories: ['https://github.com/plumenetwork'],
      socialMedia: [
        'https://twitter.com/plumenetwork',
        'https://discord.gg/plume',
        'https://t.me/plumenetwork_community',
      ],
    },
  },
})
