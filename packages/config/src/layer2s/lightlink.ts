import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const lightlink: Layer2 = underReviewL2({
  id: 'lightlink',
  display: {
    name: 'LightLink',
    slug: 'lightlink',
    description:
      'LightLink is an Ethereum Layer 2 blockchain based on a proprietary stack that lets dApps and enterprises offer users instant, gasless transactions.',
    purposes: ['Universal'],
    category: 'Optimium',
    links: {
      websites: ['https://lightlink.io'],
      apps: ['https://phoenix.lightlink.io/apps'],
      documentation: ['https://docs.lightlink.io'],
      explorers: ['https://phoenix.lightlink.io'],
      repositories: ['https://github.com/lightlink-network'],
      socialMedia: [
        'https://twitter.com/lightlinkchain',
        'https://discord.com/invite/lightlinkchain',
        'https://t.me/lightlinkll',
        'https://linkedin.com/company/lightlinkchain',
      ],
    },
  },
  escrows: [
    {
      address: EthereumAddress('0x3ca373F5ecB92ac762f9876f6e773082A4589995'),
      sinceTimestamp: new UnixTime(1692155207),
      tokens: ['ETH'],
    },
    {
      address: EthereumAddress('0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9'),
      sinceTimestamp: new UnixTime(1692155531),
      tokens: '*',
    },
  ],
})
