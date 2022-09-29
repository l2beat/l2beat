import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const polygon: Bridge = {
  type: 'bridge',
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
  technology: {
    destination: ['Polygon'],
    canonical: true,
    type: 'Lock-Mint',
    principleOfOperation: {
      // TODO: this is a temporary entry
      name: 'Principle of operation',
      description:
        'How the bridge works. Who sends money where. Maybe we want an image in this section.',
      references: [],
      risks: [],
      isIncomplete: true,
    },
    validation: {
      // TODO: this is a temporary entry
      name: 'Transfers are verified by a light client',
      description:
        'Transfers need to be confirmed by 2/3 of Polygon PoS Validators stake.',
      references: [],
      risks: [],
      isIncomplete: true,
    },
    destinationToken: {
      // TODO: this is a temporary entry
      name: 'Destination tokens are upgradeable',
      description:
        'This token can be upgraded if Proxy owner is not set to 0x.',
      references: [],
      risks: [],
      isIncomplete: true,
    },
  },
  contracts: {
    // TODO: this is a temporary entry
    addresses: [
      {
        address: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        name: 'Escrow for all tokens',
        description: 'All random tokens go here.',
      },
      {
        address: '0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30',
        name: 'Escrow for ether',
        description: 'All ether goes here.',
      },
      {
        address: '0x401F6c983eA34274ec46f84D70b31C151321188b',
        name: 'Escrow for MATIC and DAI',
        description: 'All MATIC and DAI go here.',
      },
    ],
    risks: [],
  },
  permissions: [
    // TODO: this is a temporary entry
    {
      name: 'Mint tokens',
      description: 'All tokens come from this address',
      accounts: [
        {
          address: '0x0000000000000000000000000000000000000000',
          type: 'EOA',
        },
      ],
    },
  ],
}
