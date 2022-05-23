import { Project } from './types'
import { bridge } from './types/bridge'

export const avalancheBridge: Project = bridge({
  name: 'Avalanche Bridge',
  slug: 'avalanchebridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://bridge.avax.network/'],
  },
  bridges: [
    {
      address: '0xE78388b4CE79068e89Bf8aA7f218eF6b9AB0e9d0',
      sinceBlock: 13410555,
      tokens: [
        'ETH',
        'USDC',
        'WETH',
        'WBTC',
        'USDT',
        'DAI',
        'LINK',
        'WOO',
        'AAVE',
        //'SWAP',
        'BUSD',
        'SUSHI',
        'SHIB',
        'UNI',
        'GRT',
        'MKR',
      ],
    },
  ],
})
