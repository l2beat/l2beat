import { ProjectId, UnixTime } from '@l2beat/types'

import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

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
       'https://reddit.com/r/debridge',
       'https://linkedin.com/company/debridge-finance'
      ],
    },
    description:
      'deBridge is a secure interoperability layer for Web3 that enables decentralized transfers of arbitrary messages and value between various blockchains.',
  },
  config: {
    escrows: [],
  },
  technology: {
    destination: [
      'Arbitrum',
      'Avalanche',
      'BNB Chain',
      'Polygon',
      'Fantom',
      'HECO',
    ],
    category: 'Hybrid',
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'deBridge leverages cross-chain messaging to transfer tokens from Ethereum to other chains and vice-versa. The validation of cross-chain transactions is performed by a network of independent validators. deSwap is a solution built on top of deBridge infrastructure that enables capital-efficient cross-chain swaps between arbitrary liquid assets. dePort is a native bridge for assets that allows protocols to bridge tokens and create utility for their synthetic representation (deTokens) in other chains.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'External validators observe events on deBridge supported chains and transfer funds to other chains.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'nodes decide not to transfer tokens after observing an event on the supported chain.',
          isCritical: true,
        }
       ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Type of the token received on the destination chain depends on the application. For deSwap, users will receive the canonical token. For dePort, user will end up with wrapped version (deAsset).',
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
      description: 'Signed off-chain by 2/3 of deBridge validators.',
      sentiment: 'bad',
    },
    sourceUpgradeability
    destinationToken,
  },
  contracts: {
    addresses: [
      {
        name: 'DeBridgeGate',
        description:
          'The main point of cross-chain interactions coming from users and protocols. Its "send" method enables sending arbitrary messages and assets cross-chain in one transaction.”,
        address: '0x24455aa55ded7728783c9474be8ea2f5c935f8eb',
      },
         ],
    risks:,
  },

  permissions: [
    {
      name: 'ProxyAdmin',
      description:
        "Admin for all upgradable proxy smart contracts. It can change the implementations of all proxies. ProxyAdmin is controlled by governance multisig.",
      accounts: [
        {
          address: '0xE4427af3555CD9303D728C491364FAdFDD7494Fe’',
          type: 'MultiSig',
        },
      ],
    },
    ],
}


