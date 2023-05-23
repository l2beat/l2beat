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
        identifier: 'TokenBridge',
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
        identifier: 'USDT_POOL',
        sinceTimestamp: new UnixTime(1662596190),
        tokens: ['USDT'],
        description: 'USDT liquidity pool',
      }),
      discovery.getEscrowDetails({
        identifier: 'USDC_POOL',
        sinceTimestamp: new UnixTime(1669206935),
        tokens: ['USDC'],
        description: 'USDC liquidity pool',
      }),
      discovery.getEscrowDetails({
        identifier: 'DAI_POOL',
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
      discovery.getContractDetails(
        'LPBridge',
        'Main liquidity network Allbridge Core bridge contract.',
      ),
      discovery.getContractDetails(
        'TokenBridge',
        'Main token bridge contract.',
      ),
      discovery.getContractDetails(
        'Validator',
        'This contract is responsible for validating incoming messages to token bridge.',
      ),
      discovery.getContractDetails(
        'Fee Oracle',
        'This contract is responsible for calculating bridge fees.',
      ),
      discovery.getContractDetails(
        'Allbridge Messenger',
        'Contract used to receive messages via allbridge AMB.',
      ),
      discovery.getContractDetails(
        'Wormhole Messenger',
        'Contract used to receive messages via Wormhole AMB.',
      ),
    ],
    risks: [],
  },
  permissions: [
    {
      name: 'Allbridge EOA.',
      description:
        'EOA privileged to process allbridge AMB messages and moved funds from pools.',
      accounts: [
        {
          // TODO: What is this?
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
        'EOA privileged to update messengers and other bridge parameters. As a result this account can drain all funds from the pools.',
      accounts: [discovery.getPermissionedAccount('LPBridge', 'owner')],
    },
  ],
}
