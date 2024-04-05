import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const molten: Layer2 = upcomingL2({
  id: 'molten',
  display: {
    name: 'Molten Network',
    slug: 'molten',
    description:
      'Molten Network is an upcoming scaling solution by Unidex team. It is powered by the OP Stack.',
    purposes: ['DeFi'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://unidex.exchange/molten-network'],
      apps: [],
      documentation: ['https://docs.unidex.exchange/appchain/markdown'],
      explorers: ['https://unidex-celestium.calderaexplorer.xyz/'], //Temporarily Unavailable
      repositories: [],
      socialMedia: [
        'https://twitter.com/UniDexFinance',
        'https://discord.gg/unidex',
        'https://mirror.xyz/unidexexchange.eth',
        'https://t.me/unidexfinance',
      ],
    },
  },
})
