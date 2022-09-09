import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const wormhole: Bridge = {
  id: ProjectId('wormhole'),
  name: 'Wormhole',
  slug: 'wormhole',
  validation: 'Native Bridge',
  links: {
    websites: ['https://www.portalbridge.com/'],
  },
  escrows: [
    {
      address: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
      sinceTimestamp: new UnixTime(1631535967),
      tokens: [
        'WETH',
        //'NEXM',
        //'XCN',
        'USDT',
        'USDC',
        'HUSD',
        'BUSD',
        'LINK',
        'SRM',
        'SUSHI',
        'UNI',
        'LDO',
        'DAI',
        //'stETH',
      ],
    },
    {
      address: '0xf92cD566Ea4864356C5491c177A430C222d7e678',
      sinceTimestamp: new UnixTime(1611084766),
      tokens: [
        //'FTT',
        'BUSD',
        'HBTC',
        'HUSD',
        'DAI',
        'SRM',
        'WETH',
        'FRAX',
        'WBTC',
      ],
    },
  ],
  connections: [{ network: 'Solana', tokens: ['*'] }],
}
