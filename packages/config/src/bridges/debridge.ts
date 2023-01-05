import { ProjectId, UnixTime } from '@l2beat/types'

import { CONTRACTS } from '../layer2s'
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
        'https://reddit.com/r/debridge/',
        'https://linkedin.com/company/debridge-finance',
      ],
      apps: ['https://app.debridge.finance'],
    },
    description:
      'deBridge is an interoperability layer that enables messaging between various blockchains.',
  },
  config: {
    escrows: [
      {
        address: '0x43dE2d77BF8027e25dBD179B491e8d64f38398aA',
        sinceTimestamp: new UnixTime(1637595390),
        tokens: ['USDC', 'WETH', 'FRAX'],
      },
    ],
  },
  technology: {
    destination: ['Arbitrum', 'Avalanche', 'BNB Chain', 'Polygon'],
    category: 'Token Bridge',
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'deBridge leverages cross-chain messaging to transfer tokens from Ethereum to other chains and vice-versa. The validation of cross-chain transactions is performed by a network of oracles signing the transaction, which would be later evaluated by the smart contract. ',
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
        'Tokens transferred end up a their wrapped representation (deTokens)',
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
        address: '0x43dE2d77BF8027e25dBD179B491e8d64f38398aA',
        upgradeability: {
          type: 'EIP1967',
          admin: '0xE4427af3555CD9303D728C491364FAdFDD7494Fe',
          implementation: '0x797161BCC625155D2302251404ccB93c2632658e',
        },
      },
      {
        name: 'SignatureVerifier',
        description:
          'Contract responsible for checking off-chain signatures performed by the oracles, currently there are needed at least 8 confirmations.',
        address: '0x949b3B3c098348b879C9e4F15cecc8046d9C8A8c',
        upgradeability: {
          type: 'EIP1967',
          implementation: '0xfE7De3c1e1BD252C67667B56347cABFC6df08dF4',
          admin: '0xE4427af3555CD9303D728C491364FAdFDD7494Fe',
        },
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
          address: '0xE4427af3555CD9303D728C491364FAdFDD7494Fe',
          type: 'MultiSig',
        },
      ],
    },
    {
      name: 'Oracles',
      description: '',
      accounts: [{ address: '', type: 'EOA' }],
    },
  ],
}
