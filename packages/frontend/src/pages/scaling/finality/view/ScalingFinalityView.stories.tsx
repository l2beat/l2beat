import { Meta, StoryObj } from '@storybook/react'
import { userEvent, waitFor } from '@storybook/testing-library'
import React, { useEffect } from 'react'

import { onlyDesktopModes } from '../../../../../.storybook/modes'
import { TooltipProvider } from '../../../../components/tooltip/TooltipProvider'
import { configureTooltips } from '../../../../scripts/configureTooltips'
import { ScalingLivenessView } from '../../liveness/view/ScalingLivenessView'
import { ScalingFinalityView } from './ScalingFinalityView'

const meta: Meta<typeof ScalingFinalityView> = {
  title: 'Pages/Scaling/FinalityView',
  component: ScalingFinalityView,
  args: {
    items: [
      {
        name: 'Aevo',
        shortName: undefined,
        slug: 'aevo',
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'Transaction data',
        provider: 'OP Stack',
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        redWarning: undefined,
        purposes: ['DEX'],
        stage: {
          stage: 'Stage 0',
          missing: {
            nextStage: 'Stage 1',
            requirements: [
              'The proof system is still under development.',
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
                  satisfied: false,
                  description: 'The proof system is still under development.',
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
          message: {
            type: 'warning',
            text: 'There is no available node software that can reconstruct the state from L1 data, hence there is no way to verify that this system is a rollup.',
          },
        },
        timeToFinalize: {
          averageInSeconds: 344900,
          minimumInSeconds: 809,
          maximumInSeconds: 2240,
        },
      },
      {
        name: 'ApeX',
        shortName: undefined,
        slug: 'apex',
        category: 'Validium',
        dataAvailabilityMode: undefined,
        provider: 'StarkEx',
        warning: undefined,
        redWarning: undefined,
        purposes: ['Exchange'],
        stage: { stage: 'NotApplicable' },
        timeToFinalize: {
          averageInSeconds: 15078,
          minimumInSeconds: 67348,
          maximumInSeconds: 1259,
        },
      },
      {
        name: 'Arbitrum One',
        shortName: undefined,
        slug: 'arbitrum',
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'Transaction data',
        provider: 'Arbitrum',
        warning:
          'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
        redWarning: undefined,
        purposes: ['Universal'],
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
        timeToFinalize: {
          averageInSeconds: 2329,
          minimumInSeconds: 38108,
          maximumInSeconds: 4584,
        },
      },
      {
        name: 'Base',
        shortName: undefined,
        slug: 'base',
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'Transaction data',
        provider: 'OP Stack',
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        redWarning: undefined,
        purposes: ['Universal'],
        stage: {
          stage: 'Stage 0',
          missing: {
            nextStage: 'Stage 1',
            requirements: [
              'The proof system is still under development.',
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
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/ethereum-optimism/optimism/tree/develop/op-node)',
                },
              ],
            },
            {
              stage: 'Stage 1',
              requirements: [
                {
                  satisfied: false,
                  description: 'The proof system is still under development.',
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
        timeToFinalize: {
          averageInSeconds: 410,
          minimumInSeconds: 1955,
          maximumInSeconds: 1626,
        },
      },
      {
        name: 'dYdX v3',
        shortName: undefined,
        slug: 'dydx',
        category: 'ZK Rollup',
        dataAvailabilityMode: 'State diffs',
        provider: 'StarkEx',
        warning:
          'This page describes dYdX v3, which is an L2 built on Ethereum. Recently deployed dYdX v4 is a separate blockchain based on Cosmos SDK, unrelated to Ethereum and is using different technology. No information on this page applies to dYdX v4.',
        redWarning: undefined,
        purposes: ['Exchange'],
        stage: {
          stage: 'Stage 1',
          missing: {
            nextStage: 'Stage 2',
            requirements: [
              'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
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
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/l2beat/starkex-explorer)',
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
                  satisfied: true,
                  description:
                    'In case of an unwanted upgrade by actors more centralized than a Security Council, users have at least 7d to exit.',
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
        timeToFinalize: {
          averageInSeconds: 18555,
          minimumInSeconds: 2985,
          maximumInSeconds: 67229,
        },
      },
      {
        name: 'Linea',
        shortName: undefined,
        slug: 'linea',
        category: 'ZK Rollup',
        dataAvailabilityMode: 'Transaction data',
        provider: undefined,
        warning: 'The circuit of the program being proven is not public.',
        redWarning: undefined,
        purposes: ['Universal'],
        stage: {
          stage: 'Stage 0',
          missing: {
            nextStage: 'Stage 1',
            requirements: [
              "Users' withdrawals can be censored by the permissioned operators.",
              'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
              'Security Council members are not publicly known.',
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
                  satisfied: false,
                  description:
                    "Users' withdrawals can be censored by the permissioned operators.",
                },
                {
                  satisfied: false,
                  description:
                    'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
                },
                {
                  satisfied: false,
                  description:
                    'Security Council members are not publicly known.',
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
                {
                  satisfied: false,
                  description:
                    "The Security Council's actions are not confined to on-chain provable bugs.",
                },
              ],
            },
          ],
          message: {
            type: 'warning',
            text: 'There is no available node software that can reconstruct the state from L1 data, hence there is no way to verify that this system is a rollup.',
          },
        },
        timeToFinalize: {
          averageInSeconds: 96,
          minimumInSeconds: 259,
          maximumInSeconds: 78212,
        },
      },
      {
        name: 'Myria',
        shortName: undefined,
        slug: 'myria',
        category: 'Validium',
        dataAvailabilityMode: undefined,
        provider: 'StarkEx',
        warning: undefined,
        redWarning: undefined,
        purposes: ['NFT', 'Exchange'],
        stage: { stage: 'NotApplicable' },
        timeToFinalize: {
          averageInSeconds: 819,
          minimumInSeconds: 1651,
          maximumInSeconds: 2646,
        },
      },
      {
        name: 'OP Mainnet',
        shortName: undefined,
        slug: 'optimism',
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'Transaction data',
        provider: 'OP Stack',
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
        redWarning: undefined,
        purposes: ['Universal'],
        stage: {
          stage: 'Stage 0',
          missing: {
            nextStage: 'Stage 1',
            requirements: [
              'The proof system is still under development.',
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
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/ethereum-optimism/optimism/tree/develop/op-node)',
                },
              ],
            },
            {
              stage: 'Stage 1',
              requirements: [
                {
                  satisfied: false,
                  description: 'The proof system is still under development.',
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
        timeToFinalize: {
          averageInSeconds: 185585,
          minimumInSeconds: 34866,
          maximumInSeconds: 1211,
        },
      },
      {
        name: 'Scroll',
        shortName: undefined,
        slug: 'scroll',
        category: 'ZK Rollup',
        dataAvailabilityMode: 'Transaction data',
        provider: undefined,
        warning: undefined,
        redWarning: undefined,
        purposes: ['Universal'],
        stage: {
          stage: 'Stage 0',
          missing: {
            nextStage: 'Stage 1',
            requirements: [
              "Users' withdrawals can be censored by the permissioned operators.",
              'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
              'The Security Council is not properly set up.',
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
                  satisfied: false,
                  description:
                    "Users' withdrawals can be censored by the permissioned operators.",
                },
                {
                  satisfied: false,
                  description:
                    'Upgrades executed by actors with more centralized control than a Security Council provide less than 7d for users to exit if the permissioned operator is down or censoring.',
                },
                {
                  satisfied: false,
                  description: 'The Security Council is not properly set up.',
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
                {
                  satisfied: false,
                  description:
                    "The Security Council's actions are not confined to on-chain provable bugs.",
                },
              ],
            },
          ],
          message: {
            type: 'warning',
            text: 'There is no available node software that can reconstruct the state from L1 data, hence there is no way to verify that this system is a rollup.',
          },
        },
        timeToFinalize: {
          averageInSeconds: 4899,
          minimumInSeconds: 1192,
          maximumInSeconds: 294,
        },
      },
      {
        name: 'tanX',
        shortName: undefined,
        slug: 'tanx',
        category: 'Validium',
        dataAvailabilityMode: undefined,
        provider: 'StarkEx',
        warning: undefined,
        redWarning: undefined,
        purposes: ['Exchange'],
        stage: { stage: 'NotApplicable' },
        timeToFinalize: {
          averageInSeconds: 175511,
          minimumInSeconds: 721,
          maximumInSeconds: 2129,
        },
      },
    ],
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
      }, [])
      return (
        <>
          <Story /> <TooltipProvider />
        </>
      )
    },
  ],
  parameters: {
    chromatic: {
      modes: onlyDesktopModes,
    },
  },
}
export default meta
type Story = StoryObj<typeof ScalingLivenessView>

export const Primary: Story = {
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    await waitFor(async () => {
      const element = canvasElement.querySelector(
        '[data-testid=finality-duration-cell] [data-role=tooltip-trigger]',
      )

      if (element) {
        await userEvent.hover(element)
      }
    })
  },
}
