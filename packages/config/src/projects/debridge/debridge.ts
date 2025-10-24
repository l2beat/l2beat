import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW, CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('debridge')

export const debridge: Bridge = {
  type: 'bridge',
  id: ProjectId('debridge'),
  addedAt: UnixTime(1673362295), // 2023-01-10T14:51:35Z
  display: {
    name: 'deBridge',
    slug: 'debridge',
    category: 'Token Bridge',
    links: {
      websites: ['https://debridge.com'],
      documentation: ['https://docs.debridge.com'],
      repositories: ['https://github.com/debridge-finance'],
      explorers: ['https://explorer.debridge.com'],
      socialMedia: [
        'https://twitter.com/deBridgeFinance',
        'https://discord.gg/debridge',
        'https://blog.debridge.finance',
        'https://reddit.com/r/debridge/',
        'https://linkedin.com/company/debridge-finance',
      ],
      bridges: ['https://app.debridge.com'],
    },
    description:
      'deBridge is an interoperability layer that enables messaging between various blockchains. For the typical token transfer, "deToken" is minted on the destination chain.',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x43dE2d77BF8027e25dBD179B491e8d64f38398aA'),
        sinceTimestamp: UnixTime(1637595390),
        tokens: [
          'USDC',
          'WETH',
          'FRAX.legacy',
          'ETH',
          'USDT',
          'WBTC',
          'DAI',
          'MATIC',
          'RAI',
        ],
        chain: 'ethereum',
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
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Tokens transferred end up as their wrapped representation (deTokens).',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'destination token contract is maliciously upgraded or not securely implemented.',
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
    destinationToken: BRIDGE_RISK_VIEW.WRAPPED,
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails(
          'DeBridgeGate',
          'The main point of cross-chain interactions, this contract allows user to send message to other chain and claim funds when bridging back to Ethereum.',
        ),
        discovery.getContractDetails(
          'SignatureVerifier',
          'Contract responsible for checking off-chain signatures performed by the oracles, currently there are needed at least 8 confirmations.',
        ),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getMultisigPermission(
          'Admin Multisig',
          'Admin for all upgradable proxy smart contracts. It can change the implementations of all proxies through the ProxyAdmin contract.',
        ),
        discovery.getPermissionDetails(
          'Oracles',
          discovery.getPermissionedAccounts('SignatureVerifier', 'oracles'),
          'Accounts permitted to sign the message coming from other chain. Currently at least 8 of them are need to sign the message.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
