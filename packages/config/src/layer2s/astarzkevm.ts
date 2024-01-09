import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const astarzkevm: Layer2 = upcoming({
  id: 'astarzkevm',
  display: {
    name: 'Astar zkEVM',
    slug: 'astarzkevm',
    description:
      "Astar zkEVM is an Ethereum Layer 2 solution that leverages Polygon's CDK and zero-knowledge cryptography to enable off-chain transactions while maintaining EVM equivalence.",
    purpose: 'Universal',
    category: 'ZK Rollup',
    provider: 'Polygon',
    links: {
      websites: ['https://astar.network/astar2'],
      apps: [],
      documentation: ['https://docs.astar.network/docs/build/zkEVM/'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/AstarNetwork',
        'https://twitter.com/AstarzkEVM',
      ],
    },
  },
})
