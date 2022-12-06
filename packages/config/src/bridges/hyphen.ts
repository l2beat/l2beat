import { ProjectId, UnixTime } from '@l2beat/types'

import { CONTRACTS } from '../layer2s'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const hyphen: Bridge = {
  type: 'bridge',
  id: ProjectId('hyphen'),
  display: {
    name: 'Hyphen',
    slug: 'hyphen',
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
        address: '0x2A5c2568b10A0E826BfA892Cf21BA7218310180b',
        sinceTimestamp: new UnixTime(1647128990),
        tokens: ['ETH', 'USDC', 'USDT', 'MATIC', 'BICO'],
      },
    ],
  },
  technology: {
    category: 'Liquidity Network',
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
      {
        name: 'LiquidityPool',
        address: '0x2A5c2568b10A0E826BfA892Cf21BA7218310180b',
        upgradeability: {
          type: 'EIP1967',
          implementation: '0x256415A1f9468E5405abdAfD9B76c4f24451d7E7',
          admin: '0x13a4cC0750296bB72Eb0006febec306551A4f472',
        },
      },
      {
        name: 'TokenManager',
        address: '0xe6dbf5861ed9828594Af4C6ea6356411c3A0B168',
        description: 'Configures limits and other aspects of supported assets.',
        upgradeability: {
          type: 'EIP1967',
          implementation: '0x79E559AC5b499A5676e28f0074e29763F6c2A27e',
          admin: '0x13a4cC0750296bB72Eb0006febec306551A4f472',
        },
      },
      {
        name: 'ExecutorManager',
        address: '0xbd761D917fB77381B4398Bda89C7F0d9A2BD1399',
        description: 'Manages a list of addresses with Executor role.',
      },
      {
        name: 'LiquidityProviders',
        address: '0xebaB24F13de55789eC1F3fFe99A285754e15F7b9',
        description:
          'Liquidity pool logic (not escrow - funds are sent to LiquitityPool).',
        upgradeability: {
          type: 'EIP1967',
          implementation: '0x52a592fFE0377b351c8FD99189e5333ec362d66A',
          admin: '0x13a4cC0750296bB72Eb0006febec306551A4f472',
        },
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      name: 'ProxyAdmin',
      description:
        'EIP1967 admin of LiquidityPool, TokenManager and LiquidityProviders.',
      accounts: [
        {
          address: '0x13a4cC0750296bB72Eb0006febec306551A4f472',
          type: 'Contract',
        },
      ],
    },
    {
      name: 'Owner of ProxyAdmin',
      description:
        'Can upgrade implementation of LiquidityPool, TokenManager and LiquidityProviders.',
      accounts: [
        {
          address: '0x129443cA2a9Dec2020808a2868b38dDA457eaCC7',
          type: 'EOA',
        },
      ],
    },
    {
      name: 'Owner of LiquidityPool, TokenManager, LiquidityProviders and ExecutorManager',
      description:
        'Can pause contracts, change configuration and change proxy admin or update Executor list.',
      accounts: [
        {
          address: '0xD76b82204BE75Ab9610B04CF27c4F4a34291D5E6',
          type: 'EOA',
        },
      ],
    },
    {
      name: 'Executors',
      description: 'Executor is able to release funds from LiquidityPool.',
      accounts: [
        {
          address: '0xEEFD474e80B6CAEA43F212D964409c473684E3fe',
          type: 'EOA',
        },
        {
          address: '0x1439eDA7f9A911b9120E9A0DAfb60eAE317F7685',
          type: 'EOA',
        },
        {
          address: '0x4Fb5dF81b644e3Bd5Ad0BA07DCE2B67559C764E0',
          type: 'EOA',
        },
        {
          address: '0x600Be30999eB256F2BEf451b69950f7dC84aC6b1',
          type: 'EOA',
        },
      ],
    },
  ],
}
