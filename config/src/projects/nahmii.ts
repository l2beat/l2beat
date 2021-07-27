import { Project } from './Project'

export const nahmii: Project = {
  name: 'Nahmii 1.0',
  slug: 'nahmii',
  bridges: [
    {
      address: '0xCc8D82f6ba952966E63001c7B320EEF2Ae729099',
      sinceBlock: 6921581,
      tokens: ['NII'],
    },
  ],
  details: {
    links: {
      websites: ['https://nahmii.io/'],
      apps: [],
      documentation: [
        'https://www.nahmii.io/public/file/nahmii.White.Paper.v2.0.pdf',
      ],
      explorers: [],
      repositories: ['https://github.com/hubiinetwork/nahmii-contracts'],
      socialMedia: [
        'https://blog.nahmii.io/',
        'https://twitter.com/nahmii_io',
        'https://t.me/nahmii',
        'https://discord.gg/GKTsUTH',
      ],
    },
    technology: {
      name: 'State Pools',
      details: 'User carried state, pooled security model',
    },
    purpose: 'Payments',
    associatedToken: 'NII',
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
        tooltip:
          'Operated by Nahmii foundation. All transactions require signature from the Operator.',
        sentiment: 'bad',
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
        value: 'Off Chain.',
        tooltip:
          'Nahmii uses a Data Availability Oracle. The Oracle is a game theory-based distributed intelligence tool that continually tests statements related to data availability.',
      },
      {
        name: 'Mass Exit',
        value: 'Solved via checkpoints and lack of time restrictions.',
      },
      {
        name: 'Source Code',
        value:
          'The Nahmii 1.0 smart contracts are publicly available on Github and open source.',
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
        sentiment: 'neutral',
      },
      {
        name: 'Exit Mechanism',
        value: 'Trustless',
        tooltip:
          'Users submit exit requests and wait 5 days for the possibility of someone challenging that request',
        sentiment: 'good',
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
        {
          name: 'Nahmii 1.0 Whitepaper',
          href: 'https://nahmii.github.io/assets/doc/nahmii-1-whitepaper.pdf',
        },
        {
          name: 'Nahmii 2.0 Whitepaper',
          href: 'https://www.nahmii.io/public/file/nahmii.White.Paper.v2.0.pdf',
        },
        {
          name: 'Nahmii 2.0 Testnet - Nahmii blog',
          href: 'https://blog.nahmii.io/nahmii-2-0-testnet-goes-live-integrated-with-metamask-releases-white-paper-94f61d603ed1',
        },
      ],
    },
  },
}
