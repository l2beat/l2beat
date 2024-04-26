import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const hychain: Layer2 = underReviewL2({
  id: 'hychain',
  display: {
    name: 'HYCHAIN',
    slug: 'hychain',
    description:
      'HYCHAIN is a gaming-focused AnyTrust Optimium that was created to eliminate onboarding and technical challenges for web3 games aiming for widespread adoption.',
    purposes: ['Gaming', 'NFT'],
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://hychain.com'],
      apps: ['https://bridge.hychain.com'],
      documentation: ['https://docs.hychain.com'],
      explorers: ['https://explorer.hychain.com'],
      repositories: ['https://github.com/kintoxyz'],
      socialMedia: [
        'https://twitter.com/HYCHAIN_GAMES',
        'https://discord.gg/hytopiagg',
        'https://hychain.substack.com/',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  // rpcUrl: 'https://rpc.hychain.com/http',
  escrows: [
    // bridge is only for TOPIA token
    {
      address: EthereumAddress('0x73C6af7029E714DFf1F1554F88b79B335011Da68'),
      sinceTimestamp: new UnixTime(1701972000),
      tokens: '*',
    },
  ],
})
