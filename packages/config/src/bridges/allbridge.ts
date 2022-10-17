import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const allbridge: Bridge = {
  type: 'bridge',
  id: ProjectId('allbridge'),
  display: {
    name: 'Allbridge',
    slug: 'allbridge',
    description: '',
    links: {
      websites: ['https://app.allbridge.io/'],
    },
  },
  config: {
    escrows: [
      {
        address: '0xBBbD1BbB4f9b936C3604906D7592A644071dE884',
        sinceTimestamp: new UnixTime(1636635220),
        tokens: [
          'ETH',
          'USDC',
          //'XRUNE',
          'USDT',
          'DAI',
          'MIM',
        ],
      },
    ],
  },
  technology: {
    canonical: false,
    category: 'Liquidity Network',
    destination: [
      'Aurora',
      'Avalanche',
      'BNB Chain',
      'Celo',
      'Fantom',
      'Fuse',
      'Harmony',
      'Huobi',
      'Klaytn',
      'Near',
      'Polygon',
      'Solana',
      'Terra Classic',
      'Waves',
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: '???',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: '???',
      description: '', //TODO: fill
      sentiment: 'bad',
    },
  },
}
