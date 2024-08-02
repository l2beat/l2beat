import { upcomingL3 } from '../layer2s/templates/upcoming'
import { Layer3 } from './types'

export const unite: Layer3 = upcomingL3({
  id: 'unite',
  hostChain: 'base',
  display: {
    name: 'Unite',
    slug: 'unite',
    description:
      'Unite Blockchain is a revolutionary Layer 3 (L3) EVM-compatible blockchain, designed to transform the landscape of mobile web3 gaming. It is First L3 blockchain solution for Mass-Market Mobile Games.',
    purposes: ['Gaming'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      documentation: [
        'https://unite-1.gitbook.io/unite-docs',
      ],
      repositories: [],
      socialMedia: ['https://x.com/uniteio','https://discord.gg/vk7g2eQvru'],
      websites: ['https://www.unite.io/'],
      apps: [],
      explorers: [],
    },
  },
})
