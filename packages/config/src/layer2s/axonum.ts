import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const axonum: Layer2 = upcomingL2({
  id: 'axonum',
  display: {
    name: 'Axonum',
    slug: 'axonum',
    description:
      'Axonum leverages optimistic machine learning and a modified OP Stack and introduces innovations of AI EVM to add intelligence to Ethereum as a Layer 2.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://axonum.io'],
      apps: ['https://app.axonum.io/bridge/deposit'],
      documentation: ['https://docs.axonum.io'],
      explorers: ['https://sepolia-explorer.axonum.io'],
      repositories: ['https://github.com/axonum'],
      socialMedia: [
        'https://twitter.com/axonum_io',
        'https://mirror.xyz/brainof.eth',
        'https://discord.com/invite/xNPyscGu',
      ],
    },
  },
})
