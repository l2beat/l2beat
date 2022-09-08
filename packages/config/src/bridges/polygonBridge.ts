import { UnixTime } from '@l2beat/types'

import { BridgeDescription } from './types'

export const polygonBridge: BridgeDescription = {
  name: 'Polygon Bridge',
  slug: 'polygonbridge',
  validation: 'LC Token Bridge',
  links: {
    websites: ['https://wallet.polygon.technology/'],
  },
  associatedTokens: ['MATIC'],
  escrows: [
    {
      address: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
      sinceTimestamp: new UnixTime(1598436664),
      tokens: [
        'USDC',
        'USDT',
        'WBTC',
        'SAND',
        //'ALTA',
        //'QUICK',
        'DAI',
        //'GHST',
        'AAVE',
        'LINK',
        //'BAL',
        'CRV',
        'MANA',
        'CEL',
        //'DG',
        //'xDG',
        //'BZRX',
        //'AWX',
      ],
    },
    {
      address: '0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30',
      sinceTimestamp: new UnixTime(1598437971),
      tokens: ['ETH'],
    },
    {
      address: '0x401F6c983eA34274ec46f84D70b31C151321188b',
      sinceTimestamp: new UnixTime(1590850640),
      tokens: ['MATIC', 'DAI'],
    },
  ],
  connections: [],
}
