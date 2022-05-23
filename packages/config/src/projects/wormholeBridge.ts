import { Project } from './types'
import { bridge } from './types/bridge'

export const wormholeBridge: Project = bridge({
  name: 'Wormhole Bridge',
  slug: 'wormholebridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://www.portalbridge.com/'],
  },
  bridges: [
    {
      address: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
      sinceBlock: 13217349,
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
      sinceBlock: 11687664,
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
  connections: [],
})
