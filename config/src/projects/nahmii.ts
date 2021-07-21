import { Project } from './Project'

export const nahmii: Project = {
  name: 'Nahmii 1.0',
  slug: 'nahmii',
  bridges: [
    {
      address: '0xcc8d82f6ba952966e63001c7b320eef2ae729099',
      sinceBlock: 6921581,
      tokens: ['NII', 'WETH', 'USDC', 'USDT'],
    },
  ],
  details: {
    website: 'https://nahmii.io/',
    color: '#DC398C',
    technology: {
      name: 'state-pools',
      details: 'User carried state, pooled security model',
    },
    purpose: 'Payments',
    parameters: [
      {
        name: 'Primary use case',
        value: 'Payments',
      },
      {
        name: 'Hypothetical level of decentralization',
        value: 'High',
        sentiment: 'good',
      },
      {
        name: 'Current level of decentralization',
        value: 'Low',
        tooltip: 'Single operator.',
        sentiment: 'neutral',
      },
      {
        name: 'Can funds be stolen by the operator?',
        value: 'No',
        tooltip:
          'Users can safely exit to L1 even if the operator is malicious.',
        sentiment: 'good',
      },
      {
        name: 'State Correctness',
        value: 'Fraud Proofs.',
      },
      {
        name: 'Data Availability',
        value: 'Off Chain. Nahmii uses a Data Availability Oracle. The Oracle is a game theory-based distributed intelligence tool that continually tests statements related to data availability.',
      },
      {
        name: 'Mass Exit',
        value: 'Solved via checkpoints and lack of time restrictions.',
      },
      {
        name: 'Source Code',
        value: 'The Nahmii 1.0 smart contracts are publicly available on Github and open source.',
        pointers: [
          'https://github.com/hubiinetwork/nahmii-contracts',
        ],
      },
      {
        name: 'Privacy',
        value: 'No additional privacy compared to L1.',
      },
      {
        name: 'Sequencer',
        value: 'Centralized for Nahmii 1.0.',
      },
      {
        name: 'Force Transactions',
        value: 'Not a design goal for Nahmii 1.0.',
      },
      {
        name: 'Exit Mechanism',
        value: 'Nahmii 1.0 has a 5 day settlement period.',
      },
    ],
    news: [
      {
        date: '2021-05-11',
        name: 'DARMA Capital Bets $3M on Scalable DeFi Exchange With Settlement Finality',
        link: 'https://www.coindesk.com/darma-capital-bets-3m-on-scalable-defi-exchange-with-settlement-finality/',
      },
    ],
    notes: {
      text: 'Nahmii 1.0 is live on Ethereum mainnet and targets payments. Nahmii 2.0 is a generalized L2 scaling solution with smart contract support that has a public testnet available.',
      pointers: [
        'https://www.nahmii.io/public/file/nahmii.White.Paper.v2.0.pdf',
        'https://blog.nahmii.io/nahmii-2-0-testnet-goes-live-integrated-with-metamask-releases-white-paper-94f61d603ed1',
      ],
    },
  },
}
