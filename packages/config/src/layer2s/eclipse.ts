import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const eclipse: Layer2 = upcoming({
  id: 'eclipse',
  display: {
    name: 'Eclipse',
    slug: 'eclipse',
    description:
      'Eclipse is a Layer 2 powered by the Solana Virtual Machine (SVM).',
    purpose: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://eclipse.builders/'],
      apps: ['https://bridge.eclipse.builders/'],
      documentation: ['https://docs.eclipse.builders/'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/eclipsefnd',
        'https://discord.gg/eclipse-labs',
        'https://eclipsemainnet.mirror.xyz/',
      ],
    },
  },
})
