import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const debank: Layer2 = upcoming({
  id: 'debank',
  display: {
    name: 'Debank Chain',
    slug: 'debank',
    description:
      'Debank Chain is an upcoming scaling solution by Debank team. It is powered by the OP Stack.',
    purpose: ['Universal', 'Social'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://debank.com/account'],
      apps: [],
      documentation: [],
      explorers: ['https://explorer.testnet.debank.com/'],
      repositories: ['https://github.com/DeBankDeFi/DeBankChain'],
      socialMedia: [
        'https://twitter.com/DebankDeFi',
        'https://medium.com/debank',
        'https://debank.com/official/DeBank',
      ],
    },
  },
})
