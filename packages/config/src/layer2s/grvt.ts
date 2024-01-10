import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const grvt: Layer2 = upcoming({
  id: 'grvt',
  display: {
    name: 'GRVT',
    slug: 'grvt',
    description:
      'Gravity (GRVT) is a hybrid crypto derivatives exchange, providing a centralized exchange-like experience while being decentralized, featuring self-custodial funds and wallets.',
    purpose: ['DeFi'],
    category: 'ZK Rollup',
    provider: 'ZK Stack',
    links: {
      websites: ['https://grvt.io'],
      apps: [],
      documentation: ['https://docs.grvt.io'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/grvt_io',
        'https://discord.gg/3jsVPwaGeB',
      ],
    },
  },
})
