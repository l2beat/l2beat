import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const astarzkevm: Layer2 = upcoming({
  id: 'astarzkevm',
  display: {
    name: 'Astar zkEVM',
    slug: 'astarzkevm',
    description:
      "Astar zkEVM is an Ethereum Layer 2 solution that leverages Polygon's CDK and zero-knowledge cryptography to enable off-chain transactions while maintaining EVM equivalence.",
    purposes: ['Universal'],
    category: 'ZK Rollup',
    provider: 'Polygon',
    headerWarning:
      'Astar zkEVM is using AggLayer, meaning it shares the TVL escrow contracts with Polygon zkEVM and other connected chains. For now, you can check its TVL [here](https://dune.com/hashed_official/astar-zkevm). We have not verified it so proceed with caution.',
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
