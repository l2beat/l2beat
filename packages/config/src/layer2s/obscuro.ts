import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const obscuro: Layer2 = upcoming({
  id: 'obscuro',
  display: {
    name: 'Obscuro',
    slug: 'obscuro',
    description:
      'Obscuro is an Encrypted Rollup that has been designed for use on the Ethereum network and uses 100% of the EVM. At present, Obscuro is available in testnet running on the Sepolia testnet for further testing and optimization.',
    purpose: 'Universal, Encrypted',
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://obscu.ro'],
      apps: [],
      documentation: [
        'https://docs.obscu.ro',
        'https://obscu.ro/litepaper',
        'https://whitepaper.obscu.ro',
      ],
      explorers: ['https://testnet.obscuroscan.io'],
      repositories: [
        'https://github.com/obscuronet',
        'https://github.com/obscuronet/go-obscuro',
        'https://github.com/obscuronet/tutorial',
        'https://github.com/obscuronet/sample-applications',
      ],
      socialMedia: [
        'https://twitter.com/obscuronet',
        'https://discord.gg/NcK3DMZqF8',
        'https://medium.com/obscuro-labs',
      ],
    },
  },
})
