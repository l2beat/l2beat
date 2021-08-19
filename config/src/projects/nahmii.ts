import { RISK } from './common'
import { Project } from './types'

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
  associatedToken: 'NII',
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
    technologyName: 'State Pools',
    technologyDetails: 'User carried state, pooled security model',
    purpose: 'Payments',
    riskView: {
      stateValidation: RISK.STATE_FP,
      dataAvailability: RISK.DATA_EXTERNAL_DAC,
      upgradeability: RISK.UPGRADABLE_NO,
      operatorCensoring: RISK.CENSORING_WITHDRAW_L1,
      operatorDown: RISK.DOWN_ESCAPE_U,
    },
    technology: {
      category: {
        name: 'State Pools',
        references: [],
      },
      stateCorrectness: {
        name: 'Fraud proofs ensure state correctness',
        description:
          'Because Nahmii is more similar to state channels than to any other technology fraud proofs are used to detect fraudulent as there is no state published on chain.',
        references: [],
        risks: [],
        isIncomplete: true,
      },
      dataAvailability: {
        name: 'Data is provided by a data availability oracle',
        description:
          'Nahmii uses a Data Availability Oracle. The Oracle is a game theory-based distributed intelligence tool that continually tests statements related to data availability.',
        references: [],
        risks: [],
        isIncomplete: true,
      },
      massExit: {
        name: 'Mass exit problem does not occur',
        description:
          'Nahmii claims that the mass exit problem is solved via checkpoints and lack of time restrictions.',
        references: [],
        risks: [],
        isIncomplete: true,
      },
      operator: {
        name: 'Nahmii runs the operator',
        description:
          'The system is operated by Nahmii foundation. All transactions require signature from the operator.',
        references: [],
        risks: [],
        isIncomplete: true,
      },
      forceTransactions: {
        name: 'Users can avoid censorship by exiting',
        description:
          'There is no mechanism that allows users to force any transactions. If users find themselves censored they need to exit',
        references: [],
        risks: [],
        isIncomplete: true,
      },
      exitMechanisms: [
        {
          name: 'Regular exit',
          description:
            'Users submit exit requests and wait 5 days for the possibility of someone challenging that request',
          references: [],
          risks: [],
          isIncomplete: true,
        },
      ],
      contracts: {
        addresses: [
          {
            name: 'ClientFund',
            address: '0xCc8D82f6ba952966E63001c7B320EEF2Ae729099',
          },
          {
            name: 'BalanceTracker',
            address: '0xBC1bCC29Edf605095BF4fE7A953b7C115Ecc8Cad',
          },
        ],
        risks: [],
      },
    },
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
        sentiment: 'warning',
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
