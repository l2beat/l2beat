import { Project } from './types'
import { bridge } from './types/bridge'

export const nomadBridge: Project = bridge({
  name: 'Nomad Bridge',
  slug: 'nomadbridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://app.nomad.xyz/'],
  },
  bridges: [
    {
      address: '0x88A69B4E698A4B090DF6CF5Bd7B2D47325Ad30A3',
      sinceBlock: 13983843,
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
})
