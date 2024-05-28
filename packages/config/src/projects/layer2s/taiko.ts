import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const taiko: Layer2 = underReviewL2({
  id: 'taiko',
  display: {
    name: 'Taiko',
    slug: 'taiko',
    description:
      'Taiko is a decentralized, Ethereum-equivalent ZK Rollup that has been developed on the Ethereum network. At present, Taiko is deployed on the Sepolia testnet for further testing and optimization.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://taiko.xyz'],
      apps: ['https://bridge.hekla.taiko.xyz/'],
      documentation: ['https://docs.taiko.xyz/'],
      explorers: ['https://hekla.taikoscan.network/'],
      repositories: ['https://github.com/taikoxyz'],
      socialMedia: [
        'https://twitter.com/taikoxyz',
        'https://discord.gg/taikoxyz',
        'https://taiko.mirror.xyz',
      ],
      rollupCodes: 'https://rollup.codes/taiko',
    },
  },
  escrows: [
    {
      address: EthereumAddress('0xd60247c6848B7Ca29eDdF63AA924E53dB6Ddd8EC'),
      sinceTimestamp: new UnixTime(1714550603),
      tokens: '*',
    },
  ],
})
