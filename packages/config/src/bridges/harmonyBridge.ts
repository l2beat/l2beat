import { UnixTime } from '@l2beat/types'

import { BridgeDescription } from './types/bridge'

export const harmonyBridge: BridgeDescription = {
  name: 'Harmony Bridge',
  slug: 'harmonybridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://bridge.harmony.one/erc20'],
  },
  bridges: [
    {
      address: '0xF9Fb1c508Ff49F78b60d3A96dea99Fa5d7F3A8A6',
      sinceTimestamp: new UnixTime(1610602801),
      tokens: ['ETH'],
    },
    {
      address: '0x2dCCDB493827E15a5dC8f8b72147E6c4A5620857',
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
    },
  ],
  connections: [],
}
