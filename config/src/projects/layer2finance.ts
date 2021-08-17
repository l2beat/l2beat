import { RISK, TECHNOLOGY } from './common'
import { Project } from './types'

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
    links: {
      websites: ['https://layer2.finance/'],
      apps: ['https://app.l2.finance/'],
      documentation: ['https://docs.l2.finance/'],
      explorers: [],
      repositories: [
        'https://github.com/celer-network/layer2-finance-contracts',
      ],
      socialMedia: [
        'https://discord.gg/uGx4fjQ',
        'https://t.me/celernetwork',
        'https://twitter.com/CelerNetwork',
      ],
    },
    technologyName: 'Optimistic Rollup',
    technologyDetails: 'Specialized Optimistic Rollup',
    purpose: 'DeFi aggregation',
    riskView: {
      stateValidation: RISK.STATE_FP_1R, // TODO: verify that it actually is 1R
      dataAvailability: RISK.DATA_ON_CHAIN,
      upgradeability: RISK.UNKNOWN, // TODO: find out
      operatorCensoring: RISK.CENSORING_NO_MECHANISM,
      operatorDown: RISK.DOWN_NO_MECHANISM,
    },
    technology: {
      category: {
        name: 'Optimistic Rollup',
        references: [],
      },
      stateCorrectness: {
        ...TECHNOLOGY.FRAUD_PROOFS,
        description:
          TECHNOLOGY.FRAUD_PROOFS.description +
          ' Unfortunately in case of Layer2.Finance only some fraud proofs revert blocks and every successful fraud proof pauses the contract requiring the owner to unpause.',
        risks: [
          {
            category: 'Funds can be frozen if',
            text: 'the problematic fraud proof mechanism is exploited.',
          },
        ],
        references: [
          {
            text: 'Which L2 scaling paradigm is Layer2.Finance using - Layer2.Finance FAQ',
            href: 'https://docs.l2.finance/#/faq?id=which-l2-scaling-paradigm-is-layer2finance-using',
          },
          {
            text: 'RollupChain.sol#L441 - Layer2.Finance source code',
            href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L441',
          },
          {
            text: 'RollupChain.sol#L605 - Layer2.Finance source code',
            href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L605',
          },
        ],
      },
      dataAvailability: {
        ...TECHNOLOGY.ON_CHAIN_DATA,
        references: [
          {
            text: 'RollupChain.sol#L191 - Layer2.Finance source code',
            href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L191',
          },
        ],
      },
      operator: {
        name: 'The sequencer is centralized',
        description:
          'Currently only a single block producer is allowed to submit blocks.',
        risks: [
          {
            category: 'Funds can be frozen if',
            text: 'the sequencer halts its operations.',
          },
        ],
        references: [
          {
            text: 'RollupChain.sol#L191 - Layer2.Finance source code',
            href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L191',
          },
          {
            text: 'Layer2.finance - Celer Network blog',
            href: 'https://blog.celer.network/2021/02/18/layer2-finance-get-defi-mass-adoption-today-scaling-layer-1-defi-in-place-with-zero-migration/',
          },
        ],
      },
      forceTransactions: {
        name: 'There is no force transaction mechanism',
        description:
          'If the users find themselves censored they can do nothing to force the inclusion of their transactions.',
        risks: [
          {
            category: 'Users can be censored if',
            text: 'the sequencer refuses to include their transactions.',
          },
        ],
        references: [
          {
            text: 'RollupChain.sol#L191 - Layer2.Finance source code',
            href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L191',
          },
        ],
      },
      exitMechanisms: [
        {
          name: 'Regular Exit',
          description:
            'The user initiates a withdrawal by submitting a L2 transaction. Because the system is an optimistic rollup this transaction has to be included in a block and finalized which can take several hours. There is no emergency exit mechanism so users have to rely on the honesty of the operators to let them leave.',
          risks: [
            {
              category: 'Funds can be stolen if',
              text: 'the users are prevented from leaving the system.',
            },
          ],
          references: [
            {
              text: 'RollupChain.sol#L191 - Layer2.Finance source code',
              href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L191',
            },
          ],
        },
      ],
      contracts: {
        addresses: [
          // what are the contract addresses?
        ],
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'the owner calls owner-only functions that pause the contract and drain funds.',
            references: [
              {
                text: 'RollupChain.sol#L460-L496 - Layer2.Finance source code',
                href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L460-L496',
              },
            ],
          },
        ],
      },
    },
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
          {
            name: 'RollupChain.sol#L483 - Layer2.Finance source code',
            href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L483',
          },
        ],
        value: 'Yes',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only operator can produce new blocks',
        pointers: [
          {
            name: 'RollupChain.sol#L191 - Layer2.Finance source code',
            href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L191',
          },
        ],
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
        tooltip:
          'Operator is required to include user deposit and balance sync TXs into the rollup',
        pointers: [
          {
            name: 'RollupChain.sol#L441 - Layer2.Finance source code',
            href: 'https://github.com/celer-network/layer2-finance-contracts/blob/61ed0f17a15e8ba06778776ade1a82956a9de842/contracts/RollupChain.sol#L441',
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
        date: '2021-04-22',
        name: 'The layer2.finance v0.1 Mainnet Launches: Democratize DeFi, Simple and Zero Fees',
        link: 'https://blog.celer.network/2021/04/22/the-layer2-finance-v0-1-mainnet-launches-democratize-defi-simple-and-zero-fees',
      },
    ],
  },
}
