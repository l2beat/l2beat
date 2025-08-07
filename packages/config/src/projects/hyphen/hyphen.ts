import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW, CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('hyphen')

export const hyphen: Bridge = {
  type: 'bridge',
  id: ProjectId('hyphen'),
  addedAt: UnixTime(1662628329), // 2022-09-08T09:12:09Z
  archivedAt: UnixTime(1753083581),
  display: {
    name: 'Hyphen',
    slug: 'hyphen',
    warning:
      'Hyphen has been decommissioned as of December 31, 2024. See the announcement [here](https://hyphen.biconomy.io).',
    category: 'Liquidity Network',
    links: {
      websites: ['https://hyphen.biconomy.io/'],
      documentation: [
        'https://docs-gasless.biconomy.io/products/hyphen-instant-cross-chain-transfers',
      ],
      explorers: ['https://hyphen-stats.biconomy.io/'],
      repositories: ['https://github.com/bcnmy/hyphen-sdk'],
      socialMedia: [
        'https://discord.gg/yuxXPqu82F',
        'https://twitter.com/biconomy',
        'https://t.me/biconomy',
        'https://medium.com/biconomy',
      ],
    },
    description:
      "Hyphen Bridge is a part of the Biconomy chain and ecosystem. It's a cross-chain bridge that uses liquidity pools to perform token swaps.",
  },
  config: {
    associatedTokens: ['BICO'],
    escrows: [
      {
        address: EthereumAddress('0x2A5c2568b10A0E826BfA892Cf21BA7218310180b'),
        sinceTimestamp: UnixTime(1647128990),
        tokens: ['ETH', 'USDC', 'USDT', 'MATIC', 'BICO'],
        chain: 'ethereum',
      },
    ],
  },
  technology: {
    destination: [
      'Polygon',
      'Avalanche',
      'Optimism',
      'BNB',
      'Arbitrum',
      'Fantom',
    ],
    principleOfOperation: {
      name: 'Principle of Operation',
      description:
        'Hyphen Bridge has LiquidityPool contracts deployed on supported chains and allows anyone to become liquidity provider within predefined limits. Cross-chain token transfer starts by a user depositing tokens to a LiquidityPool contract on the source chain with information of the requested destination chain. Funds (minus fees) are released to the user from a LiquidityPool on the destination chain via a call by an Executor, currently one of four EOAs. Separate off-chain entities called Watch Towers are responsible for watching for user deposits and notifying Executors.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Validation Method',
      description:
        'Funds can be released from LiquidityPool to any user by any Executor (currently 1 of 4 EOAs on Ethereum). User needs to trust that Executor performs this action only after validating deposit on the source chain. There are token- and blockchain-dependent limits on maximal single withdrawals.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the Watch Towers ignore deposits from selected users.',
        },
        {
          category: 'Users can be censored if',
          text: "the Executors don't act on deposits from selected users.",
        },
        {
          category: 'Funds can be stolen if',
          text: "an Executor asks LiquidityPool to release funds to a user that hasn't made any corresponding deposit on other chain.",
        },
        {
          category: 'Funds can be frozen if',
          text: "there's insufficient liquidity of requested token in the destination LiquidityPool.",
        },
        {
          category: 'Funds can be frozen if',
          text: 'one of the contracts is paused by its owner.',
        },
      ],
      isIncomplete: true,
    },
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: 'Withdrawals are validated by an EOA.',
      sentiment: 'bad',
    },
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL,
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('LiquidityPool'),
        discovery.getContractDetails(
          'TokenManager',
          'Configures limits and other aspects of supported assets.',
        ),
        discovery.getContractDetails(
          'ExecutorManager',
          'Manages a list of addresses with Executor role.',
        ),
        discovery.getContractDetails(
          'LiquidityProviders',
          'Liquidity pool logic (not escrow - funds are sent to LiquidityPool).',
        ),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'ProxyAdmin owner',
          discovery.getPermissionedAccounts('ProxyAdmin', 'owner'),
          'Can upgrade implementation of LiquidityPool, TokenManager and LiquidityProviders.',
        ),
        discovery.getPermissionDetails(
          'Owner of LiquidityPool, TokenManager, LiquidityProviders and ExecutorManager',
          discovery.getPermissionedAccounts('LiquidityPool', 'owner'),
          'Can pause contracts, change configuration and change proxy admin or update Executor list.',
        ),
        discovery.getPermissionDetails(
          'Executors',
          discovery.getPermissionedAccounts(
            'ExecutorManager',
            'getAllExecutors',
          ),
          'Executor is able to release funds from LiquidityPool.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
