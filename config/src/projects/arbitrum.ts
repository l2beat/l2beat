import {
  DATA_AVAILABILITY,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Project } from './types'

export const arbitrum: Project = {
  name: 'Arbitrum',
  slug: 'arbitrum',
  bridges: [
    {
      address: '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
      sinceBlock: 12525700,
      tokens: ['ETH'],
    },
  ],
  details: {
    warning: 'Arbitrum is currently only open to whitelisted developers.',
    description:
      'Arbitrum is an Optimistic Rollup that aims to feel exactly like interacting with Ethereum, but with transactions costing a fraction of what they do on L1.',
    purpose: 'Universal',
    links: {
      websites: ['https://arbitrum.io/', 'https://offchainlabs.com/'],
      apps: [],
      documentation: ['https://developer.offchainlabs.com/'],
      explorers: ['https://explorer.arbitrum.io/'],
      repositories: [
        'https://github.com/OffchainLabs/arbitrum',
        'https://github.com/OffchainLabs/arb-os',
      ],
      socialMedia: [
        'https://twitter.com/OffchainLabs',
        'https://twitter.com/arbitrum',
        'https://medium.com/offchainlabs',
        'https://discord.gg/5KE54JwyTs',
      ],
    },
    riskView: {
      stateValidation: RISK_VIEW.STATE_FP_INT,
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      operatorCensoring: RISK_VIEW.CENSORING_TRANSACT_L1,
      operatorDown: RISK_VIEW.DOWN_PROPOSE_BLOCKS,
    },
    technology: {
      category: {
        name: 'Optimistic Rollup',
      },
      stateCorrectness: {
        ...STATE_CORRECTNESS.FRAUD_PROOFS,
        references: [
          {
            text: 'Executing and Securing the Chain - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/rollup_basics#executing-and-securing-the-chain',
          },
        ],
      },
      dataAvailability: {
        ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
        references: [
          {
            text: 'Submitting Transactions - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/rollup_basics#submitting-transactions',
          },
        ],
      },
      operator: {
        ...OPERATOR.CENTRALIZED_SEQUENCER,
        references: [
          {
            text: 'Validators - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/inside_arbitrum#validators',
          },
          {
            text: 'If the sequencer is malicious - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/inside_arbitrum#if-the-sequencer-is-malicious',
          },
        ],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
        references: [
          {
            text: 'Submitting Transactions - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/rollup_basics#submitting-transactions',
          },
        ],
      },
      exitMechanisms: [
        {
          name: 'Regular Exit',
          description:
            'When a user initiates a withdrawal it is processed as a L2 to L1 message. Because Arbitrum is an optimistic rollup this transaction has to be included in a block and finalized. This takes several days to happen after which the funds can be withdrawn on L1.',
          risks: [],
          references: [
            {
              text: 'Rules for Confirming or Rejecting Rollup Blocks - Arbitrum documentation',
              href: 'https://developer.offchainlabs.com/docs/inside_arbitrum#rules-for-confirming-or-rejecting-rollup-blocks',
            },
          ],
        },
        {
          name: 'Tradeable Bridge Exit',
          description:
            "When a user initiates a regular withdrawal a third party verifying the chain can offer to buy this withdrawal by paying the user on L1. This is implemented as a first party functionality inside Arbitrum's token bridge.",
          risks: [],
          references: [
            {
              text: 'Tradeable Bridge Exits - Arbitrum documentation',
              href: 'https://developer.offchainlabs.com/docs/withdrawals#tradeable-bridge-exits',
            },
          ],
        },
      ],
      smartContracts: {
        name: 'EVM compatible smart contracts are supported',
        description:
          'Arbitrum uses the Arbitrum Virtual Machine (AVM) to execute transactions. This is similar to the EVM, but is independent from it and allows fraud proofs to be executed.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'there are mistakes in the highly complex AVM implementation.',
          },
        ],
        references: [
          {
            text: 'AVM - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/inside_arbitrum#avm-the-arbitrum-virtual-machine',
          },
        ],
      },
      contracts: {
        addresses: [
          {
            address: '0x171a2624302775eF943f4f62E76fd22A6813d7c4',
            name: 'ProxyAdmin',
            description:
              'Through this contract all other contracts can change their code. It is owned by a single private key',
          },
          {
            address: '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
            name: 'Bridge',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x171a2624302775eF943f4f62E76fd22A6813d7c4',
              implementation: '0xCB0DA32914A683286Ed2D4890E8157fFecc9bd06',
            },
          },
          {
            address: '0xc8C3194eD3BE7B2393fEfE811a2Cc39297442c0B',
            name: 'RollupEventBridge',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x171a2624302775eF943f4f62E76fd22A6813d7c4',
              implementation: '0x5c7355e46D5486583a1CC211701e25004231D9dd',
            },
          },
          {
            address: '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
            name: 'Inbox',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x171a2624302775eF943f4f62E76fd22A6813d7c4',
              implementation: '0xB38634F1192fd4A4864b99a4C9100339815c6450',
            },
          },
          {
            address: '0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a',
            name: 'Outbox',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x171a2624302775eF943f4f62E76fd22A6813d7c4',
              implementation: '0x19D6ddDC21503F4C8cD62Ce2A9FF94Bd590b49B0',
            },
          },
          {
            address: '0xC12BA48c781F6e392B49Db2E25Cd0c28cD77531A',
            name: 'Rollup',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x171a2624302775eF943f4f62E76fd22A6813d7c4',
              implementation: '0xAE71755B42D1EF5Fb365Aeb4A74CB73992dd9fBE',
            },
          },
        ],
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'the contract owner pushes a malicious code upgrade. There is no delay on code upgrades.',
          },
          {
            category: 'Funds can be stolen if',
            text: 'the single private key controlling the system is compromised.',
          },
        ],
      },
    },
    news: [
      {
        date: '2021-05-12',
        name: 'Wen Arbitrum?',
        link: 'https://medium.com/offchainlabs/wen-arbitrum-634969c14713',
      },
      {
        date: '2020-05-01',
        name: 'Arbitrum Rollup Protocol',
        link: 'https://developer.offchainlabs.com/docs/rollup_protocol',
      },
      {
        date: '2020-10-14',
        name: 'Arbitrum Rollup Testnet: full-featured and open to all',
        link: 'https://medium.com/offchainlabs/arbitrum-rollup-testnet-full-featured-and-open-to-all-da3255b562ea',
      },
    ],

    // DEPRECATED ITEMS BELOW

    technologyName: 'Optimistic Rollup',
    technologyDetails: 'Arbitrum Virtual Machine',
    parameters: [
      {
        name: 'Primary use case',
        value: 'Universal',
      },
      {
        name: 'Hypothetical level of decentralization',
        sentiment: 'good',
        value: 'High',
      },
      {
        name: 'Current level of decentralization',
        value: 'Low',
        tooltip: 'Contracts are upgradable',
        sentiment: 'bad',
      },
      {
        name: 'Can funds be stolen by the operator?',
        value: 'Yes, through contract upgrade',
        tooltip: 'Contracts are upgradable',
        sentiment: 'warning',
      },
      {
        name: 'Permissionless?',
        value: 'No',
        sentiment: 'bad',
        tooltip:
          'There currently exists a whitelist for using the rollup. All operations have the onlyWhitelisted modifier.',
        pointers: [
          {
            name: 'Inbox proxy - source on Etherscan',
            href: 'https://etherscan.io/address/0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f#code',
          },
          {
            name: 'Inbox implementation - source on Etherscan',
            href: 'https://etherscan.io/address/0xb38634f1192fd4a4864b99a4c9100339815c6450#code#F1#L28',
          },
        ],
      },
      {
        name: 'Force TX mechanism?',
        value: 'Yes',
        sentiment: 'good',
        tooltip: 'Any transaction can be submitted directly on L1.',
        pointers: [
          {
            name: 'Aggregating Transactions - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/rollup_basics#aggregating-transactions',
          },
        ],
      },
      {
        name: 'Privacy',
        value: 'No',
      },
      {
        name: 'Smart contracts',
        value: 'Yes',
        tooltip: 'Automatic EVM -> AVM translation happens under the hood.',
      },
    ],
  },
}
