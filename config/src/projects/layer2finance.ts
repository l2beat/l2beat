import { Project } from './Project'

export const layer2finance: Project = {
  name: 'Layer2.Finance',
  slug: 'layer2finance',
  bridges: [
    {
      address: '0xf86FD6735f88d5b6aa709B357AD5Be22CEDf1A05',
      sinceBlock: 12283778,
      tokens: ['BUSD', 'DAI', 'USDC', 'USDT', 'WETH'],
    },
  ],
  details: {
    website: 'https://layer2.finance/',
    color: '#ca9979',
    technology: {
      name: 'optimistic-rollup',
      details: 'Specialized Optimistic Rollup',
    },
    purpose: 'DeFi aggregation',
    parameters: [
      {
        name: 'Primary use case',
        value: 'Let Layer2 users interact with DeFi protocols on Layer1',
      },
      {
        name: 'Hypothetical level of decentralization',
        sentiment: 'good',
        value: 'High',
      },
      {
        name: 'Current level of decentralization',
        tooltip: 'Has owner',
        sentiment: 'bad',
        value: 'Low',
      },
      {
        name: 'Can funds be stolen by the operator?',
        tooltip:
          'Owner can pause contract and drain funds. Owner will be transferred to governance',
        sentiment: 'bad',
        pointers: [
          'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L483',
        ],
        value: 'Yes',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only operator can produce new blocks',
        pointers: [
          'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L191',
        ],
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
        tooltip:
          'Operator is required to include user deposit and balance sync TXs into the rollup',
        pointers: [
          'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L441',
        ],
        value: 'Yes',
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
        name: 'The layer2.finance v0.1 Mainnet Launches: Democratize DeFi, Simple and Zero Fees',
        link: 'https://blog.celer.network/2021/04/22/the-layer2-finance-v0-1-mainnet-launches-democratize-defi-simple-and-zero-fees',
      },
    ],
  },
}
