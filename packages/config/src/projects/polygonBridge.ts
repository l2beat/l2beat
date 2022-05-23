import { Project } from './types'
import { bridge } from './types/bridge'

export const polygonBridge: Project = bridge({
  name: 'Polygon Bridge',
  slug: 'polygonbridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://wallet.polygon.technology/'],
  },
  associatedTokens: ['MATIC'],
  bridges: [
    {
      address: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
      sinceBlock: 10735445,
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
      sinceBlock: 10735538,
      tokens: ['ETH'],
    },
    {
      address: '0x401F6c983eA34274ec46f84D70b31C151321188b',
      sinceBlock: 10167767,
      tokens: ['MATIC', 'DAI'],
    },
  ],
})
