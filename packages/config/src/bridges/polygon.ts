import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const polygon: Bridge = {
  id: ProjectId('polygon'),
  display: {
    name: 'Polygon PoS',
    slug: 'polygon',
    links: {
      websites: ['https://wallet.polygon.technology/'],
    },
  },
  config: {
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
  },
  technology: {
    destination: ['Polygon'],
    canonical: true,
    type: 'Lock-Mint',
    validation: 'LC Token Bridge',
    connections: [],
  },
  riskView: {
    validation: {
      value: 'Light Client',
      description:
        'Transfers need to be confirmed by 2/3 of Polygon PoS Validators stake.',
      sentiment: 'warning',
    },
    sourceUpgradeability: {
      value: '2 day delay',
      description: 'The bridge can be upgraded by x/y MSig after 2 day delay',
      sentiment: 'warning',
    },
    destinationToken: {
      value: 'UChildERC20Proxy',
      description: 'This token can be upgraded if Proxy owner is not set to 0x',
      sentiment: 'bad',
    },
  },
}
