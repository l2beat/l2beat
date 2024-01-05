import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const frame: Layer2 = upcoming({
  id: 'frame',
  display: {
    name: 'Frame',
    slug: 'frame',
    description:
      'Frame is an Ethereum L2 designed to scale NFT adoption across the Ethereum ecosystem utilizing Arbitrum Nitro technology.',
    purpose: 'Universal, NFT',
    category: 'Optimistic Rollup',
    provider: 'Arbitrum',
    links: {
      websites: ['https://frame.xyz/'],
      apps: [],
      documentation: ['https://docs.frame.xyz/'],
      explorers: ['https://explorer.testnet.frame.xyz/'],
      repositories: ['https://github.com/frame-network'],
      socialMedia: [
        'https://twitter.com/frame_xyz',
        'https://discord.gg/framexyz',
      ],
    },
  },
})
