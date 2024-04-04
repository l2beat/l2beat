import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const ten: Layer2 = upcomingL2({
  id: 'ten',
  display: {
    name: 'Ten',
    slug: 'ten',
    description:
      'Ten is an Encrypted Rollup that has been designed for use on the Ethereum network and uses 100% of the EVM. At present, Ten is available in testnet running on the Sepolia testnet for further testing and optimization.',
    purposes: ['Universal', 'Privacy'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://ten.xyz'],
      apps: [],
      documentation: [
        'https://docs.ten.xyz',
        'https://ten.xyz/litepaper',
        'https://whitepaper.ten.xyz',
      ],
      explorers: ['https://testnet.tenscan.io'],
      repositories: [
        'https://github.com/ten-protocol',
        'https://github.com/ten-protocol/go-ten',
        'https://github.com/ten-protocol/tutorial',
        'https://github.com/ten-protocol/sample-applications',
      ],
      socialMedia: [
        'https://twitter.com/tenprotocol',
        'https://discord.gg/yQfmKeNzNd',
        'https://t.me/tenprotocol',
        'https://medium.com/obscuro-labs',
      ],
    },
  },
})
