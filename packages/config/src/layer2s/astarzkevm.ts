import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const astarzkevm: Layer2 = underReviewL2({
  id: 'astarzkevm',
  display: {
    name: 'Astar zkEVM',
    slug: 'astarzkevm',
    description:
      "Astar zkEVM is a Validium that leverages Polygon's CDK and zero-knowledge cryptography to enable off-chain transactions while maintaining EVM equivalence.",
    purposes: ['Universal'],
    category: 'Validium',
    provider: 'Polygon',
    headerWarning:
      'Astar zkEVM is using AggLayer, meaning it shares the TVL escrow contracts with Polygon zkEVM and other connected chains. For now, you can check its TVL [here](https://dune.com/hashed_official/astar-zkevm). We have not verified it so proceed with caution.',
    links: {
      websites: ['https://astar.network/astar2'],
      apps: [],
      documentation: ['https://docs.astar.network/docs/build/zkEVM/'],
      explorers: ['https://astar-zkevm.explorer.startale.com/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/AstarNetwork',
        'https://discord.com/invite/astarnetwork',
        'https://youtube.com/@AstarNetwork',
        'https://t.me/PlasmOfficial',
      ],
    },
  },
  escrows: [],
})
