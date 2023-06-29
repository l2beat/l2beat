import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, NUGGETS } from '../layer2s'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('hyphen')

export const hyphen: Bridge = {
  type: 'bridge',
  id: ProjectId('hyphen'),
  display: {
    name: 'Hyphen',
    slug: 'hyphen',
    category: 'Liquidity Network',
    links: {
      websites: ['https://hyphen.biconomy.io/'],
      documentation: [
        'https://docs.biconomy.io/products/hyphen-instant-cross-chain-transfers',
      ],
      explorers: ['https://hyphen-stats.biconomy.io/'],
      repositories: ['https://github.com/bcnmy'],
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
        sinceTimestamp: new UnixTime(1647128990),
        tokens: ['ETH', 'USDC', 'USDT', 'MATIC', 'BICO'],
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
          isCritical: true,
        },
        {
          category: 'Users can be censored if',
          text: "the Executors don't act on deposits from selected users.",
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: "an Executor asks LiquidityPool to release funds to a user that hasn't made any corresponding deposit on other chain.",
          isCritical: true,
        },
        {
          category: 'Funds can be frozen if',
          text: "there's insufficient liquidity of requested token in the destination LiquidityPool.",
        },
        {
          category: 'Funds can be frozen if',
          text: "one of the contracts is paused by it's owner.",
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
    sourceUpgradeability: {
      value: 'Yes',
      description: 'Contracts can be upgraded.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.CANONICAL,
  },
  contracts: {
    addresses: [
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
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      name: 'ProxyAdmin owner',
      description:
        'Can upgrade implementation of LiquidityPool, TokenManager and LiquidityProviders.',
      accounts: [discovery.getPermissionedAccount('ProxyAdmin', 'owner')],
    },
    {
      name: 'Owner of LiquidityPool, TokenManager, LiquidityProviders and ExecutorManager',
      description:
        'Can pause contracts, change configuration and change proxy admin or update Executor list.',
      accounts: [discovery.getPermissionedAccount('LiquidityPool', 'owner')],
    },
    {
      name: 'Executors',
      description: 'Executor is able to release funds from LiquidityPool.',
      accounts: discovery.getPermissionedAccounts(
        'ExecutorManager',
        'getAllExecutors',
      ),
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Hyphen deep dive',
      url: 'https://li.fi/knowledge-hub/biconomys-hyphen-a-deep-dive/',
      thumbnail: NUGGETS.THUMBNAILS.LIFI_01,
    },
  ],
}
