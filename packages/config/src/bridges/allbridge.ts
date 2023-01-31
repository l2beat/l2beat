import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const allbridge: Bridge = {
  type: 'bridge',
  id: ProjectId('allbridge'),
  display: {
    name: 'Allbridge',
    slug: 'allbridge',
    description:
      'Allbridge Core enables the transfer of value between blockchains by offering cross-chain swaps of native stablecoins using liquidity pools.\
    It is using either own AMB or Wormhole to pass messages. This bridge contains a number of core, unverified smart contracts and it is owned by an EOA\
    account that can drain all funds.',
    links: {
      websites: ['https://app.allbridge.io/'],
      apps: ['https://core.allbridge.io/'],
      socialMedia: [
        'https://twitter.com/Allbridge_io',
        'https://allbridge.medium.com/',
        'https://twitter.com/Allbridge_io',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: '0xB827b15adA62D78F5cb90243bc4755cf4B9d1B0e',
        sinceTimestamp: new UnixTime(1662596190),
        tokens: ['USDT'],
      },
      {
        address: '0x1D3df13aDAe6cA91Fb90b977c21d6e90ad8d403C',
        sinceTimestamp: new UnixTime(1669206935),
        tokens: ['USDC'],
      },
      {
        address: '0xCe01bc1be28c0784492cB44EbBDa662c3F539172',
        sinceTimestamp: new UnixTime(1669207319),
        tokens: ['DAI'],
      },
    ],
  },
  technology: {
    canonical: false,
    category: 'Liquidity Network',
    destination: [
      'Aurora',
      'Avalanche',
      'BNB Chain',
      'Celo',
      'Fantom',
      'Fuse',
      'Harmony',
      'Huobi',
      'Klaytn',
      'Near',
      'Polygon',
      'Solana',
      'Terra Classic',
      'Waves',
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: '???',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: '???',
      description: '', //TODO: fill
      sentiment: 'bad',
    },
  },
  contracts: {
    addresses: [
      {
        address: '0xA314330482f325D38A83B492EF6B006224a3bea9',
        name: 'Bridge',
        description: 'Main bridge contract.',
      },
      {
        address: '0x366a900eFE79aE7244C4d1d279EE4a702AdBEE50',
        name: 'Allbridge Messenger',
        description: 'Contract used to receive messages via allbridge AMB.',
      },
      {
        address: '0xF4830e4F739c8eB04EFDbf346BAE5c82163da83F',
        name: 'Wormhole Messenger',
        description: 'Contract used to receive messages via Wormhole AMB.',
      },
      {
        address: '0xB827b15adA62D78F5cb90243bc4755cf4B9d1B0e',
        name: 'USDT Pool',
        description: 'Pool holding USDT tokens.',
      },
      {
        address: '0x1D3df13aDAe6cA91Fb90b977c21d6e90ad8d403C',
        name: 'USDC Pool',
        description: 'Pool holding USDC tokens.',
      },
      {
        address: '0xCe01bc1be28c0784492cB44EbBDa662c3F539172',
        name: 'DAI Pool',
        description: 'Pool holding DAI tokens.',
      },
    ],
    risks: [],
  },
  permissions: [
    {
      name: 'Allbridge EOA.',
      description:
        'EOA privilidged to process allbridge AMB messages and moved funds from pools.',
      accounts: [
        {
          address: '0x7234dB900E907398EdfAdA744d5Bf8A842B335BA',
          type: 'EOA',
        },
      ],
    },
    {
      name: 'Allbridge Owner EOA.',
      description:
        'EOA privilidged to update messengers and other bridge parameters. As a result this account can drain all funds from the pools.',
      accounts: [
        {
          address: '0x01a494079DCB715f622340301463cE50cd69A4D0',
          type: 'EOA',
        },
      ],
    },
  ],
}
