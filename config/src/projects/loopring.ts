import { Project } from './Project'

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
  details: {
    website: 'https://loopring.org',
    color: '#1c42ff',
    technology: {
      name: 'zk-rollup',
      details: 'zk-SNARK',
    },
    purpose: 'Payments, Exchange',
    associatedToken: 'LRC',
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
          'https://github.com/Loopring/protocols/blob/bbcebc4848b4a1c5ba8264a2d601de5f8183b5aa/packages/loopring_v3/contracts/core/impl/ExchangeV3.sol#L340',
        ],
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
        tooltip: 'If operator goes dark users can still exit the rollup',
        pointers: [
          'https://github.com/Loopring/protocols/blob/adc95a13ab4d84ff50a99f601ba1c6b5add7e411/packages/loopring_v3/DESIGN.md#forced-request-handling',
          'https://github.com/Loopring/protocols/blob/adc95a13ab4d84ff50a99f601ba1c6b5add7e411/packages/loopring_v3/DESIGN.md#withdrawal-mode',
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
