import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Project } from './types'

export const loopring: Project = {
  name: 'Loopring',
  slug: 'loopring',
  bridges: [
    {
      address: '0x674bdf20A0F284D710BC40872100128e2d66Bd3f',
      sinceBlock: 11149779,
      tokens: ['DAI', 'ETH', 'LINK', 'LRC', 'MKR', 'USDC', 'USDT', 'WBTC'],
    },
  ],
  associatedToken: 'LRC',
  details: {
    description:
      "Loopring's zkRollup L2 solution aims to offer the same security guarantees as Ethereum mainnet, with a big scalability boost: throughput increased by 1000x, and cost reduced to just 0.1% of L1.",
    purpose: 'Payments, Exchange',
    links: {
      websites: ['https://loopring.org'],
      apps: ['https://exchange.loopring.io/'],
      documentation: [
        'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md',
      ],
      explorers: [],
      repositories: ['https://github.com/Loopring/protocols'],
      socialMedia: [
        'https://loopring.org/#/blog',
        'https://medium.com/loopring-protocol',
        'https://twitter.com/loopringorg',
        'https://discord.gg/KkYccYp',
        'https://youtube.com/c/loopring',
        'https://weibo.com/loopringfoundation',
        'https://reddit.com/r/loopringorg/',
        'https://loopring.substack.com/',
      ],
    },
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_SN,
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      operatorCensoring: RISK_VIEW.CENSORING_FORCE_EXIT_L1,
      operatorDown: RISK_VIEW.DOWN_ESCAPE_MP,
    },
    technology: {
      category: {
        name: 'ZK Rollup',
      },
      stateCorrectness: {
        ...STATE_CORRECTNESS.VALIDITY_PROOFS,
        references: [
          {
            text: 'Operators - Loopring design doc',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#operators',
          },
        ],
      },
      newCryptography: {
        ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
        references: [
          {
            text: 'Operators - Loopring design doc',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#operators',
          },
        ],
      },
      dataAvailability: {
        ...DATA_AVAILABILITY.ON_CHAIN,
        references: [
          {
            text: 'Introduction - Loopring design doc',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#introduction',
          },
        ],
      },
      operator: {
        ...OPERATOR.CENTRALIZED_OPERATOR,
        references: [
          {
            text: 'ExchangeV3.sol#L315-L322 - Loopring source code',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/contracts/core/impl/ExchangeV3.sol#L315-L322',
          },
          {
            text: 'LoopringIOExchangeOwner.sol#L123-L126 - Loopring source code',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/contracts/aux/access/LoopringIOExchangeOwner.sol#L123-L126',
          },
        ],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.WITHDRAW_OR_HALT,
        references: [
          {
            text: 'Forced Withdrawals - Loopring design doc',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#forced-withdrawals',
          },
          {
            text: 'Forced Request Handling - Loopring design doc',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#forced-request-handling',
          },
        ],
      },
      exitMechanisms: [
        {
          ...EXITS.REGULAR('zk', 'no proof'),
          references: [
            {
              text: 'Withdraw - Loopring design doc',
              href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#withdraw',
            },
          ],
        },
        {
          ...EXITS.FORCED,
          references: [
            {
              text: 'Forced Request Handling - Loopring design doc',
              href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#forced-request-handling',
            },
          ],
        },
        {
          ...EXITS.EMERGENCY('Withdrawal Mode', 'merkle proof'),
          references: [
            {
              text: 'Forced Request Handling - Loopring design doc',
              href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#forced-request-handling',
            },
          ],
        },
      ],
      contracts: {
        addresses: [
          {
            name: 'Exchange',
            address: '0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4',
            upgradeability: {
              type: 'ZeppelinOs',
              admin: '0xDd2A08a1c1A28c1A571E098914cA10F2877D9c97',
              implementation: '0x4fb117dcd6D09abF1a99B502d488A99F5a17e7eC',
            },
          },
          {
            name: 'DefaultDepositContract',
            address: '0x674bdf20A0F284D710BC40872100128e2d66Bd3f',
          },
          {
            name: 'Owner',
            address: '0x153CdDD727e407Cb951f728F24bEB9A5FaaA8512',
          },
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
    },
    news: [
      {
        date: '2020-08-24',
        name: 'Loopring Now Supports NFTs on L2',
        link: 'https://medium.com/loopring-protocol/loopring-now-supports-nfts-on-l2-29174a343d0d',
      },
      {
        date: '2020-08-24',
        name: 'dAMM (distributed AMM)',
        link: 'https://medium.com/loopring-protocol/damm-distributed-amm-98dcfa2b26dd',
      },
      {
        date: '2020-08-18',
        name: 'Loopring L2 Liquidity Mining: Round 13',
        link: 'https://medium.com/loopring-protocol/loopring-l2-liquidity-mining-round-13-9957aac9a21b',
      },
    ],

    // DEPRECATED ITEMS BELOW

    technologyName: 'ZK Rollup',
    technologyDetails: 'zk-SNARK',
    parameters: [
      {
        name: 'Primary use case',
        value: 'Payments, Exchange',
      },
      {
        name: 'Hypothetical level of decentralization',
        sentiment: 'good',
        value: 'High',
      },
      {
        name: 'Current level of decentralization',
        sentiment: 'good',
        value: 'High',
      },
      {
        name: 'Can funds be stolen by the operator?',
        sentiment: 'good',
        value: 'No',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only operator can produce new blocks',
        pointers: [
          {
            name: 'ExchangeV3.sol#L340 - Loopring source code',
            href: 'https://github.com/Loopring/protocols/blob/bbcebc4848b4a1c5ba8264a2d601de5f8183b5aa/packages/loopring_v3/contracts/core/impl/ExchangeV3.sol#L340',
          },
        ],
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
        tooltip: 'If operator goes dark users can still exit the rollup',
        pointers: [
          {
            name: 'Forced request handling - Loopring documentation',
            href: 'https://github.com/Loopring/protocols/blob/adc95a13ab4d84ff50a99f601ba1c6b5add7e411/packages/loopring_v3/DESIGN.md#forced-request-handling',
          },
          {
            name: 'Withdrawal mode - Loopring documentation',
            href: 'https://github.com/Loopring/protocols/blob/adc95a13ab4d84ff50a99f601ba1c6b5add7e411/packages/loopring_v3/DESIGN.md#withdrawal-mode',
          },
        ],
        value: 'Yes but only for withdrawals',
      },
      {
        name: 'Privacy',
        value: 'No',
      },
      {
        name: 'Smart contracts',
        value: 'No',
      },
    ],
  },
}
