import { RISK } from './common/risk'
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
      stateCorrectness: RISK.SNARK_PROOFS,
      dataAvailability: RISK.UNKNOWN,
      censorshipResistance: RISK.UNKNOWN,
      upgradeability: RISK.UNKNOWN,
      owner: RISK.UNKNOWN,
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
