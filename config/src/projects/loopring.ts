import { RISK, TECHNOLOGY } from './common'
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
    technologyName: 'ZK Rollup',
    technologyDetails: 'zk-SNARK',
    purpose: 'Payments, Exchange',
    riskView: {
      stateValidation: RISK.STATE_ZKP_SN,
      dataAvailability: RISK.DATA_ON_CHAIN,
      upgradeability: RISK.UPGRADABLE_YES,
      operatorCensoring: RISK.CENSORING_WITHDRAW_L1,
      operatorDown: RISK.DOWN_ESCAPE_MP,
    },
    technology: {
      category: {
        name: 'ZK Rollup',
        references: [],
      },
      stateCorrectness: {
        ...TECHNOLOGY.VALIDITY_PROOFS,
        references: [
          {
            text: 'Operators - Loopring design doc',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#operators',
          },
        ],
      },
      dataAvailability: {
        ...TECHNOLOGY.ON_CHAIN_DATA,
        references: [
          {
            text: 'Introduction - Loopring design doc',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#introduction',
          },
        ],
      },
      newCryptography: {
        ...TECHNOLOGY.ZK_SNARKS,
        references: [
          {
            text: 'Operators - Loopring design doc',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#operators',
          },
        ],
      },
      operator: {
        name: 'The operator is centralized.',
        description:
          'Only the owner of the exchange contract can submit new blocks. The owner itself is a specialized contract which currently only permits its owner to perform this operation.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the sequencer exploits their centralized position and frontruns user transactions.',
          },
        ],
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
        name: 'Users can avoid censorship by exiting',
        description:
          'Loopring allows users to force withdraw by submitting an L1 transaction. The system must serve it within a defined time period. If this does not happen, the system will enter withdrawal mode and every user can exit all of their assets by making a direct transaction on the Ethereum mainnet.',
        risks: [],
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
          name: 'Regular withdrawal',
          description:
            'The user initiates a withdrawal request on L2. When the block containing the request is proved on L1, the user can withdraw the funds with an L1 transaction.',
          risks: [],
          references: [],
        },
        {
          name: 'Forced withdrawal',
          description:
            'The user initiates a withdrawal request on L1. When the block containing the request is proved on L1, the user can withdraw the funds with an L1 transaction.',
          risks: [],
          references: [
            {
              text: 'Forced Request Handling - Loopring design doc',
              href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#forced-request-handling',
            },
          ],
        },
        {
          name: 'Withdrawal mode',
          description:
            'The user initiates a withdrawal request on L1. If it is not served within a predefined time period the system enters withdrawal mode in which users can withdraw by submitting merkle proofs of their funds.',
          risks: [],
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
            name: 'Owner',
            address: '0x153CdDD727e407Cb951f728F24bEB9A5FaaA8512',
          },
        ],
        risks: [],
      },
    },
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
    news: [
      {
        date: '2020-12-15',
        name: 'Shutdown of Loopring Exchange v1; Transition to v2',
        link: 'https://medium.com/loopring-protocol/shutdown-of-loopring-exchange-v1-transition-to-v2-d06cdf462548',
      },
      {
        date: '2020-12-03',
        name: 'Loopring’s zkRollup AMM is Live',
        link: 'https://medium.com/loopring-protocol/looprings-zkrollup-amm-is-live-2f8251cd0fcd',
      },
      {
        date: '2020-06-06',
        name: 'Loopring Pay is Live: zkRollup Transfers on Ethereum',
        link: 'https://medium.com/loopring-protocol/loopring-pay-is-live-zkrollup-transfers-on-ethereum-770d35213408',
      },
      {
        date: '2020-02-27',
        name: 'Loopring Launches zkRollup Exchange: Loopring.io',
        link: 'https://medium.com/loopring-protocol/loopring-launches-zkrollup-exchange-loopring-io-d6a85beeed21',
      },
    ],
  },
}
