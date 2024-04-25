import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const metal: Layer2 = underReviewL2({
  id: 'metal',
  display: {
    category: 'Optimistic Rollup',
    name: 'Metal',
    slug: 'metal',
    description:
      'Metal L2 is an OP stack rollup by Metallicus focused on banking and compliance.',
    purposes: ['Universal'],
    links: {
      websites: ['https://metall2.com/'],
      apps: [
        'https://bridge.metall2.com/',
        'https://dollar.metalx.com/',
        'https://metalpay.com/',
      ],
      documentation: [],
      explorers: ['https://explorer.metall2.com'],
      repositories: [],
      socialMedia: ['https://twitter.com/metalpaysme'],
    },
  },
  escrows: [
    {
      address: EthereumAddress('0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3'),
      sinceTimestamp: new UnixTime(1711057199),
      tokens: '*',
    },
    {
      address: EthereumAddress('0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956'),
      sinceTimestamp: new UnixTime(1711057199),
      tokens: ['ETH'],
    },
  ],
})
