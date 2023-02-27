import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { Bridge } from './types'

export const amarok: Bridge = {
  type: 'bridge',
  id: ProjectId('amarok'),
  display: {
    name: 'Connext Amarok',
    slug: 'amarok',
    description:
      'Connext Amarok is a multilayered architecture that implements Hub-and-Spoke AMB (Arbitrary Message Bridge) with liquidity network built on top of it.\
    Messages from various domains are aggregated into one message root and are periodically sent to Ethereum using native AMBs. Upon being delivered to Ethereum they are\
    subsequently aggregated again into a root-of-root of messages before being delivered to their destinations. Each message can be optimistically fast-forwarded by a network of Routers that will\
    front liquidity (if the message is a token transfer) or post a bond (if the message is a xChain call). Upon receiving the message root via native AMBs Connext Amarok bridge will\
    reconciles messages and return bond to the Routers. A set of Watchers is maintained whose purpose is to pause the bridge if the fraud is detected.',
    links: {
      websites: ['https://bridge.connext.network/'],
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6'), // Connext main Diamond contract
        sinceTimestamp: new UnixTime(1671625595),
        tokens: ['USDC', 'WETH'],
      },
    ],
  },
  technology: {
    canonical: true,
    category: 'Hybrid',
    destination: ['Gnosis', 'Optimism', 'Arbitrum', 'Polygon', 'BSC'],
  },
  contracts: {
    addresses: [
      {
        name: 'Connext Amarok Bridge',
        address: EthereumAddress('0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6'),
        description:
          'The main Connext Amarok contract. Following Diamond design patter, it contains multiple Facets that implement\
        various parts of the bridge functionality.',
      },
      {
        name: 'Root Manager',
        address: EthereumAddress('0xd5d61E9dfb6680Cba8353988Ba0337802811C2e1'),
        description: '.',
      },
      {
        name: 'Watcher Manager',
        address: EthereumAddress('0x6a595E41893a5ACBA9dBf8288B92eb71106Ba7A6'),
        description:
          'Contract maintaining a list of Watchers able to stop the bridge if fraud is detected.',
      },
      {
        name: 'MainnetSpokeConnector',
        address: EthereumAddress('0xF7c4d7dcEc2c09A15f2Db5831d6d25eAEf0a296c'),
        description:
          'Contract that receives messages from other Domains on Ethereum.',
      },
      {
        name: 'MultichainHubConnector',
        address: EthereumAddress('0xFaf539a73659fEAEC96ec7242f075Be0445526A8'),
        description:
          'Contract for sending/receiving messages from mainnet to Binance Smart Chain via Multichain AMB.',
      },
      {
        name: 'PolygonHubConnector',
        address: EthereumAddress('0xB01BC38909413f5dbb8F18a9b5787A62ce1282aE'),
        description:
          'Contract for sending/receiving messages from mainnet to Polygon via Polygon FxChannel AMB.',
      },
      {
        name: 'GnosisHubConnector',
        address: EthereumAddress('0xCb0840E861456DA0483166aD4B0F3DC251586B4A'),
        description:
          'Contract for sending/receiving messages from mainnet to Gnosis via Gnosis AMB.',
      },
      {
        name: 'OptimismHubConnector',
        address: EthereumAddress('0xc324B7984990248D86dfe90edf7E3657De2565bA'),
        description:
          'Contract for sending/receiving messages from mainnet to Optimism via Optimism AMB transport layer. Note that it reads messages from Optimism\
        as soon as Optimism state root is recorded on Ethereum w/out waiting for the 7-day fraud proof delay window.',
      },
      {
        name: 'ArbitrumHubConnector',
        address: EthereumAddress('0xd151C9ef49cE2d30B829a98A07767E3280F70961'),
        description:
          'Contract for sending/receiving messages from mainnet to Optimism via Arbitrum AMB transport layer. Note that it reads messages from Arbitrum\
        as soon as Arbitrum state root is recorded on Ethereum w/out waiting for the 7-day fraud proof delay window.',
      },
    ],
    risks: [],
  },
  permissions: [
    {
      name: 'Connext MultiSig',
      description:
        '3/3 MultiSig. Owner of the main Connext Amarok Bridge Diamond Proxy. Can upgrade the functionality of any system component with no delay.',
      accounts: [
        {
          address: EthereumAddress(
            '0x4d50a469fc788a3c0CdC8Fd67868877dCb246625',
          ),
          type: 'MultiSig',
        },
      ],
    },
    {
      name: 'Connext SuperAdmin',
      description:
        'Owner of each individual bridge component, can configure each one of them with no delay.',
      accounts: [
        {
          address: EthereumAddress(
            '0xade09131C6f43fe22C2CbABb759636C43cFc181e',
          ),
          type: 'EOA',
        },
      ],
    },
    {
      name: 'Connext Router Admin',
      description: '.',
      accounts: [
        {
          address: EthereumAddress(
            '0x29A519e21d6A97cdB82270b69c98bAc6426CDCf9',
          ),
          type: 'EOA',
        },
      ],
    },
    //
  ],
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: '2/3 Validators',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'EOA',
      description: '', //TODO: fill
      sentiment: 'bad',
    },
  },
}
