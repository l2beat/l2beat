import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import type { Bridge } from '../../types'

export const harmony: Bridge = {
  type: 'bridge',
  id: ProjectId('harmony'),
  addedAt: new UnixTime(1662628329), // 2022-09-08T09:12:09Z
  display: {
    name: 'Harmony',
    slug: 'harmony',
    description: 'Externally Validated Token Bridge secured by a multisig.',
    category: 'Token Bridge',
    links: {
      websites: ['https://bridge.harmony.one/erc20'],
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0xF9Fb1c508Ff49F78b60d3A96dea99Fa5d7F3A8A6'),
        sinceTimestamp: new UnixTime(1610602801),
        tokens: ['ETH'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xfD53b1B4AF84D59B20bF2C20CA89a6BeeAa2c628'),
        sinceTimestamp: new UnixTime(1602456041),
        tokens: ['BUSD'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x2dCCDB493827E15a5dC8f8b72147E6c4A5620857'),
        sinceTimestamp: new UnixTime(1602456188),
        tokens: [
          'USDC',
          'USDT',
          'WBTC',
          'DAI',
          'FRAX',
          //'AAG',
          'FXS',
          'SUSHI',
          'AAVE',
          'CRV',
          'WETH',
          'MATIC',
        ],
        chain: 'ethereum',
      },
    ],
  },
  technology: {
    destination: ['Harmony'],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: '2/5 MultiSig',
      sentiment: 'bad',
    },
  },
  milestones: [
    {
      title: 'Compromised multisig steals funds',
      date: '2022-06-24T00:00:00.00Z',
      url: 'https://rekt.news/harmony-rekt/',
      type: 'general',
    },
  ],
}
