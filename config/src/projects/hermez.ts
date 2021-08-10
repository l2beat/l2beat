import { RISK } from './common/risk'
import { Project } from './types'

export const hermez: Project = {
  name: 'Hermez',
  slug: 'hermez',
  bridges: [
    {
      address: '0xA68D85dF56E733A06443306A095646317B5Fa633',
      sinceBlock: 12093596,
      tokens: ['DAI', 'ETH', 'LINK', 'UNI', 'USDC', 'USDT', 'WBTC', 'YFI'],
    },
  ],
  details: {
    links: {
      websites: ['https://hermez.io/'],
      apps: ['https://wallet.hermez.io/'],
      documentation: [
        'https://docs.hermez.io/',
        'https://hermez.io/hermez-whitepaper.pdf',
      ],
      explorers: ['https://explorer.hermez.io/'],
      repositories: [
        'https://github.com/hermeznetwork/contracts',
        'https://github.com/hermeznetwork/hermez-node',
      ],
      socialMedia: [
        'https://blog.hermez.io/',
        'https://t.me/hermez_network',
        'https://discord.gg/AczuUXDA2N',
        'https://twitter.com/hermez_network',
      ],
    },
    technology: {
      category: {
        name: 'ZK Rollup',
        references: [],
      },
      stateCorrectness: {
        name: 'Unknown state correctness',
        description: null,
        references: [],
        risks: [],
      },
      dataAvailability: {
        name: 'Unknown data availability',
        description: null,
        references: [],
        risks: [],
      },
      newCryptography: {
        name: 'Unknown new cryptography',
        description: null,
        references: [],
        risks: [],
      },
      operator: {
        name: 'Unknown operator',
        description: null,
        references: [],
        risks: [],
      },
      forceTransactions: {
        name: 'Unknown force transactions',
        description: null,
        references: [],
        risks: [],
      },
      exitMechanisms: [],
      contracts: {
        addresses: [],
        risks: [],
      },
    },
    technologyName: 'ZK Rollup',
    technologyDetails: 'zk-SNARK',
    purpose: 'Payments',
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
        value: 'Payments',
      },
      {
        name: 'Hypothetical level of decentralization',
        sentiment: 'good',
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
        tooltip:
          'Contracts are upgradable BUT on the upside there is a 7 days timelock',
        sentiment: 'warning',
        pointers: [
          {
            name: 'Bridge contract - source on Etherscan',
            href: 'https://etherscan.io/address/0xA68D85dF56E733A06443306A095646317B5Fa633#code',
          },
        ],
        value: 'Yes, through contract upgrade',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip:
          'After initial bootstraping period anyone could bid for a slot time to forge new batches and update the state root',
        pointers: [
          {
            name: 'HermezAuctionProtocol.sol#L515 - Hermez source code',
            href: 'https://github.com/hermeznetwork/contracts/blob/master/contracts/auction/HermezAuctionProtocol.sol#L515',
          },
          {
            name: 'HermezAuctionProtocol.sol#L571 - Hermez source code',
            href: 'https://github.com/hermeznetwork/contracts/blob/master/contracts/auction/HermezAuctionProtocol.sol#L571',
          },
          {
            name: 'Hermez documentation',
            href: 'https://docs.hermez.io/#/developers/protocol/consensus/consensus',
          },
        ],
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
        tooltip:
          'Transaction can be forced via smart contract. Coordinators must process them',
        pointers: [
          {
            name: 'Hermez.sol#L361 - Hermez source code',
            href: 'https://github.com/hermeznetwork/contracts/blob/master/contracts/hermez/Hermez.sol#L361',
          },
          {
            name: 'L1 user transactions - Hermez documentation',
            href: 'https://docs.hermez.io/#/developers/protocol/hermez-protocol/protocol?id=l1-user-transactions',
          },
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
        date: '2021-07-10',
        name: 'Hermez Coordinator Is Live On Testnet',
        link: 'https://blog.hermez.io/hermez-coordinator-live-on-testnet/',
      },
      {
        date: '2021-03-17',
        name: 'Hermez Network Mainnet Launch',
        link: 'https://blog.hermez.io/hermez-network-mainnet-launch/',
      },
    ],
  },
}
