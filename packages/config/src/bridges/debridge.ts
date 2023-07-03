import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS } from '../layer2s'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('debridge')

export const debridge: Bridge = {
  type: 'bridge',
  id: ProjectId('debridge'),
  display: {
    name: 'deBridge',
    slug: 'debridge',
    category: 'Token Bridge',
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
      discovery.getContractDetails(
        'DeBridgeGate',
        'The main point of cross-chain interactions, this contract allows user to send message to other chain and claim funds when bridging back to Ethereum.',
      ),
      discovery.getContractDetails(
        'SignatureVerifier',
        'Contract responsible for checking off-chain signatures performed by the oracles, currently there are needed at least 8 confirmations.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'Admin Multisig',
      'Admin for all upgradable proxy smart contracts. It can change the implementations of all proxies through the ProxyAdmin contract.',
    ),
    {
      name: 'Oracles',
      description:
        'Accounts permitted to sign the message coming from other chain. Currently at least 8 of them are need to sign the message.',
      accounts: discovery.getPermissionedAccounts(
        'SignatureVerifier',
        'oracles',
      ),
    },
  ],
}
