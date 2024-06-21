import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const frame: Layer2 = upcomingL2({
  id: 'plumenetwork',
  display: {
    name: 'Plume Network',
    slug: 'plumenetwork',
    description:
      'Plume is a modular L2 blockchain dedicated for all real-world assets (RWAs) that integrates asset tokenization and compliance providers directly into the chain.',
    purposes: ['RWA'],
    category: 'Optimistic Rollup',
    provider: 'Arbitrum',
    links: {
      websites: ['https://www.plumenetwork.xyz/'],
      apps: [],
      documentation: ['https://docs.plumenetwork.xyz/plume'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'http://twitter.com/plumenetwork',
        'https://discord.gg/plume',
        'https://t.me/plumenetwork_community',
      ],
    },
  },
})
