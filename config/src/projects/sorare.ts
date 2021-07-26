import { Project } from './Project'

export const sorare: Project = {
  name: 'Sorare',
  slug: 'sorare',
  bridges: [
    {
      address: '0xF5C9F957705bea56a7e806943f98F7777B995826',
      sinceBlock: 12831579,
      tokens: ['ETH'],
    },
  ],
  details: {
    website: 'https://sorare.com/',
    color: '#000000', // this is unused
    technology: {
      name: 'validium',
      details: 'zk-STARK/StarkExchange',
    },
    purpose: 'NFT, Exchange',
    parameters: [
      {
        name: 'Primary use case',
        value: 'NFT, Exchange',
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
          'https://etherscan.io/address/0xF5C9F957705bea56a7e806943f98F7777B995826#code',
        ],
        value: 'Yes, through contract upgrade',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only Sorare can produce new blocks',
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
        date: '2021-07-19',
        name: 'Scaling Solution Incoming',
        link: 'https://www.reddit.com/r/Sorare/comments/onjrn9/scaling_solution_incoming_wednesday/',
      },
    ],
  },
}
