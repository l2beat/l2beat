import { ProjectId } from '@l2beat/shared-pure'

import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const orb3: Layer3 = underReviewL3({
  id: 'orb3',
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'ORB3',
    slug: 'orb3',
    category: 'Optimium',
    description:
      'ORB3 is a GameFi-focused Ethereum L3 leveraging Arbitrum AnyTrust.',
    purposes: ['Gaming', 'NFT', 'DeFi', 'Social'],
    provider: 'Arbitrum Orbit',
    links: {
      websites: ['https://orb3.tech/'],
      apps: [
        'https://hub.orb3.tech/bridge?chain=eth',
        'https://bridge.orb3.tech/',
      ],
      documentation: ['https://docs.orb3.tech/'],
      explorers: ['https://orb3scan.tech/'],
      repositories: ['https://github.com/orb3-protocol'],
      socialMedia: [
        'https://twitter.com/Orb3Tech',
        'https://discord.gg/PmWGn2UmdJ',
        'https://t.me/orb3portal',
        'https://mirror.xyz/0xCC98fAeE2309c7424cFE5995741b96BE61c9253f',
      ],
    },
  },
})
