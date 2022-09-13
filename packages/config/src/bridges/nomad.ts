import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const nomad: Bridge = {
  id: ProjectId('nomad'),
  name: 'Nomad',
  slug: 'nomad',
  validation: 'Optimistic Bridge',
  links: {
    websites: ['https://app.nomad.xyz/'],
  },
  escrows: [
    {
      address: '0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3',
      sinceTimestamp: new UnixTime(1641899423),
      tokens: [
        'USDC',
        'FRAX',
        //'IAG',
        'WETH',
        'USDT',
        'WBTC',
        'DAI',
        //'CQT',
        'FXS',
      ],
    },
  ],
  connections: [],
}
