import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const immutablezkevm: Layer2 = upcoming({
  id: 'immutablezkevm',
  display: {
    name: 'Immutable zkEVM',
    slug: 'immutablezkevm',
    description:
      "Immutable zkEVM is an upcoming ZK Rollup focused on gaming and powered by Polygon's CDK.",
    purposes: ['Universal', 'Gaming'],
    category: 'ZK Rollup',
    provider: 'Polygon',
    links: {
      websites: ['https://immutable.com/products/immutable-zkevm'],
      apps: [],
      documentation: ['https://docs.x.immutable.com/docs/zkEVM/overview'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/Immutable'],
    },
  },
})
