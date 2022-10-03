import { ProjectId, UnixTime } from '@l2beat/types'

import { CONTRACTS } from '../layer2s/common'
import { Bridge } from './types'

export const polygonpos: Bridge = {
  type: 'bridge',
  id: ProjectId('polygon-pos'),
  display: {
    name: 'Polygon PoS',
    slug: 'polygon',
    links: {
      websites: ['https://polygon.technology'],
      explorers: ['https://polygonscan.com'],
      apps: ['https://wallet.polygon.technology'],
      repositories: ['https://github.com/maticnetwork/'],
      socialMedia: [
        'https://twitter.com/0xPolygon',
        'https://forum.polygon.technology/',
        'https://reddit.com/r/0xPolygon/',
        'https://facebook.com/0xPolygon.Technology',
        'https://linkedin.com/company/0xpolygon/',
        'https://youtube.com/c/PolygonTV',
        'https://instagram.com/0xpolygon/',
      ],
    },
    description:
      'Polygon PoS it the official bridge provided by the Polygon team to bridge assets from Ethereum to Polygon chain. The bridge is validated by Polygon validators and allows for asset as well as data movement between Polygon and Ethereum.',
  },
  config: {
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
      value: '48 hours delay',
      description:
        'The bridge can be upgraded by 5/9 MSig after 48 hour delay.',
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
    category: 'Lock-Mint',
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
    // TODO: we need all contracts (check roles on escrows) and a diagram
    isIncomplete: true,
    addresses: [
      {
        address: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        name: 'ERC20Predicate',
        description: 'Escrow contract for ERC20 tokens.',
        upgradeability: {
          type: 'Custom',
          implementation: '0x608669d4914Eec1E20408Bc4c9eFFf27BB8cBdE5',
          admin: '0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf',
        },
      },
      {
        address: '0x8484Ef722627bf18ca5Ae6BcF031c23E6e922B30',
        name: 'EtherPredicate',
        description: 'All ether goes here.',
        upgradeability: {
          type: 'Custom',
          implementation: '0x54006763154c764da4AF42a8c3cfc25Ea29765D5',
          admin: '0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf',
        },
      },
      {
        address: '0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf',
        name: 'Timelock',
        description: 'Contract enforcing delay on code upgrades.',
      },
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('48 hours')],
  },
  permissions: [
    {
      accounts: [
        {
          address: '0xFa7D2a996aC6350f4b56C043112Da0366a59b74c',
          type: 'MultiSig',
        },
      ],
      name: 'Polygon MultiSig',
      description:
        'Can propose and execute code upgrades on escrows via Timelock contract.',
    },
    {
      accounts: [
        { address: '0x0D2600C228D9Bcc9757B64bBb232F86A912B7b03', type: 'EOA' },
        { address: '0x1aE033D45ce93bbB0dDBF71a0Da9de01FeFD8529', type: 'EOA' },
        { address: '0x39415255619783A2E71fcF7d8f708A951d92e1b6', type: 'EOA' },
        { address: '0x803B74766D8f79195D4DaeCF6f2aac31Dba78F25', type: 'EOA' },
        { address: '0x8Eab5aEfe2755E1bAD2052944Ea096AEbdA1d602', type: 'EOA' },
        { address: '0xA7499Aa6464c078EeB940da2fc95C6aCd010c3Cc', type: 'EOA' },
        { address: '0xD0FD9303fe99EdFAF5eD4A2c1657a347d8053C9a', type: 'EOA' },
        { address: '0xFb9af163DF1e54171bC773eb88B46aa1E912489f', type: 'EOA' },
        { address: '0xb771380f912E4b5F6beDdf81314C383c13F16ab5', type: 'EOA' },
      ],
      name: 'MultiSig Participants',
      description: 'Participants of the 5/9 Polygon MultiSig.',
    },
  ],
}
