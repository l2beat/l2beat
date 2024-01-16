import { Meta, StoryObj } from '@storybook/react'

import { ScalingActivityView } from './ScalingActivityView'

const meta: Meta<typeof ScalingActivityView> = {
  title: 'Pages/Scaling/ActivityView',
  component: ScalingActivityView,
}
export default meta
type Story = StoryObj<typeof ScalingActivityView>

export const Primary: Story = {
  args: {
    items: [
      {
        name: 'zkSync Era',
        shortName: undefined,
        slug: 'zksync-era',
        category: 'ZK Rollup',
        provider: 'ZK Stack',
        warning:
          'Withdrawals are delayed by 21h. The length of the delay can be arbitrarily set by a MultiSig.',
        redWarning: undefined,
        purposes: ['Universal'],
        isVerified: true,
        showProjectUnderReview: false,
        dataSource: 'Blockchain RPC',
        stage: {
          stage: 'Stage 0',
          missing: {
            nextStage: 'Stage 1',
            requirements: [
              "Users' withdrawals can be censored by the permissioned operators.",
              'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
            ],
          },
          summary: [
            {
              stage: 'Stage 0',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project calls itself a rollup.',
                },
                {
                  satisfied: true,
                  description: 'L2 state roots are posted to Ethereum L1.',
                },
                {
                  satisfied: true,
                  description:
                    'Inputs for the state transition function are posted to L1.',
                },
                {
                  satisfied: true,
                  description:
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/matter-labs/zksync-era)',
                },
              ],
            },
            {
              stage: 'Stage 1',
              requirements: [
                {
                  satisfied: true,
                  description:
                    'A complete and functional proof system is deployed.',
                },
                {
                  satisfied: false,
                  description:
                    "Users' withdrawals can be censored by the permissioned operators.",
                },
                {
                  satisfied: false,
                  description:
                    'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
                },
              ],
            },
            {
              stage: 'Stage 2',
              requirements: [
                {
                  satisfied: false,
                  description:
                    'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
                },
              ],
            },
          ],
          message: undefined,
        },
        data: {
          tpsDaily: 16.043773148148148,
          tpsWeeklyChange: '-7.51%',
          transactionsMonthlyCount: 40218354,
          maxTps: 62.070844907407405,
          maxTpsDate: '2023 Dec 16',
        },
      },
      {
        name: 'Ethereum',
        shortName: undefined,
        slug: 'ethereum',
        dataSource: 'Blockchain RPC',
        category: undefined,
        provider: undefined,
        purposes: undefined,
        warning: undefined,
        redWarning: undefined,
        isVerified: undefined,
        showProjectUnderReview: undefined,
        stage: undefined,
        data: {
          tpsDaily: 13.358009259259259,
          tpsWeeklyChange: '+7.51%',
          transactionsMonthlyCount: 34834145,
          maxTps: 22.698425925925925,
          maxTpsDate: '2024 Jan 14',
        },
      },
      {
        name: 'Mantle',
        shortName: undefined,
        slug: 'mantle',
        category: 'Optimium',
        provider: 'OVM',
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        redWarning: undefined,
        purposes: ['Universal'],
        isVerified: true,
        showProjectUnderReview: false,
        dataSource: 'Blockchain RPC',
        stage: { stage: 'NotApplicable' },
        data: {
          tpsDaily: 11.364421296296296,
          tpsWeeklyChange: '+112.09%',
          transactionsMonthlyCount: 20485442,
          maxTps: 25.47474537037037,
          maxTpsDate: '2023 Dec 27',
        },
      },
      {
        name: 'Arbitrum One',
        shortName: undefined,
        slug: 'arbitrum',
        category: 'Optimistic Rollup',
        provider: 'Arbitrum',
        warning:
          'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
        redWarning: undefined,
        purposes: ['Universal'],
        isVerified: true,
        showProjectUnderReview: false,
        dataSource: 'Blockchain RPC',
        stage: {
          stage: 'Stage 1',
          missing: {
            nextStage: 'Stage 2',
            requirements: [
              'Fraud proof submission is open only to whitelisted actors.',
              'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
              "The Security Council's actions are not confined to on-chain provable bugs.",
            ],
          },
          summary: [
            {
              stage: 'Stage 0',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project calls itself a rollup.',
                },
                {
                  satisfied: true,
                  description: 'L2 state roots are posted to Ethereum L1.',
                },
                {
                  satisfied: true,
                  description:
                    'Inputs for the state transition function are posted to L1.',
                },
                {
                  satisfied: true,
                  description:
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/OffchainLabs/nitro/)',
                },
              ],
            },
            {
              stage: 'Stage 1',
              requirements: [
                {
                  satisfied: true,
                  description:
                    'A complete and functional proof system is deployed.',
                },
                {
                  satisfied: true,
                  description:
                    'There are at least 5 external actors who can submit fraud proofs.',
                },
                {
                  satisfied: true,
                  description:
                    'Users are able to exit without the help of the permissioned operators.',
                },
                {
                  satisfied: true,
                  description:
                    'In case of an unwanted upgrade by actors more centralized than a Security Council, users have at least 7d to exit.',
                },
                {
                  satisfied: true,
                  description: 'The Security Council is properly set up.',
                },
              ],
            },
            {
              stage: 'Stage 2',
              requirements: [
                {
                  satisfied: false,
                  description:
                    'Fraud proof submission is open only to whitelisted actors.',
                },
                {
                  satisfied: false,
                  description:
                    'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
                },
                {
                  satisfied: false,
                  description:
                    "The Security Council's actions are not confined to on-chain provable bugs.",
                },
              ],
            },
          ],
          message: undefined,
        },
        data: {
          tpsDaily: 8.353796296296297,
          tpsWeeklyChange: '-25.86%',
          transactionsMonthlyCount: 30307132,
          maxTps: 58.97100694444445,
          maxTpsDate: '2023 Dec 16',
        },
      },

      {
        name: 'ZKSpace',
        shortName: undefined,
        slug: 'zkspace',
        category: 'ZK Rollup',
        provider: 'zkSync Lite',
        warning: undefined,
        redWarning: undefined,
        purposes: ['NFT', 'AMM', 'Payments'],
        isVerified: true,
        showProjectUnderReview: false,
        dataSource: undefined,
        stage: {
          stage: 'Stage 0',
          missing: {
            nextStage: 'Stage 1',
            requirements: [
              'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
            ],
          },
          summary: [
            {
              stage: 'Stage 0',
              requirements: [
                {
                  satisfied: true,
                  description: 'The project calls itself a rollup.',
                },
                {
                  satisfied: true,
                  description: 'L2 state roots are posted to Ethereum L1.',
                },
                {
                  satisfied: true,
                  description:
                    'Inputs for the state transition function are posted to L1.',
                },
                {
                  satisfied: false,
                  description:
                    'No source-available node exists that can recreate the state from L1 data.',
                },
              ],
            },
            {
              stage: 'Stage 1',
              requirements: [
                {
                  satisfied: true,
                  description:
                    'A complete and functional proof system is deployed.',
                },
                {
                  satisfied: true,
                  description:
                    'Users are able to exit without the help of the permissioned operators.',
                },
                {
                  satisfied: false,
                  description:
                    'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
                },
              ],
            },
            {
              stage: 'Stage 2',
              requirements: [
                {
                  satisfied: false,
                  description:
                    'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
                },
              ],
            },
          ],
          message: {
            type: 'warning',
            text: 'There is no available node software that can reconstruct the state from L1 data, hence there is no way to verify that this system is a rollup.',
          },
        },
        data: undefined,
      },
    ],
  },
}
