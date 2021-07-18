import { Project } from './Project'

export const dydx: Project = {
  name: 'dYdX',
  slug: 'dydx',
  bridges: [
    {
      address: '0xD54f502e184B6B739d7D27a6410a67dc462D69c8',
      sinceBlock: 11834295,
      tokens: ['USDC'],
    },
  ],
  details: {
    website: 'https://dydx.exchange/',
    color: '#6966ff',
    technology: {
      name: 'zk-rollup',
      details: 'zk-STARK/StarkExchange',
    },
    purpose: 'Token exchange',
    parameters: [
      {
        name: 'Primary use case',
        value: 'DEX',
      },
      {
        name: 'Hypothetical level of decentralization',
        value: 'High',
      },
      {
        name: 'Current level of decentralization',
        tooltip: 'Contracts are upgradable',
        sentiment: 'bad',
        value: 'Low',
      },
      {
        name: 'Can funds be stolen by the operator?',
        tooltip: 'Contracts are upgradable',
        sentiment: 'neutral',
        pointers: [
          'https://etherscan.io/address/0xD54f502e184B6B739d7D27a6410a67dc462D69c8#code',
        ],
        value: 'Yes, through contract upgrade',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only dydx can produce new blocks',
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
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
        date: '2021-04-06',
        name: 'Trade now on Layer 2',
        link: 'https://dydx.exchange/blog/public',
      },
      {
        date: '2020-08-18',
        name: 'Scaling dYdX with StarkWare',
        link: 'https://dydx.exchange/blog/public',
      },
      {
        date: '2020-04-20',
        name: 'dYdX Launches BTC Perpetual Contract Market',
        link: 'https://medium.com/dydxderivatives/dydx-launches-btc-perpetual-contract-market-68f59b193f7e',
      },
    ],
  },
}
