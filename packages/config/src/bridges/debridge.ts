import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { CONTRACTS } from '../layer2s'
import { ProjectDiscovery } from '../layer2s/common/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('debridge')

export const debridge: Bridge = {
  type: 'bridge',
  id: ProjectId('debridge'),
  display: {
    name: 'deBridge',
    slug: 'debridge',
    links: {
      websites: ['https://debridge.finance'],
      documentation: ['https://docs.debridge.finance'],
      repositories: ['https://github.com/debridge-finance'],
      explorers: ['https://explorer.debridge.finance'],
      socialMedia: [
        'https://twitter.com/deBridgeFinance',
        'https://discord.gg/debridge',
        'https://blog.debridge.finance',
        'https://reddit.com/r/debridge/',
        'https://linkedin.com/company/debridge-finance',
      ],
      apps: ['https://app.debridge.finance'],
    },
    description:
      'deBridge is an interoperability layer that enables messaging between various blockchains. For the typical token transfer, "deToken" is minted on the destination chain.',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x43dE2d77BF8027e25dBD179B491e8d64f38398aA'),
        sinceTimestamp: new UnixTime(1637595390),
        tokens: [
          'USDC',
          'WETH',
          'FRAX',
          'ETH',
          'USDT',
          'WBTC',
          'DAI',
          'MATIC',
          'RAI',
        ],
      },
    ],
  },
  technology: {
    destination: ['Arbitrum', 'Avalanche', 'BNB Chain', 'Polygon'],
    category: 'Token Bridge',
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'deBridge leverages cross-chain messaging to transfer tokens from Ethereum to other chains and vice-versa. The validation of cross-chain transactions is performed by a network of oracles signing the transaction, which would be later evaluated by the smart contract.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'External validators observe events on deBridge supported chains and transfer signed messages to other chains. Message is considered valid when it contains at least minimum amount of signature, currently set to 8.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'nodes decide not to transfer tokens after observing an event on the supported chain.',
          isCritical: true,
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Tokens transferred end up a their wrapped representation (deTokens).',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'destination token contract is maliciously upgraded or not securely implemented.',
          isCritical: true,
        },
      ],
    },
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: 'Signed off-chain by 8 or more deBridge oracles.',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description: 'The bridge can be upgraded by 2/3 MSig.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.WRAPPED,
  },
  contracts: {
    addresses: [
      {
        name: 'DeBridgeGate',
        description:
          'The main point of cross-chain interactions, this contract allows user to send message to other chain and claim funds when bridging back to Ethereum.',
        address: EthereumAddress('0x43dE2d77BF8027e25dBD179B491e8d64f38398aA'),
        upgradeability: discovery.getContract(
          '0x43dE2d77BF8027e25dBD179B491e8d64f38398aA',
        ).upgradeability,
      },
      {
        name: 'SignatureVerifier',
        description:
          'Contract responsible for checking off-chain signatures performed by the oracles, currently there are needed at least 8 confirmations.',
        address: EthereumAddress('0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c'),
        upgradeability: discovery.getContract(
          '0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c',
        ).upgradeability,
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      name: 'ProxyAdmin',
      description:
        'Admin for all upgradable proxy smart contracts. It can change the implementations of all proxies. ProxyAdmin is controlled by governance multisig.',
      accounts: [
        {
          address: EthereumAddress(
            '0xE4427af3555CD9303D728C491364FAdFDD7494Fe',
          ),
          type: 'MultiSig',
        },
      ],
    },
    {
      name: 'Oracles',
      description:
        'Accounts permitted to sign the message coming from other chain. Currently at least 8 of them are need to sign the message.',
      accounts: [
        {
          address: EthereumAddress(
            '0x4bC16662A2cE381E7bb54Dc577c05619C5E67526',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x1c0720B124e7251e881a0fbCfe259d085C59f205',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x573F5E2940789B378BA09cf7d3fD010C422a9ff5',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x59CE95b8955F0E7Be128d5Af77161B36f6084214',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xbCF516826eD7F3b0E487C7ca6A87b3b4EccDD4DC',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xf27Af436A6F2d9C64B4CA40a483eC46acDc33fe8',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x6436BBcA322b8cD0c56d8b9aD7837b13960dA426',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x874f46124C1DAaD4749B94f82eD142754826240E',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xDD523FD4DebcF0dB6f0B2c2D30D075CaaeE023e0',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x83f81E7f9E284AAFFEDED797008663595f7342bF',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x4CA2191cDE585d65EB6AFC09D23D60b8A0AB677D',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xebec9bc53f9C65f69DB8591B9f240BbCDb563c54',
          ),
          type: 'EOA',
        },
      ],
    },
  ],
}
