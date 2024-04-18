import { UnixTime } from '@l2beat/shared-pure'
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
        purposes: ['Universal'],
        warning:
          'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
        redWarning: undefined,
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'Transactions data (compressed)',
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
          message: undefined,
        },
        explanation:
          'Arbitrum One is an Optimistic rollup that posts transactions data to the L1. For a transaction to be considered final, it has to be posted on L1. Forced txs can be delayed up to 1d. The state root gets finalized 6d 8h after it has been posted.',
        stateUpdates: {
          last30Days: {
            averageInSeconds: 3238,
            minimumInSeconds: 32029,
            maximumInSeconds: 66971,
          },
          last90Days: {
            averageInSeconds: 37,
            minimumInSeconds: 45233,
            maximumInSeconds: 1741,
          },
          allTime: {
            averageInSeconds: 36444,
            minimumInSeconds: 2379,
            maximumInSeconds: 306,
          },
          syncedUntil: new UnixTime(1706738434),
          warning:
            'Please note, for Optimistic rollups the state is not finalized until the challenge period passes.',
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 54568,
            minimumInSeconds: 441405,
            maximumInSeconds: 441876,
          },
          last90Days: {
            averageInSeconds: 20271,
            minimumInSeconds: 3536,
            maximumInSeconds: 778,
          },
          allTime: {
            averageInSeconds: 34887,
            minimumInSeconds: 145,
            maximumInSeconds: 2705,
          },
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        proofSubmissions: {
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        anomalyEntries: [
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1706738434,
                durationInSeconds: 1778,
              },
            ],
          },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1707004837,
                durationInSeconds: 76,
              },
            ],
          },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1707966575,
                durationInSeconds: 3124,
              },
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1707996551,
                durationInSeconds: 2501,
              },
            ],
          },
          { isAnomaly: false },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1708294300,
                durationInSeconds: 7032,
              },
            ],
          },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
        ],
        isSynced: true,
      },
      {
        name: 'Base',
        shortName: undefined,
        slug: 'base',
        purposes: ['Universal'],
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        redWarning: undefined,
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'Transactions data',
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
          message: undefined,
        },
        explanation:
          'Base is an Optimistic rollup that posts transactions data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to 12h or until it gets published. The state root gets finalized 7d after it has been posted.',
        stateUpdates: {
          last30Days: {
            averageInSeconds: 2787,
            minimumInSeconds: 73663,
            maximumInSeconds: 2957,
          },
          last90Days: {
            averageInSeconds: 69234,
            minimumInSeconds: 9282,
            maximumInSeconds: 2109,
          },
          allTime: {
            averageInSeconds: 2737,
            minimumInSeconds: 2429,
            maximumInSeconds: 1338,
          },
          syncedUntil: new UnixTime(1706738434),
          warning:
            'Please note, for Optimistic rollups the state is not finalized until the challenge period passes.',
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 240575,
            minimumInSeconds: 2114,
            maximumInSeconds: 10240,
          },
          last90Days: {
            averageInSeconds: 2275,
            minimumInSeconds: 1786,
            maximumInSeconds: 892,
          },
          allTime: {
            averageInSeconds: 25583,
            minimumInSeconds: 44991,
            maximumInSeconds: 27634,
          },
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        proofSubmissions: {
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        anomalyEntries: [
          { isAnomaly: false },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1706768394,
                durationInSeconds: 1908,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1706863393,
                durationInSeconds: 196,
              },
            ],
          },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1707401116,
                durationInSeconds: 41639,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1707459767,
                durationInSeconds: 2736,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1707566710,
                durationInSeconds: 3367,
              },
            ],
          },
          { isAnomaly: false },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1707836155,
                durationInSeconds: 1301,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1707870332,
                durationInSeconds: 10606,
              },
            ],
          },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1708075242,
                durationInSeconds: 16193,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1708161379,
                durationInSeconds: 2979,
              },
            ],
          },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1708372477,
                durationInSeconds: 1904,
              },
            ],
          },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1708667362,
                durationInSeconds: 70147,
              },
              {
                type: 'STATE UPDATE',
                timestamp: 1708699581,
                durationInSeconds: 83653,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1708755093,
                durationInSeconds: 2353,
              },
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1708785147,
                durationInSeconds: 727,
              },
            ],
          },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
        ],
        isSynced: true,
      },
      {
        name: 'dYdX v3',
        shortName: undefined,
        slug: 'dydx',
        purposes: ['Exchange'],
        warning:
          'This page describes dYdX v3, which is an L2 built on Ethereum. Recently deployed dYdX v4 is a separate blockchain based on Cosmos SDK, unrelated to Ethereum and is using different technology. No information on this page applies to dYdX v4.',
        redWarning: undefined,
        category: 'ZK Rollup',
        dataAvailabilityMode: 'State diffs',
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
          message: undefined,
        },
        explanation:
          'dYdX is a ZK rollup that posts state diffs to the L1. For a transaction to be considered final, the state diffs have to be submitted and validity proof should be generated, submitted, and verified. The verification is done as part of the state update.',
        stateUpdates: {
          last30Days: {
            averageInSeconds: 1560,
            minimumInSeconds: 62160,
            maximumInSeconds: 2943,
          },
          last90Days: {
            averageInSeconds: 363376,
            minimumInSeconds: 1711,
            maximumInSeconds: 64300,
          },
          allTime: {
            averageInSeconds: 1235,
            minimumInSeconds: 932,
            maximumInSeconds: 2401,
          },
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 7416,
            minimumInSeconds: 59109,
            maximumInSeconds: 889,
          },
          last90Days: undefined,
          allTime: {
            averageInSeconds: 56689,
            minimumInSeconds: 14489,
            maximumInSeconds: 57670,
          },
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        proofSubmissions: {
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        anomalyEntries: [
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1706918512,
                durationInSeconds: 996,
              },
            ],
          },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
        ],
        isSynced: true,
      },
      {
        name: 'Linea',
        shortName: undefined,
        slug: 'linea',
        purposes: ['Universal'],
        warning: 'The circuit of the program being proven is not public.',
        redWarning: undefined,
        category: 'ZK Rollup',
        dataAvailabilityMode: 'Transactions data',
        provider: undefined,
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
        explanation:
          'Linea is a ZK rollup that posts transactions data to the L1. For a transaction to be considered final, it has to be posted on L1. Tx data, proofs and state roots are currently posted in the same transaction. Blocks can also be finalized by the operator without the need to provide a proof.',
        stateUpdates: {
          last30Days: {
            averageInSeconds: 338,
            minimumInSeconds: 3344,
            maximumInSeconds: 1375,
          },
          last90Days: {
            averageInSeconds: 30704,
            minimumInSeconds: 82397,
            maximumInSeconds: 2626,
          },
          allTime: {
            averageInSeconds: 172948,
            minimumInSeconds: 7208,
            maximumInSeconds: 52341,
          },
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 2624,
            minimumInSeconds: 3202,
            maximumInSeconds: 2830,
          },
          last90Days: {
            averageInSeconds: 40154,
            minimumInSeconds: 2869,
            maximumInSeconds: 3034,
          },
          allTime: {
            averageInSeconds: 76919,
            minimumInSeconds: 54908,
            maximumInSeconds: 88067,
          },
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        proofSubmissions: {
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        anomalyEntries: [
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
        ],
        isSynced: true,
      },
      {
        name: 'OP Mainnet',
        shortName: undefined,
        slug: 'optimism',
        purposes: ['Universal'],
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
        redWarning: undefined,
        category: 'Optimistic Rollup',
        dataAvailabilityMode: 'Transactions data',
        provider: 'OP Stack',
        stage: {
          stage: 'Stage 0',
          missing: {
            nextStage: 'Stage 1',
            requirements: [
              'The proof system is still under development.',
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
              ],
            },
          ],
          message: undefined,
        },
        explanation:
          'Optimism is an Optimistic rollup that posts transactions data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to 12h or until it gets published. The state root gets finalized 7d after it has been posted.',
        stateUpdates: {
          last30Days: {
            averageInSeconds: 2203,
            minimumInSeconds: 756,
            maximumInSeconds: 8639,
          },
          last90Days: {
            averageInSeconds: 1992,
            minimumInSeconds: 82608,
            maximumInSeconds: 1113,
          },
          allTime: {
            averageInSeconds: 997,
            minimumInSeconds: 1164,
            maximumInSeconds: 80046,
          },
          syncedUntil: new UnixTime(1706738434),
          warning:
            'Please note, for Optimistic rollups the state is not finalized until the challenge period passes.',
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 2184,
            minimumInSeconds: 16268,
            maximumInSeconds: 957,
          },
          last90Days: {
            averageInSeconds: 15933,
            minimumInSeconds: 662,
            maximumInSeconds: 2129,
          },
          allTime: undefined,
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        proofSubmissions: {
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        anomalyEntries: [
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1708585019,
                durationInSeconds: 20538,
              },
            ],
          },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
        ],
        isSynced: true,
      },
      {
        name: 'Polygon zkEVM',
        shortName: undefined,
        slug: 'polygonzkevm',
        purposes: ['Universal'],
        warning: 'The forced transaction mechanism is currently disabled.',
        redWarning: undefined,
        category: 'ZK Rollup',
        dataAvailabilityMode: 'Transactions data',
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
          message: undefined,
        },
        explanation:
          'Polygon zkEVM is a ZK rollup that posts transactions data to the L1. For a transaction to be considered final, it has to be posted on L1. State updates are a three step process: first blocks are committed to L1, then they are proved, and then it is possible to execute them.',
        stateUpdates: {
          last30Days: {
            averageInSeconds: 762,
            minimumInSeconds: 55038,
            maximumInSeconds: 79201,
          },
          last90Days: {
            averageInSeconds: 16470,
            minimumInSeconds: 75434,
            maximumInSeconds: 60249,
          },
          allTime: {
            averageInSeconds: 2424,
            minimumInSeconds: 3054,
            maximumInSeconds: 180,
          },
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 1146,
            minimumInSeconds: 2664,
            maximumInSeconds: 74131,
          },
          last90Days: {
            averageInSeconds: 1512,
            minimumInSeconds: 2642,
            maximumInSeconds: 641,
          },
          allTime: {
            averageInSeconds: 75077,
            minimumInSeconds: 23144,
            maximumInSeconds: 2380,
          },
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        proofSubmissions: {
          syncedUntil: new UnixTime(1706738434),
          warning: undefined,
        },
        anomalyEntries: [
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1706694401,
                durationInSeconds: 76068,
              },
            ],
          },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1707176689,
                durationInSeconds: 84453,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1707263909,
                durationInSeconds: 19750,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1707323837,
                durationInSeconds: 1637,
              },
            ],
          },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1707769596,
                durationInSeconds: 1698,
              },
            ],
          },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1707921069,
                durationInSeconds: 56057,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1707974329,
                durationInSeconds: 510144,
              },
            ],
          },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1708169295,
                durationInSeconds: 2673,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1708251020,
                durationInSeconds: 58902,
              },
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1708268193,
                durationInSeconds: 76369,
              },
            ],
          },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1708423615,
                durationInSeconds: 325,
              },
            ],
          },
          { isAnomaly: false },
          { isAnomaly: false },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'TX DATA SUBMISSION',
                timestamp: 1708796461,
                durationInSeconds: 1431,
              },
            ],
          },
          { isAnomaly: false },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1708983542,
                durationInSeconds: 61807,
              },
            ],
          },
          {
            isAnomaly: true,
            anomalies: [
              {
                type: 'STATE UPDATE',
                timestamp: 1709071142,
                durationInSeconds: 49928,
              },
            ],
          },
          { isAnomaly: false },
        ],
        isSynced: false,
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
