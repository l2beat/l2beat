import { Meta, StoryObj } from '@storybook/react'
import { userEvent, waitFor, within } from '@storybook/testing-library'
import React, { useEffect } from 'react'

import { onlyDesktopModes } from '../../../../../.storybook/modes'
import { TooltipProvider } from '../../../../components/tooltip/TooltipProvider'
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
        shortName: undefined,
        slug: 'arbitrum',
        purposes: ['DEX'],
        redWarning: undefined,
        warning:
          'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'TxData',
        provider: 'Arbitrum',
        explanation: 'Arbitrum One is a permissioned Optimistic Rollup.',
        stage: {
          stage: 'Stage 1',
          message: undefined,
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
            averageInSeconds: 3650,
            minimumInSeconds: 12,
            maximumInSeconds: 12612,
          },
          last90Days: {
            averageInSeconds: 3626,
            minimumInSeconds: 12,
            maximumInSeconds: 12612,
          },
          allTime: {
            averageInSeconds: 3621,
            minimumInSeconds: 12,
            maximumInSeconds: 12612,
          },
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 217,
            minimumInSeconds: 12,
            maximumInSeconds: 768,
          },
          last90Days: {
            averageInSeconds: 201,
            minimumInSeconds: 12,
            maximumInSeconds: 828,
          },
          allTime: {
            averageInSeconds: 99,
            minimumInSeconds: 12,
            maximumInSeconds: 6348,
          },
          warning: 'Some warning',
        },
        proofSubmissions: {},
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
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
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
        shortName: undefined,
        slug: 'optimism',
        purposes: ['DEX'],
        redWarning: undefined,
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'TxData',
        provider: 'OP Stack',
        explanation: undefined,
        stage: {
          stage: 'Stage 0',
          message: undefined,
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
            averageInSeconds: 3601,
            minimumInSeconds: 3084,
            maximumInSeconds: 3876,
          },
          last90Days: {
            averageInSeconds: 3600,
            minimumInSeconds: 3060,
            maximumInSeconds: 4128,
          },
          allTime: {
            averageInSeconds: 3600,
            minimumInSeconds: 1140,
            maximumInSeconds: 6156,
          },
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 47,
            minimumInSeconds: 12,
            maximumInSeconds: 396,
          },
          last90Days: {
            averageInSeconds: 141,
            minimumInSeconds: 12,
            maximumInSeconds: 420,
          },
          allTime: {
            averageInSeconds: 117,
            minimumInSeconds: 12,
            maximumInSeconds: 1032,
          },
        },
        proofSubmissions: {},
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
        shortName: undefined,
        slug: 'base',
        purposes: ['DEX'],
        redWarning: undefined,
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'TxData',
        provider: 'OP Stack',
        explanation: undefined,
        stage: {
          stage: 'Stage 0',
          message: undefined,
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
            minimumInSeconds: 2700,
            maximumInSeconds: 4212,
          },
          last90Days: {
            averageInSeconds: 3601,
            minimumInSeconds: 60,
            maximumInSeconds: 9156,
          },
          allTime: {
            averageInSeconds: 3593,
            minimumInSeconds: 60,
            maximumInSeconds: 9156,
          },
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 61,
            minimumInSeconds: 12,
            maximumInSeconds: 1536,
          },
          last90Days: {
            averageInSeconds: 59,
            minimumInSeconds: 12,
            maximumInSeconds: 2832,
          },
          allTime: {
            averageInSeconds: 64,
            minimumInSeconds: 12,
            maximumInSeconds: 2832,
          },
        },
        proofSubmissions: {},
        anomalyEntries: [
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
                type: 'TX DATA SUBMISSION',
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
                type: 'TX DATA SUBMISSION',
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
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
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
        shortName: undefined,
        slug: 'zksync-era',
        purposes: ['DEX'],
        redWarning: undefined,
        warning:
          'Withdrawals are delayed by 21h. The length of the delay can be arbitrarily set by a MultiSig.',
        category: 'ZK Rollup',
        dataAvailabilityMode: 'StateDiffs',
        provider: 'ZK Stack',
        explanation: undefined,
        stage: {
          stage: 'Stage 0',
          message: undefined,
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
            averageInSeconds: 3461,
            minimumInSeconds: 360,
            maximumInSeconds: 10164,
          },
          last90Days: {
            averageInSeconds: 2570,
            minimumInSeconds: 24,
            maximumInSeconds: 10164,
          },
          allTime: {
            averageInSeconds: 2566,
            minimumInSeconds: 12,
            maximumInSeconds: 49644,
          },
        },
        batchSubmissions: {},
        proofSubmissions: {
          last30Days: {
            averageInSeconds: 259,
            minimumInSeconds: 12,
            maximumInSeconds: 16344,
          },
          last90Days: {
            averageInSeconds: 249,
            minimumInSeconds: 12,
            maximumInSeconds: 44256,
          },
          allTime: {
            averageInSeconds: 236,
            minimumInSeconds: 12,
            maximumInSeconds: 52488,
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
            isAnomaly: true,
            anomalies: [
              {
                type: 'PROOF SUBMISSION',
                timestamp: 1699839995,
                durationInSeconds: 16344,
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
            isAnomaly: true,
            anomalies: [
              {
                type: 'PROOF SUBMISSION',
                timestamp: 1701584327,
                durationInSeconds: 14376,
              },
            ],
          },
          {
            isAnomaly: false,
          },
        ],
      },
      {
        name: 'dYdX v3',
        shortName: undefined,
        slug: 'dydx',
        purposes: ['DEX'],
        redWarning: 'This warning is just some random stuff I wrote.',
        warning:
          'This page describes dYdX v3, which is an L2 built on Ethereum. Recently deployed dYdX v4 is a separate blockchain based on Cosmos SDK, unrelated to Ethereum and is using different technology. No information on this page applies to dYdX v4.',
        category: 'ZK Rollup',
        dataAvailabilityMode: 'StateDiffs',
        provider: 'StarkEx',
        explanation: 'dYdX v3 is a ZK Rollup built on StarkEx.',
        stage: {
          stage: 'Stage 1',
          message: undefined,
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
            averageInSeconds: 2464,
            minimumInSeconds: 12,
            maximumInSeconds: 12180,
          },
          last90Days: {
            averageInSeconds: 3479,
            minimumInSeconds: 12,
            maximumInSeconds: 18264,
          },
          allTime: {
            averageInSeconds: 3899,
            minimumInSeconds: 12,
            maximumInSeconds: 22872,
          },
        },
        batchSubmissions: {},
        proofSubmissions: {
          last30Days: {
            averageInSeconds: 2466,
            minimumInSeconds: 12,
            maximumInSeconds: 12180,
          },
          last90Days: {
            averageInSeconds: 3482,
            minimumInSeconds: 12,
            maximumInSeconds: 18276,
          },
          allTime: {
            averageInSeconds: 3903,
            minimumInSeconds: 12,
            maximumInSeconds: 22872,
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
        name: 'Linea',
        shortName: undefined,
        slug: 'linea',
        purposes: ['DEX'],
        redWarning: undefined,
        warning: 'The circuit of the program being proven is not public.',
        category: 'ZK Rollup',
        dataAvailabilityMode: 'TxData',
        provider: undefined,
        explanation: 'Calculation explanation',
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
        stateUpdates: {
          last30Days: {
            averageInSeconds: 121,
            minimumInSeconds: 12,
            maximumInSeconds: 69408,
          },
          last90Days: {
            averageInSeconds: 117,
            minimumInSeconds: 12,
            maximumInSeconds: 80340,
          },
          allTime: {
            averageInSeconds: 130,
            minimumInSeconds: 12,
            maximumInSeconds: 213168,
          },
          warning: 'Some warning',
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 121,
            minimumInSeconds: 12,
            maximumInSeconds: 69408,
          },
          last90Days: {
            averageInSeconds: 117,
            minimumInSeconds: 12,
            maximumInSeconds: 80340,
          },
          allTime: {
            averageInSeconds: 130,
            minimumInSeconds: 12,
            maximumInSeconds: 213168,
          },
        },
        proofSubmissions: {
          last30Days: {
            averageInSeconds: 121,
            minimumInSeconds: 12,
            maximumInSeconds: 69408,
          },
          last90Days: {
            averageInSeconds: 117,
            minimumInSeconds: 12,
            maximumInSeconds: 80340,
          },
          allTime: {
            averageInSeconds: 130,
            minimumInSeconds: 12,
            maximumInSeconds: 213168,
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
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
            isAnomaly: false,
          },
          {
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
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1701215855,
                durationInSeconds: 37176,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1701289787,
                durationInSeconds: 23376,
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
                timestamp: 1701394091,
                durationInSeconds: 28656,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1701469619,
                durationInSeconds: 37620,
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
                timestamp: 1701646859,
                durationInSeconds: 17280,
              },
            ],
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
        '[data-role="liveness-time-range-cell"] [data-role=tooltip-trigger]',
      )

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
