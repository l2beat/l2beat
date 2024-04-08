import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const mint: Layer2 = upcomingL2({
  id: 'mint',
  display: {
    name: 'Mint',
    slug: 'mint',
    description: 'Mint Blockchain is a Layer 2 network for NFTs.',
    purposes: ['Universal', 'NFT'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://mintchain.io/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/Mint_Blockchain',
        'https://discord.gg/mint-blockchain',
      ],
    },
  },
})
