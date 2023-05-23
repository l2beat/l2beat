import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('allbridge')

export const allbridge: Bridge = {
  type: 'bridge',
  id: ProjectId('allbridge'),
  display: {
    name: 'Allbridge',
    slug: 'allbridge',
    description:
      'Allbridge Core enables the transfer of value between blockchains by offering cross-chain swaps of native stablecoins using liquidity pools.\
    For its stableconin liquidity network it is using either own AMB or Wormhole to pass messages. Allbridge bridge is a token bridge implemented\
    as a separate contract. Both bridges contains a number of core, unverified smart contracts and it is owned by an EOA\
    account that can drain all funds.',
    links: {
      websites: ['https://app.allbridge.io/'],
      apps: ['https://core.allbridge.io/'],
      socialMedia: [
        'https://twitter.com/Allbridge_io',
        'https://allbridge.medium.com/',
      ],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xBBbD1BbB4f9b936C3604906D7592A644071dE884'),
        sinceTimestamp: new UnixTime(1636635220),
        tokens: [
          'ETH',
          'USDC',
          //'XRUNE',
          'USDT',
          'DAI',
          'MIM',
        ],
        description: 'Lock-Mint token bridge',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xB827b15adA62D78F5cb90243bc4755cf4B9d1B0e'),
        sinceTimestamp: new UnixTime(1662596190),
        tokens: ['USDT'],
        description: 'USDT liquidity pool',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x1D3df13aDAe6cA91Fb90b977c21d6e90ad8d403C'),
        sinceTimestamp: new UnixTime(1669206935),
        tokens: ['USDC'],
        description: 'USDC liquidity pool',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xCe01bc1be28c0784492cB44EbBDa662c3F539172'),
        sinceTimestamp: new UnixTime(1669207319),
        tokens: ['DAI'],
        description: 'DAI liquidity pool',
      }),
    ],
  },
  technology: {
    canonical: false,
    category: 'Hybrid',
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
      discovery.getMainContractDetails(
        'LPBridge',
        'Main liquidity network Allbridge Core bridge contract.',
      ),
      discovery.getMainContractDetails(
        'TokenBridge',
        'Main token bridge contract.',
      ),
      {
        address: EthereumAddress('0x93746538D4519C809827205Bd1C2c7a0E15bd74b'),
        name: 'Validator',
        description:
          'This contract is responsible for validating incoming messages to token bridge.',
      },
      {
        address: EthereumAddress('0xba6d8dE08f13A3D22FCEC54752812Dd4dcf2E1f6'),
        name: 'Fee Oracle',
        description:
          'This contract is responsible for calculating bridge fees.',
      },
      {
        address: EthereumAddress('0x366a900eFE79aE7244C4d1d279EE4a702AdBEE50'),
        name: 'Allbridge Messenger',
        description: 'Contract used to receive messages via allbridge AMB.',
      },
      {
        address: EthereumAddress('0xF4830e4F739c8eB04EFDbf346BAE5c82163da83F'),
        name: 'Wormhole Messenger',
        description: 'Contract used to receive messages via Wormhole AMB.',
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
          address: EthereumAddress(
            '0x7234dB900E907398EdfAdA744d5Bf8A842B335BA',
          ),
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
          address: EthereumAddress(
            '0x01a494079DCB715f622340301463cE50cd69A4D0',
          ),
          type: 'EOA',
        },
      ],
    },
  ],
}
