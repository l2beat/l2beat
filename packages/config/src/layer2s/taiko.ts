import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const taiko: Layer2 = upcoming({
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
      apps: ['https://bridge.test.taiko.xyz'],
      documentation: ['https://taiko.xyz/docs'],
      explorers: ['https://jolnir.taikoscan.network/'],
      repositories: ['https://github.com/taikoxyz'],
      socialMedia: [
        'https://twitter.com/taikoxyz',
        'https://discord.gg/taikoxyz',
        'https://taiko.mirror.xyz',
      ],
      rollupCodes: 'https://rollup.codes/taiko',
    },
  },
})
