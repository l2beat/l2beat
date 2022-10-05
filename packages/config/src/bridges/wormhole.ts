import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const wormhole: Bridge = {
  type: 'bridge',
  id: ProjectId('wormhole'),
  display: {
    name: 'Wormhole',
    slug: 'wormhole',
    links: {
      websites: ['https://wormhole.com/', 'https://linktr.ee/wormholecrypto'],
      documentation: [
        'https://docs.wormhole.com/wormhole/',
        'https://book.wormhole.com/',
      ],
      explorers: ['https://wormhole.com/explorer/'],
      apps: ['https://www.portalbridge.com'],
      repositories: ['https://github.com/wormhole-foundation/wormhole'],
      socialMedia: [
        'https://discord.gg/wormholecrypto',
        'https://t.me/wormholecrypto',
        'https://twitter.com/wormholecrypto',
      ],
    },
    description:
      'Assets bridging is built on top of Wormhole, which is a message passing protocol that leverages specialized network of nodes to perform cross-chain communication.',
  },
  config: {
    escrows: [
      {
        address: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585', // Escrows to various chains
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
    ],
  },
  riskView: {
    validation: {
      value: 'External',
      description:
        'Transfers need to be signed offchain by a set of 2/3 of Guardians and then relayed to the destination chain.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description: 'The code that secures the system can be changed arbitrarily and without notice.',
      sentiment: 'bad',
    },
    destinationToken: {
      //todo
      value: 'WrappedToken ',
      description:
        'This token follows Beacon Proxy pattern and can be upgraded by ????',
      sentiment: 'bad',
    },
  },
  technology: {
    destination: [
      'Acala',
      'Algorand',
      'Aurora',
      'Avalanche',
      'Binance Smart Chain',
      'Celo',
      'Ethereum',
      'Fantom',
      'Karura',
      'Klaytn',
      'Moonbeam',
      'Near',
      'Oasis',
      'Polygon',
    ],
    canonical: true,
    category: 'Lock-Mint',
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'This is a Lock-Mint bridge that locks tokens in the escrow contracts on Ethereum and mints tokens on the destination network. What differentiates this solution is the cross-chain message passing via Wormhole protocol, in which emitted messages on one chain are observed by a network of nodes and then verified. After verification, this message is submitted to the target chain for processing.',
      references: [],
      risks: [],
    },
    validation: {
      //todo
      name: 'Transfers are externally verified',
      description: 'Wormhole is a generic ',
      references: [],
      risks: [],
    },
    destinationToken: {
      //todo
      name: 'Destination tokens',
      description: '',
      references: [],
      risks: [],
    },
  },

  contracts: {
    //todo
    isIncomplete: true,
    addresses: [],
    risks: [],
  },

  permissions: [//todo],
}
