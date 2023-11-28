import { Meta, StoryObj } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'
import React, { useEffect } from 'react'

import { onlyDesktopModes } from '../../../../../.storybook/modes'
import { Tooltip } from '../../../../components/Tooltip'
import { configureLivenessTimeRangeControls } from '../../../../scripts/configureLivenessTimeRangeControls'
import { configureTooltips } from '../../../../scripts/configureTooltips'
import { ScalingLivenessView } from './ScalingLivenessView'

const meta: Meta<typeof ScalingLivenessView> = {
  title: 'Pages/Scaling/LivenessView',
  component: ScalingLivenessView,
  args: {
    items: [
      {
        name: 'Arbitrum One',
        slug: 'arbitrum',
        explanation: 'Placeholder for explanation',
        warning:
          'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'TxData',
        provider: 'Arbitrum',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 3651,
            maximumInSeconds: 12612,
            minimumInSeconds: 2000,
          },
          last90Days: {
            averageInSeconds: 3626,
            maximumInSeconds: 12612,
            minimumInSeconds: 2010,
          },
          allTime: {
            averageInSeconds: 3621,
            maximumInSeconds: 12612,
            minimumInSeconds: 2020,
          },
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 70,
            maximumInSeconds: 768,
            minimumInSeconds: 10,
          },
          last90Days: {
            averageInSeconds: 83,
            maximumInSeconds: 828,
            minimumInSeconds: 20,
          },
          allTime: {
            averageInSeconds: 75,
            maximumInSeconds: 6348,
            minimumInSeconds: 15,
          },
        },
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699552295,
                durationInSeconds: 11340,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700105831,
                durationInSeconds: 11700,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700464307,
                durationInSeconds: 12612,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'OP Mainnet',
        slug: 'optimism',
        explanation: undefined,
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'TxData',
        provider: 'OP Stack',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 3600,
            maximumInSeconds: 3888,
            minimumInSeconds: 3400,
          },
          last90Days: {
            averageInSeconds: 3600,
            maximumInSeconds: 4128,
            minimumInSeconds: 3300,
          },
          allTime: {
            averageInSeconds: 3600,
            maximumInSeconds: 6156,
            minimumInSeconds: 3100,
          },
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 127,
            maximumInSeconds: 396,
            minimumInSeconds: 60,
          },
          last90Days: {
            averageInSeconds: 139,
            maximumInSeconds: 420,
            minimumInSeconds: 70,
          },
          allTime: {
            averageInSeconds: 114,
            maximumInSeconds: 1032,
            minimumInSeconds: 50,
          },
        },
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'Base',
        slug: 'base',
        explanation: 'Placeholder for explanation',
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'TxData',
        provider: 'OP Stack',
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
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/base-org/node)',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 3601,
            maximumInSeconds: 4212,
            minimumInSeconds: 3400,
          },
          last90Days: {
            averageInSeconds: 3601,
            maximumInSeconds: 9156,
            minimumInSeconds: 1400,
          },
          allTime: {
            averageInSeconds: 3592,
            maximumInSeconds: 9156,
            minimumInSeconds: 1100,
          },
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 60,
            maximumInSeconds: 1536,
            minimumInSeconds: 30,
          },
          last90Days: {
            averageInSeconds: 58,
            maximumInSeconds: 2832,
            minimumInSeconds: 29,
          },
          allTime: {
            averageInSeconds: 64,
            maximumInSeconds: 2832,
            minimumInSeconds: 25,
          },
        },
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'BATCH SUBMISSION',
                timestamp: 1699397243,
                durationInSeconds: 1536,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'BATCH SUBMISSION',
                timestamp: 1700661779,
                durationInSeconds: 216,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'zkSync Era',
        slug: 'zksync-era',
        explanation: 'Placeholder for explanation',
        warning:
          'Withdrawals are delayed by 21h. The length of the delay can be arbitrarily set by a MultiSig.',
        category: 'ZK Rollup',
        dataAvailabilityMode: 'StateDiffs',
        provider: 'ZK Stack',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 3313,
            maximumInSeconds: 10164,
            minimumInSeconds: 2000,
          },
          last90Days: {
            averageInSeconds: 2486,
            maximumInSeconds: 10164,
            minimumInSeconds: 1800,
          },
          allTime: {
            averageInSeconds: 2537,
            maximumInSeconds: 49644,
            minimumInSeconds: 1500,
          },
        },
        batchSubmissions: {},
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'dYdX v3',
        slug: 'dydx',
        explanation: 'Placeholder for explanation',
        warning:
          'This page describes dYdX v3, which is an L2 built on Ethereum. Recently deployed dYdX v4 is a separate blockchain based on Cosmos SDK, unrelated to Ethereum and is using different technology. No information on this page applies to dYdX v4.',
        category: 'ZK Rollup',
        dataAvailabilityMode: 'StateDiffs',
        provider: 'StarkEx',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 2363,
            maximumInSeconds: 12180,
            minimumInSeconds: 2000,
          },
          last90Days: {
            averageInSeconds: 3496,
            maximumInSeconds: 18264,
            minimumInSeconds: 1800,
          },
          allTime: {
            averageInSeconds: 3860,
            maximumInSeconds: 22872,
            minimumInSeconds: 1500,
          },
        },
        batchSubmissions: {},
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'Linea',
        slug: 'linea',
        explanation: undefined,
        provider: undefined,
        warning: 'The circuit of the program being proven is not public.',
        category: 'ZK Rollup',
        dataAvailabilityMode: 'TxData',
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
                  satisfied: true,
                  description:
                    'A source-available node exists that can recreate the state from L1 data.',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 47,
            maximumInSeconds: 69408,
            minimumInSeconds: 30,
          },
          last90Days: {
            averageInSeconds: 55,
            maximumInSeconds: 80340,
            minimumInSeconds: 20,
          },
          allTime: {
            averageInSeconds: 60,
            maximumInSeconds: 213168,
            minimumInSeconds: 10,
          },
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 120,
            maximumInSeconds: 69408,
            minimumInSeconds: 30,
          },
          last90Days: {
            averageInSeconds: 55,
            maximumInSeconds: 80340,
            minimumInSeconds: 20,
          },
          allTime: {
            averageInSeconds: 60,
            maximumInSeconds: 213168,
            minimumInSeconds: 10,
          },
        },
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1698696827,
                durationInSeconds: 26508,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1698718403,
                durationInSeconds: 20880,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698775103,
                durationInSeconds: 18948,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698788855,
                durationInSeconds: 12768,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1698897959,
                durationInSeconds: 54696,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698961679,
                durationInSeconds: 35904,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699036727,
                durationInSeconds: 21384,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699328231,
                durationInSeconds: 56328,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699385819,
                durationInSeconds: 22596,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699490963,
                durationInSeconds: 43248,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699589699,
                durationInSeconds: 69408,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699660607,
                durationInSeconds: 37716,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699916999,
                durationInSeconds: 43404,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699958723,
                durationInSeconds: 20112,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699997171,
                durationInSeconds: 30384,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700088527,
                durationInSeconds: 31836,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700168051,
                durationInSeconds: 24852,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700509667,
                durationInSeconds: 14076,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700613179,
                durationInSeconds: 40344,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700696879,
                durationInSeconds: 37212,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'Starknet',
        slug: 'starknet',
        explanation: 'Placeholder for explanation',
        warning: undefined,
        category: 'ZK Rollup',
        dataAvailabilityMode: 'StateDiffs',
        provider: 'Starknet',
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
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/NethermindEth/juno)',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 32,
            maximumInSeconds: 15336,
            minimumInSeconds: 10,
          },
          last90Days: {
            averageInSeconds: 30,
            maximumInSeconds: 22440,
            minimumInSeconds: 8,
          },
          allTime: {
            averageInSeconds: 65,
            maximumInSeconds: 49764,
            minimumInSeconds: 7,
          },
        },
        batchSubmissions: {},
        anomalyEntries: [
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1698543839,
                durationInSeconds: 7080,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1698630479,
                durationInSeconds: 6684,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698684275,
                durationInSeconds: 5748,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698694547,
                durationInSeconds: 5148,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1698712631,
                durationInSeconds: 11028,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698721151,
                durationInSeconds: 7524,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698732011,
                durationInSeconds: 9528,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698738083,
                durationInSeconds: 5112,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698785951,
                durationInSeconds: 4860,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698792971,
                durationInSeconds: 5712,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1698803903,
                durationInSeconds: 4584,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698810575,
                durationInSeconds: 5448,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698817235,
                durationInSeconds: 5388,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698874571,
                durationInSeconds: 6312,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1698883643,
                durationInSeconds: 7860,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698891803,
                durationInSeconds: 7416,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698902423,
                durationInSeconds: 9948,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698909803,
                durationInSeconds: 6384,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698916055,
                durationInSeconds: 4800,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698947339,
                durationInSeconds: 5376,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698959831,
                durationInSeconds: 5664,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698967631,
                durationInSeconds: 6732,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1698975203,
                durationInSeconds: 6420,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698981983,
                durationInSeconds: 5520,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1698989243,
                durationInSeconds: 6084,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699046447,
                durationInSeconds: 5496,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699053407,
                durationInSeconds: 5736,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699062707,
                durationInSeconds: 8160,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699237643,
                durationInSeconds: 4956,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699308827,
                durationInSeconds: 7848,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699321247,
                durationInSeconds: 11124,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699330619,
                durationInSeconds: 8604,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699337939,
                durationInSeconds: 6120,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699395047,
                durationInSeconds: 4980,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699404095,
                durationInSeconds: 7860,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699412387,
                durationInSeconds: 7104,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699418603,
                durationInSeconds: 5124,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699477367,
                durationInSeconds: 7116,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699488767,
                durationInSeconds: 10212,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699499039,
                durationInSeconds: 9336,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699508771,
                durationInSeconds: 8784,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699564871,
                durationInSeconds: 5820,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699574531,
                durationInSeconds: 9276,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699582703,
                durationInSeconds: 7428,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699594271,
                durationInSeconds: 11004,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699603343,
                durationInSeconds: 8172,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699611503,
                durationInSeconds: 6900,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699622555,
                durationInSeconds: 4956,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699633007,
                durationInSeconds: 5604,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699640099,
                durationInSeconds: 5952,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699646699,
                durationInSeconds: 5388,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699657643,
                durationInSeconds: 10020,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699673903,
                durationInSeconds: 15336,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699682651,
                durationInSeconds: 7788,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699691183,
                durationInSeconds: 7464,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699735019,
                durationInSeconds: 6108,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699744739,
                durationInSeconds: 8568,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699755011,
                durationInSeconds: 9240,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699763111,
                durationInSeconds: 6936,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699824359,
                durationInSeconds: 7056,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699831691,
                durationInSeconds: 6048,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699839251,
                durationInSeconds: 6348,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699845611,
                durationInSeconds: 5148,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699859123,
                durationInSeconds: 6420,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699893491,
                durationInSeconds: 10008,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699919675,
                durationInSeconds: 12912,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699929995,
                durationInSeconds: 9228,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699936955,
                durationInSeconds: 6192,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1699994507,
                durationInSeconds: 5916,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700003507,
                durationInSeconds: 7992,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700011487,
                durationInSeconds: 7008,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700020259,
                durationInSeconds: 8004,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700028491,
                durationInSeconds: 7152,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700084231,
                durationInSeconds: 6180,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700103923,
                durationInSeconds: 8448,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700111483,
                durationInSeconds: 6744,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700171879,
                durationInSeconds: 6000,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700187311,
                durationInSeconds: 8724,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700266079,
                durationInSeconds: 6528,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700451191,
                durationInSeconds: 6108,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700458043,
                durationInSeconds: 5604,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700485919,
                durationInSeconds: 9828,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700521355,
                durationInSeconds: 6252,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700528687,
                durationInSeconds: 6468,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700538767,
                durationInSeconds: 8208,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700547779,
                durationInSeconds: 7740,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700555039,
                durationInSeconds: 6060,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700615495,
                durationInSeconds: 11244,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700625275,
                durationInSeconds: 8868,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700631827,
                durationInSeconds: 5676,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700676599,
                durationInSeconds: 5448,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700694431,
                durationInSeconds: 10368,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700703911,
                durationInSeconds: 8520,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700714231,
                durationInSeconds: 9660,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700724143,
                durationInSeconds: 8676,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700768819,
                durationInSeconds: 6228,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1700776271,
                durationInSeconds: 5904,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1700876231,
                durationInSeconds: 5376,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'Polygon zkEVM',
        slug: 'polygonzkevm',
        explanation: undefined,
        warning: 'The forced transaction mechanism is currently disabled.',
        category: 'ZK Rollup',
        dataAvailabilityMode: 'TxData',
        provider: 'Polygon',
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
                  satisfied: true,
                  description:
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/0xPolygonHermez/zkevm-node)',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 1653,
            maximumInSeconds: 2856,
            minimumInSeconds: 1000,
          },
          last90Days: {
            averageInSeconds: 1651,
            maximumInSeconds: 3612,
            minimumInSeconds: 800,
          },
          allTime: {
            averageInSeconds: 1651,
            maximumInSeconds: 3612,
            minimumInSeconds: 800,
          },
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 289,
            maximumInSeconds: 1416,
            minimumInSeconds: 200,
          },
          last90Days: {
            averageInSeconds: 413,
            maximumInSeconds: 8556,
            minimumInSeconds: 180,
          },
          allTime: {
            averageInSeconds: 457,
            maximumInSeconds: 25380,
            minimumInSeconds: 150,
          },
        },
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1699371887,
                durationInSeconds: 2856,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'Loopring',
        slug: 'loopring',
        explanation: undefined,
        warning: undefined,
        category: 'ZK Rollup',
        dataAvailabilityMode: 'StateDiffs',
        provider: 'Loopring',
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
                  satisfied: 'UnderReview',
                  description:
                    'A source-available node exists that can recreate the state from L1 data.',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 2996,
            maximumInSeconds: 21660,
            minimumInSeconds: 2100,
          },
          last90Days: {
            averageInSeconds: 2917,
            maximumInSeconds: 21660,
            minimumInSeconds: 2000,
          },
          allTime: {
            averageInSeconds: 2841,
            maximumInSeconds: 21660,
            minimumInSeconds: 2000,
          },
        },
        batchSubmissions: {},
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'zkSync Lite',
        slug: 'zksync-lite',
        explanation: undefined,
        warning: undefined,
        category: 'ZK Rollup',
        dataAvailabilityMode: 'StateDiffs',
        provider: 'zkSync Lite',
        stage: {
          stage: 'Stage 1',
          missing: {
            nextStage: 'Stage 2',
            requirements: [
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
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/matter-labs/zksync)',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 2273,
            maximumInSeconds: 17340,
            minimumInSeconds: 2000,
          },
          last90Days: {
            averageInSeconds: 1461,
            maximumInSeconds: 17340,
            minimumInSeconds: 2000,
          },
          allTime: {
            averageInSeconds: 1180,
            maximumInSeconds: 17724,
            minimumInSeconds: 1800,
          },
        },
        batchSubmissions: {},
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'Aevo',
        slug: 'aevo',
        explanation: 'Placeholder for explanation',
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'TxData',
        provider: 'OP Stack',
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
                    'A source-available node exists that can recreate the state from L1 data.',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 6006,
            maximumInSeconds: 18048,
            minimumInSeconds: 4000,
          },
          last90Days: {
            averageInSeconds: 6001,
            maximumInSeconds: 18048,
            minimumInSeconds: 3800,
          },
          allTime: {
            averageInSeconds: 6001,
            maximumInSeconds: 18048,
            minimumInSeconds: 3800,
          },
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 2358,
            maximumInSeconds: 12156,
            minimumInSeconds: 2000,
          },
          last90Days: {
            averageInSeconds: 2940,
            maximumInSeconds: 12156,
            minimumInSeconds: 1800,
          },
          allTime: {
            averageInSeconds: 3558,
            maximumInSeconds: 12156,
            minimumInSeconds: 1300,
          },
        },
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'Boba Network',
        slug: 'bobanetwork',
        explanation: 'Placeholder for explanation',
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'TxData',
        provider: 'OVM',
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
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/bobanetwork/boba)',
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
                    'Fraud proof submission is open only to whitelisted actors.',
                },
                {
                  satisfied: false,
                  description:
                    'Upgrades unrelated to on-chain provable bugs provide less than 30d to exit.',
                },
              ],
            },
          ],
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 3611,
            maximumInSeconds: 6708,
            minimumInSeconds: 3000,
          },
          last90Days: {
            averageInSeconds: 3672,
            maximumInSeconds: 15096,
            minimumInSeconds: 2800,
          },
          allTime: {
            averageInSeconds: 3682,
            maximumInSeconds: 15096,
            minimumInSeconds: 2800,
          },
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 3466,
            maximumInSeconds: 6660,
            minimumInSeconds: 3000,
          },
          last90Days: {
            averageInSeconds: 3570,
            maximumInSeconds: 15096,
            minimumInSeconds: 2500,
          },
          allTime: {
            averageInSeconds: 3628,
            maximumInSeconds: 15096,
            minimumInSeconds: 2000,
          },
        },
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'Zora',
        slug: 'zora',
        explanation: undefined,
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'TxData',
        provider: 'OP Stack',
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
                    'A source-available node exists that can recreate the state from L1 data.',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 3600,
            maximumInSeconds: 4416,
            minimumInSeconds: 2000,
          },
          last90Days: {
            averageInSeconds: 3600,
            maximumInSeconds: 5760,
            minimumInSeconds: 1800,
          },
          allTime: {
            averageInSeconds: 3409,
            maximumInSeconds: 5760,
            minimumInSeconds: 1800,
          },
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 596,
            maximumInSeconds: 2004,
            minimumInSeconds: 400,
          },
          last90Days: {
            averageInSeconds: 572,
            maximumInSeconds: 2556,
            minimumInSeconds: 380,
          },
          allTime: {
            averageInSeconds: 576,
            maximumInSeconds: 2556,
            minimumInSeconds: 350,
          },
        },
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'BATCH SUBMISSION',
                timestamp: 1700745107,
                durationInSeconds: 2004,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'ZKSpace',
        slug: 'zkspace',
        explanation: undefined,
        warning: undefined,
        category: 'ZK Rollup',
        dataAvailabilityMode: 'StateDiffs',
        provider: 'zkSync Lite',
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
                  satisfied: 'UnderReview',
                  description:
                    'A source-available node exists that can recreate the state from L1 data.',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 31049,
            maximumInSeconds: 112104,
            minimumInSeconds: 20000,
          },
          last90Days: {
            averageInSeconds: 31803,
            maximumInSeconds: 182760,
            minimumInSeconds: 19000,
          },
          allTime: {
            averageInSeconds: 10312,
            maximumInSeconds: 182760,
            minimumInSeconds: 20000,
          },
        },
        batchSubmissions: {},
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'DeGate V1',
        slug: 'degate3',
        explanation: 'Placeholder for explanation',
        warning: undefined,
        category: 'ZK Rollup',
        dataAvailabilityMode: 'StateDiffs',
        provider: 'Loopring',
        stage: {
          stage: 'Stage 2',
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
                    'A source-available node exists that can recreate the state from L1 data.',
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
              ],
            },
            {
              stage: 'Stage 2',
              requirements: [
                {
                  satisfied: true,
                  description:
                    'Users have at least 30d to exit as the system upgrades have a 45d delay.',
                },
              ],
            },
          ],
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 9559,
            maximumInSeconds: 28704,
            minimumInSeconds: 8000,
          },
          last90Days: {
            averageInSeconds: 9559,
            maximumInSeconds: 28704,
            minimumInSeconds: 8000,
          },
          allTime: {
            averageInSeconds: 9559,
            maximumInSeconds: 28704,
            minimumInSeconds: 8000,
          },
        },
        batchSubmissions: {},
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'Public Goods Network',
        slug: 'publicgoodsnetwork',
        explanation: 'Placeholder for explanation',
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'TxData',
        provider: 'OP Stack',
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
                    'A source-available node exists that can recreate the state from L1 data.',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 3601,
            maximumInSeconds: 4236,
            minimumInSeconds: 2000,
          },
          last90Days: {
            averageInSeconds: 3601,
            maximumInSeconds: 5520,
            minimumInSeconds: 1800,
          },
          allTime: {
            averageInSeconds: 3601,
            maximumInSeconds: 5520,
            minimumInSeconds: 1800,
          },
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 595,
            maximumInSeconds: 2004,
            minimumInSeconds: 400,
          },
          last90Days: {
            averageInSeconds: 595,
            maximumInSeconds: 2736,
            minimumInSeconds: 380,
          },
          allTime: {
            averageInSeconds: 595,
            maximumInSeconds: 2736,
            minimumInSeconds: 380,
          },
        },
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'BATCH SUBMISSION',
                timestamp: 1700745107,
                durationInSeconds: 2004,
              },
            ],
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'Kroma',
        slug: 'kroma',
        explanation: 'Placeholder for explanation',
        warning: undefined,
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'TxData',
        provider: 'OP Stack',
        stage: {
          stage: 'Stage 0',
          missing: {
            nextStage: 'Stage 1',
            requirements: [
              'The proof system is still under development.',
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
                  satisfied: true,
                  description:
                    'A source-available node exists that can recreate the state from L1 data. [View code](https://github.com/kroma-network/kroma)',
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
                  satisfied: true,
                  description: 'Fraud proof submission is open to everyone.',
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
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 3601,
            maximumInSeconds: 5688,
            minimumInSeconds: 2000,
          },
          last90Days: {
            averageInSeconds: 3600,
            maximumInSeconds: 7644,
            minimumInSeconds: 2000,
          },
          allTime: {
            averageInSeconds: 3600,
            maximumInSeconds: 7644,
            minimumInSeconds: 2000,
          },
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 620,
            maximumInSeconds: 696,
            minimumInSeconds: 500,
          },
          last90Days: {
            averageInSeconds: 616,
            maximumInSeconds: 1140,
            minimumInSeconds: 480,
          },
          allTime: {
            averageInSeconds: 616,
            maximumInSeconds: 1140,
            minimumInSeconds: 480,
          },
        },
        anomalyEntries: [
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
        ],
      },
    ],
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureLivenessTimeRangeControls()
      }, [])
      return (
        <>
          <Story /> <Tooltip />
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
    const canvas = within(canvasElement)
    await new Promise((resolve) => setTimeout(resolve, 200))

    await waitFor(async () => {
      const element = canvas.getByText('47 seconds').parentElement
      if (element) {
        await userEvent.hover(element)
      }
    })
  },
}

export const MaxDaySelected: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByText('MAX')
    await userEvent.click(element)
  },
}
