import { Project } from './types'
import { bridge } from './types/bridge'

export const fantomBridge: Project = bridge({
  name: 'MChain Fantom Bridge',
  slug: 'fantombridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://multichain.xyz/'],
  },
  bridges: [
    {
      address: '0xC564EE9f21Ed8A2d8E7e76c085740d5e4c5FaFbE',
      sinceBlock: 12467630,
      tokens: [
        'USDC',
        'WBTC',
        'DAI',
        'WETH',
        'FRAX',
        'USDC',
        //'DOLA',
        'LINK',
        'YFI',
        'CRV',
        'TUSD',
        'FXS',
        //'WOOFY',
      ],
    },
  ],
  connections: [],
})
