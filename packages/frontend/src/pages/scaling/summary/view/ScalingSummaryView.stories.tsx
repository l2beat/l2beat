import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import React, { useEffect } from 'react'

import { onlyDesktopModes } from '../../../../../.storybook/modes'
import { configureOverflowWrappers } from '../../../../scripts/configureOverflowWrappers'
import { configureProjectFilters } from '../../../../scripts/configureProjectFilters'
import { configureTabs } from '../../../../scripts/configureTabs'
import { configureTables } from '../../../../scripts/table/configureTables'
import { ScalingSummaryView } from './ScalingSummaryView'

const meta = {
  title: 'Pages/Scaling/SummaryView',
  component: ScalingSummaryView,
  args: {
    layer2s: [
      {
        name: 'Arbitrum One',
        shortName: undefined,
        slug: 'arbitrum',
        provider: 'Arbitrum',
        category: 'Optimistic Rollup',
        riskValues: {
          dataAvailability: {
            sentiment: 'good',
            description:
              'All of the data needed for proof construction is published on Ethereum L1.',
            warning: undefined,
            value: 'On chain',
          },
          sequencerFailure: {
            sentiment: 'good',
            description:
              "In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 1d delay on this operation.",
            warning: undefined,
            value: 'Self sequence',
          },
          stateValidation: {
            sentiment: 'warning',
            description:
              'Fraud proofs allow 14 WHITELISTED actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve.',
            warning: undefined,
            value: 'Fraud proofs (INT)',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'Upgrades are initiated on L2 and have to go first through a 3d delay. Since there is a 1d to force a tx, users have only 2d to exit.\nIf users post a tx after that time, they would need to self propose a root with a 6d 8h delay and then wait for the 6d 8h challenge window, while the upgrade would be confirmed just after the 6d 8h challenge window and the 3d L1 timelock.',
            warning: {
              value: 'The Security Council can upgrade with no delay.',
              sentiment: 'bad',
            },
            value: '2d',
          },
          proposerFailure: {
            sentiment: 'good',
            description:
              'Anyone can become a Proposer after 6d 8h of inactivity from the currently whitelisted Proposers.',
            warning: undefined,
            value: 'Self propose',
          },
        },
        warning:
          'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 19128714738.33,
            displayValue: '$19.12 B',
          },
          tvlBreakdown: {
            associated: 0.17058113606094114,
            ether: 0.3516787389865851,
            stable: 0.22110978337895656,
            other: 0.2566303415735171,
            label: '',
            warning:
              'The ARB token associated with Arbitrum One accounts for 17.06% of the TVL!',
            warningSeverity: 'warning',
          },
          sevenDayChange: '-0.10%',
          tvlWarnings: [],
          marketShare: {
            value: 0.4082125549311448,
            displayValue: '40.82%',
          },
          excludedTokens: {
            tvl: {
              value: 15865716846.880001,
              displayValue: '$15.86 B',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0.4240061979256171,
              stable: 0.26658398186034327,
              other: 0.3094098202140395,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '-0.09%',
            tvlWarnings: [],
            marketShare: {
              value: 0.40869510270084713,
              displayValue: '40.87%',
            },
          },
        },
        tvlTooltip:
          'TVL includes canonically bridged, externally bridged and natively minted assets. Check "Value Locked" for more information.',
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
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](https://github.com/OffchainLabs/nitro/)',
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
      },
      {
        name: 'OP Mainnet',
        shortName: undefined,
        slug: 'optimism',
        provider: 'OP Stack',
        category: 'Optimistic Rollup',
        riskValues: {
          dataAvailability: {
            sentiment: 'good',
            description:
              'All of the data needed for proof construction is published on Ethereum L1.',
            warning: undefined,
            value: 'On chain',
          },
          sequencerFailure: {
            sentiment: 'good',
            description:
              "In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 12h delay on this operation.",
            warning: undefined,
            value: 'Self sequence',
          },
          stateValidation: {
            sentiment: 'bad',
            description:
              'Currently the system permits invalid state roots. More details in project overview.',
            warning: undefined,
            value: 'In development',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
            warning: undefined,
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'bad',
            description:
              'Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen.',
            warning: undefined,
            value: 'Cannot withdraw',
          },
        },
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 7677085424.36,
            displayValue: '$7.67 B',
          },
          tvlBreakdown: {
            associated: 0.34479687850818336,
            ether: 0.23809691264603614,
            stable: 0.1628647592148206,
            other: 0.2542414496309599,
            label: '',
            warning:
              'The OP token associated with OP Mainnet accounts for 34.48% of the TVL!',
            warningSeverity: 'warning',
          },
          sevenDayChange: '-1.73%',
          tvlWarnings: [],
          marketShare: {
            value: 0.1638313236603917,
            displayValue: '16.38%',
          },
          excludedTokens: {
            tvl: {
              value: 5030050334,
              displayValue: '$5.03 B',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0.36339404504654804,
              stable: 0.24857140308489012,
              other: 0.38803455186856173,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '+0.05%',
            tvlWarnings: [],
            marketShare: {
              value: 0.12957226942120964,
              displayValue: '12.96%',
            },
          },
        },
        tvlTooltip:
          'TVL includes canonically bridged, externally bridged and natively minted assets. Check "Value Locked" for more information.',
        purposes: ['Universal'],
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
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](https://github.com/ethereum-optimism/optimism/tree/develop/op-node)',
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
      },
      {
        name: 'Base',
        shortName: undefined,
        slug: 'base',
        provider: 'OP Stack',
        category: 'Optimistic Rollup',
        riskValues: {
          dataAvailability: {
            sentiment: 'good',
            description:
              'All of the data needed for proof construction is published on Ethereum L1.',
            warning: undefined,
            value: 'On chain',
          },
          sequencerFailure: {
            sentiment: 'good',
            description:
              "In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 12h delay on this operation.",
            warning: undefined,
            value: 'Self sequence',
          },
          stateValidation: {
            sentiment: 'bad',
            description:
              'Currently the system permits invalid state roots. More details in project overview.',
            warning: undefined,
            value: 'In development',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
            warning: undefined,
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'bad',
            description:
              'Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen.',
            warning: undefined,
            value: 'Cannot withdraw',
          },
        },
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 7415963862.84,
            displayValue: '$7.41 B',
          },
          tvlBreakdown: {
            associated: 0,
            ether: 0.24732697785525498,
            stable: 0.4121687705216838,
            other: 0.34050425162306114,
            label: '',
            warning: undefined,
            warningSeverity: 'warning',
          },
          sevenDayChange: '+6.59%',
          tvlWarnings: [],
          marketShare: {
            value: 0.1582589106031726,
            displayValue: '15.83%',
          },
          excludedTokens: {
            tvl: {
              value: 7415963862.84,
              displayValue: '$7.41 B',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0.24732697785525498,
              stable: 0.4121687705216838,
              other: 0.34050425162306114,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '+6.59%',
            tvlWarnings: [],
            marketShare: {
              value: 0.19103253523304786,
              displayValue: '19.10%',
            },
          },
        },
        tvlTooltip:
          'TVL includes canonically bridged, externally bridged and natively minted assets. Check "Value Locked" for more information.',
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
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](https://github.com/ethereum-optimism/optimism/tree/develop/op-node)',
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
      },
      {
        name: 'Blast',
        shortName: undefined,
        slug: 'blast',
        provider: 'OP Stack',
        category: 'Optimistic Rollup',
        riskValues: {
          dataAvailability: {
            sentiment: 'good',
            description:
              'All of the data needed for proof construction is published on Ethereum L1.',
            warning: undefined,
            value: 'On chain',
          },
          sequencerFailure: {
            sentiment: 'good',
            description:
              "In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 12h delay on this operation.",
            warning: undefined,
            value: 'Self sequence',
          },
          stateValidation: {
            sentiment: 'bad',
            description:
              'Currently the system permits invalid state roots. More details in project overview.',
            warning: undefined,
            value: 'In development',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
            warning: undefined,
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'bad',
            description:
              'Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen.',
            warning: undefined,
            value: 'Cannot withdraw',
          },
        },
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 3262325399.28,
            displayValue: '$3.26 B',
          },
          tvlBreakdown: {
            associated: 0,
            ether: 0.03207921915241718,
            stable: 2.028951496212133e-7,
            other: 0.9679205779524332,
            label: '',
            warning: undefined,
            warningSeverity: 'warning',
          },
          sevenDayChange: '-3.21%',
          tvlWarnings: [
            {
              content: 'The TVL does account for rehypothecated tokens.',
              sentiment: 'bad',
            },
          ],
          marketShare: {
            value: 0.06961901018829869,
            displayValue: '6.96%',
          },
          excludedTokens: {
            tvl: {
              value: 3262325399.28,
              displayValue: '$3.26 B',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0.03207921915241718,
              stable: 2.028951496212133e-7,
              other: 0.9679205779524332,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '-3.21%',
            tvlWarnings: [
              {
                content: 'The TVL does account for rehypothecated tokens.',
                sentiment: 'bad',
              },
            ],
            marketShare: {
              value: 0.08403631723482542,
              displayValue: '8.40%',
            },
          },
        },
        tvlTooltip:
          'TVL includes canonically bridged, externally bridged and natively minted assets. Check "Value Locked" for more information.',
        purposes: ['Universal', 'DeFi'],
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
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](https://github.com/blast-io/blast)',
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
      },
      {
        name: 'Mantle',
        shortName: undefined,
        slug: 'mantle',
        provider: 'OP Stack',
        category: 'Optimium',
        riskValues: {
          dataAvailability: {
            sentiment: 'bad',
            description:
              'Proof construction and state derivation rely fully on data that is NOT published on chain. MantleDA contracts are forked from EigenDA with significant modifications, most importantly removal of slashing conditions. DA fraud proof mechanism is not live yet.',
            warning: undefined,
            value: 'External',
          },
          sequencerFailure: {
            sentiment: 'good',
            description:
              "In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 12h delay on this operation.",
            warning: undefined,
            value: 'Self sequence',
          },
          stateValidation: {
            sentiment: 'bad',
            description:
              'Currently the system permits invalid state roots. More details in project overview.',
            warning: undefined,
            value: 'In development',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
            warning: undefined,
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'bad',
            description:
              'Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen.',
            warning: undefined,
            value: 'Cannot withdraw',
          },
        },
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 1263649299.7,
            displayValue: '$1.26 B',
          },
          tvlBreakdown: {
            associated: 0.16172022874425368,
            ether: 0.15235160541433884,
            stable: 0.11299247465566414,
            other: 0.5729356911857434,
            label: '',
            warning:
              'The MNT token associated with Mantle accounts for 16.17% of the TVL!',
            warningSeverity: 'warning',
          },
          sevenDayChange: '-1.67%',
          tvlWarnings: [],
          marketShare: {
            value: 0.026966658043880848,
            displayValue: '2.70%',
          },
          excludedTokens: {
            tvl: {
              value: 1059291645.8900001,
              displayValue: '$1.05 B',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0.18174314905339273,
              stable: 0.1347908878768095,
              other: 0.683465963079238,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '-0.99%',
            tvlWarnings: [],
            marketShare: {
              value: 0.02728696800688828,
              displayValue: '2.73%',
            },
          },
        },
        tvlTooltip:
          'TVL includes canonically bridged and externally bridged assets. Check "Value Locked" for more information.',
        purposes: ['Universal'],
        stage: {
          stage: 'NotApplicable',
        },
      },
      {
        name: 'Linea',
        shortName: undefined,
        slug: 'linea',
        provider: undefined,
        category: 'ZK Rollup',
        riskValues: {
          dataAvailability: {
            sentiment: 'good',
            description:
              'All of the data needed for proof construction is published on Ethereum L1. Unlike most ZK rollups, transaction data is posted instead of state diffs.',
            warning: undefined,
            value: 'On chain',
          },
          sequencerFailure: {
            sentiment: 'bad',
            description:
              'There is no mechanism to have transactions be included if the sequencer is down or censoring.',
            warning: undefined,
            value: 'No mechanism',
          },
          stateValidation: {
            sentiment: 'good',
            description:
              'zkSNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
            warning: undefined,
            value: 'ZK proofs (SN)',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
            warning: undefined,
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'bad',
            description:
              'Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen.',
            warning: undefined,
            value: 'Cannot withdraw',
          },
        },
        warning: 'The circuit of the program being proven is not public.',
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 1229718426.65,
            displayValue: '$1.22 B',
          },
          tvlBreakdown: {
            associated: 0,
            ether: 0.5906410215049369,
            stable: 0.0480015114360814,
            other: 0.36135746705898153,
            label: '',
            warning: undefined,
            warningSeverity: 'warning',
          },
          sevenDayChange: '+8.45%',
          tvlWarnings: [],
          marketShare: {
            value: 0.026242562956037323,
            displayValue: '2.62%',
          },
          excludedTokens: {
            tvl: {
              value: 1229718426.65,
              displayValue: '$1.22 B',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0.5906410215049369,
              stable: 0.0480015114360814,
              other: 0.36135746705898153,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '+8.45%',
            tvlWarnings: [],
            marketShare: {
              value: 0.03167709997116698,
              displayValue: '3.17%',
            },
          },
        },
        tvlTooltip:
          'TVL includes canonically bridged, externally bridged and natively minted assets. Check "Value Locked" for more information.',
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
      },
      {
        name: 'Starknet',
        shortName: undefined,
        slug: 'starknet',
        provider: 'Starknet',
        category: 'ZK Rollup',
        riskValues: {
          dataAvailability: {
            sentiment: 'good',
            description:
              'All of the data (SD = state diffs) needed for proof construction is published on chain.',
            warning: undefined,
            value: 'On chain (SD)',
          },
          sequencerFailure: {
            sentiment: 'bad',
            description:
              'There is no mechanism to have transactions be included if the sequencer is down or censoring.',
            warning: undefined,
            value: 'No mechanism',
          },
          stateValidation: {
            sentiment: 'good',
            description:
              'zkSTARKS are zero knowledge proofs that ensure state correctness.',
            warning: undefined,
            value: 'ZK proofs (ST)',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
            warning: undefined,
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'bad',
            description:
              'Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen.',
            warning: undefined,
            value: 'Cannot withdraw',
          },
        },
        warning: undefined,
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 1065267563.21,
            displayValue: '$1.06 B',
          },
          tvlBreakdown: {
            associated: 0.7063799622064153,
            ether: 0.21759383187405407,
            stable: 0.059156017386006926,
            other: 0.01687018853352363,
            label: '',
            warning:
              'The STRK token associated with Starknet accounts for 70.64% of the TVL!',
            warningSeverity: 'warning',
          },
          sevenDayChange: '-4.59%',
          tvlWarnings: [],
          marketShare: {
            value: 0.022733131818410565,
            displayValue: '2.27%',
          },
          excludedTokens: {
            tvl: {
              value: 312783902.1700001,
              displayValue: '$312.78 M',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0.7410728283708717,
              stable: 0.20147132270173498,
              other: 0.057455848927393006,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '-2.87%',
            tvlWarnings: [],
            marketShare: {
              value: 0.00805719970009917,
              displayValue: '0.81%',
            },
          },
        },
        tvlTooltip: undefined,
        purposes: ['Universal'],
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
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](https://github.com/NethermindEth/juno)',
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
      },
      {
        name: 'Manta Pacific',
        shortName: undefined,
        slug: 'mantapacific',
        provider: 'OP Stack',
        category: 'Optimium',
        riskValues: {
          dataAvailability: {
            sentiment: 'bad',
            description:
              'Proof construction and state derivation fully rely on data that is posted on Celestia. Sequencer tx roots are not checked against the Blobstream bridge data roots onchain, but L2 nodes can verify data availability by running a Celestia light client.',
            warning: undefined,
            value: 'External',
          },
          sequencerFailure: {
            sentiment: 'good',
            description:
              "In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 12h delay on this operation.",
            warning: undefined,
            value: 'Self sequence',
          },
          stateValidation: {
            sentiment: 'bad',
            description:
              'Currently the system permits invalid state roots. More details in project overview.',
            warning: undefined,
            value: 'In development',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
            warning: undefined,
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'bad',
            description:
              'Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen.',
            warning: undefined,
            value: 'Cannot withdraw',
          },
        },
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 880306282.4,
            displayValue: '$880.30 M',
          },
          tvlBreakdown: {
            associated: 0.65400879572321,
            ether: 0.18843280849678962,
            stable: 0.024561456520624282,
            other: 0.1329969392593761,
            label: '',
            warning:
              'The MANTA token associated with Manta Pacific accounts for 65.40% of the TVL!',
            warningSeverity: 'warning',
          },
          sevenDayChange: '+12.70%',
          tvlWarnings: [],
          marketShare: {
            value: 0.018786002174018223,
            displayValue: '1.88%',
          },
          excludedTokens: {
            tvl: {
              value: 304578230.78,
              displayValue: '$304.57 M',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0.544617337572677,
              stable: 0.07098867317151603,
              other: 0.384393989255807,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '-8.27%',
            tvlWarnings: [],
            marketShare: {
              value: 0.007845824585830382,
              displayValue: '0.78%',
            },
          },
        },
        tvlTooltip:
          'TVL includes canonically bridged, externally bridged and natively minted assets. Check "Value Locked" for more information.',
        purposes: ['Universal'],
        stage: {
          stage: 'NotApplicable',
        },
      },
      {
        name: 'ZKsync Era',
        shortName: undefined,
        slug: 'zksync-era',
        provider: 'ZK Stack',
        category: 'ZK Rollup',
        riskValues: {
          dataAvailability: {
            sentiment: 'good',
            description:
              'All of the data (SD = state diffs) needed for proof construction is published on chain.',
            warning: undefined,
            value: 'On chain (SD)',
          },
          sequencerFailure: {
            sentiment: 'warning',
            description:
              "Users can submit transactions to an L1 queue, but can't force them. The sequencer cannot selectively skip transactions but can stop processing the queue entirely. In other words, if the sequencer censors or is down, it is so for everyone.",
            warning: undefined,
            value: 'Enqueue via L1',
          },
          stateValidation: {
            sentiment: 'good',
            description:
              'Uses PLONK zero-knowledge proof system with KZG commitments.',
            warning: undefined,
            value: 'ZK proofs',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
            warning: undefined,
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'bad',
            description:
              'Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen.',
            warning: undefined,
            value: 'Cannot withdraw',
          },
        },
        warning:
          'Withdrawals are delayed by 21h. The length of the delay can be arbitrarily set by a MultiSig.',
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 859170334.01,
            displayValue: '$859.17 M',
          },
          tvlBreakdown: {
            associated: 0,
            ether: 0.6848742787051947,
            stable: 0.12757450192492825,
            other: 0.18755121936987698,
            label: '',
            warning: undefined,
            warningSeverity: 'warning',
          },
          sevenDayChange: '-3.87%',
          tvlWarnings: [],
          marketShare: {
            value: 0.0183349546461942,
            displayValue: '1.83%',
          },
          excludedTokens: {
            tvl: {
              value: 859170334.01,
              displayValue: '$859.17 M',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0.6848742787051947,
              stable: 0.12757450192492825,
              other: 0.18755121936987698,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '-3.87%',
            tvlWarnings: [],
            marketShare: {
              value: 0.022131915707596258,
              displayValue: '2.21%',
            },
          },
        },
        tvlTooltip:
          'TVL includes canonically bridged, externally bridged and natively minted assets. Check "Value Locked" for more information.',
        purposes: ['Universal'],
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
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](https://github.com/matter-labs/zksync-era)',
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
      },
      {
        name: 'Mode Network',
        shortName: undefined,
        slug: 'mode',
        provider: 'OP Stack',
        category: 'Optimistic Rollup',
        riskValues: {
          dataAvailability: {
            sentiment: 'good',
            description:
              'All of the data needed for proof construction is published on Ethereum L1.',
            warning: undefined,
            value: 'On chain',
          },
          sequencerFailure: {
            sentiment: 'good',
            description:
              "In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 12h delay on this operation.",
            warning: undefined,
            value: 'Self sequence',
          },
          stateValidation: {
            sentiment: 'bad',
            description:
              'Currently the system permits invalid state roots. More details in project overview.',
            warning: undefined,
            value: 'In development',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
            warning: undefined,
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'bad',
            description:
              'Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen.',
            warning: undefined,
            value: 'Cannot withdraw',
          },
        },
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 713362631.64,
            displayValue: '$713.36 M',
          },
          tvlBreakdown: {
            associated: 0.06719149543873071,
            ether: 0.11471793735797821,
            stable: 0.04062671817189552,
            other: 0.7774638490313956,
            label: '',
            warning: undefined,
            warningSeverity: 'warning',
          },
          sevenDayChange: '-2.98%',
          tvlWarnings: [],
          marketShare: {
            value: 0.015223374201438506,
            displayValue: '1.52%',
          },
          excludedTokens: {
            tvl: {
              value: 665430729.63,
              displayValue: '$665.43 M',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0.12298123012068146,
              stable: 0.04355311725100921,
              other: 0.8334656526283094,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '-1.90%',
            tvlWarnings: [],
            marketShare: {
              value: 0.017141253875327618,
              displayValue: '1.71%',
            },
          },
        },
        tvlTooltip:
          'TVL includes canonically bridged, externally bridged and natively minted assets. Check "Value Locked" for more information.',
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
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](https://github.com/ethereum-optimism/optimism/tree/develop/op-node)',
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
      },
      {
        name: 'Scroll',
        shortName: undefined,
        slug: 'scroll',
        provider: undefined,
        category: 'ZK Rollup',
        riskValues: {
          dataAvailability: {
            sentiment: 'good',
            description:
              'All of the data needed for proof construction is published on Ethereum L1.',
            warning: undefined,
            value: 'On chain',
          },
          sequencerFailure: {
            sentiment: 'bad',
            description:
              'There is no mechanism to have transactions be included if the sequencer is down or censoring.',
            warning: undefined,
            value: 'No mechanism',
          },
          stateValidation: {
            sentiment: 'good',
            description:
              'zkSNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
            warning: undefined,
            value: 'ZK proofs (SN)',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
            warning: undefined,
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'bad',
            description:
              'Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen.',
            warning: undefined,
            value: 'Cannot withdraw',
          },
        },
        warning: undefined,
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 672875228.33,
            displayValue: '$672.87 M',
          },
          tvlBreakdown: {
            associated: 0,
            ether: 0.33622352425054086,
            stable: 0.08514673708853132,
            other: 0.5786297386609277,
            label: '',
            warning: undefined,
            warningSeverity: 'warning',
          },
          sevenDayChange: '+6.08%',
          tvlWarnings: [],
          marketShare: {
            value: 0.014359360775874418,
            displayValue: '1.44%',
          },
          excludedTokens: {
            tvl: {
              value: 672875228.33,
              displayValue: '$672.87 M',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0.33622352425054086,
              stable: 0.08514673708853132,
              other: 0.5786297386609277,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '+6.08%',
            tvlWarnings: [],
            marketShare: {
              value: 0.017333021457600534,
              displayValue: '1.73%',
            },
          },
        },
        tvlTooltip:
          'TVL includes canonically bridged and externally bridged assets. Check "Value Locked" for more information.',
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
      },
      {
        name: 'Metis Andromeda',
        shortName: 'Metis',
        slug: 'metis',
        provider: 'OVM',
        category: 'Optimium',
        riskValues: {
          dataAvailability: {
            sentiment: 'bad',
            description:
              'Transaction data is kept in MEMO decentralized storage.',
            warning: undefined,
            value: 'External (MEMO)',
          },
          sequencerFailure: {
            sentiment: 'warning',
            description:
              "Users can submit transactions to an L1 queue, but can't force them. The sequencer cannot selectively skip transactions but can stop processing the queue entirely. In other words, if the sequencer censors or is down, it is so for everyone.",
            warning: undefined,
            value: 'Enqueue via L1',
          },
          stateValidation: {
            sentiment: 'bad',
            description:
              'Currently the system permits invalid state roots. More details in project overview.',
            warning: undefined,
            value: 'In development',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
            warning: undefined,
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'bad',
            description:
              'Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen.',
            warning: undefined,
            value: 'Cannot withdraw',
          },
        },
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 625463716.41,
            displayValue: '$625.46 M',
          },
          tvlBreakdown: {
            associated: 0.9172344622048929,
            ether: 0.028799424406886355,
            stable: 0.05333076283218703,
            other: 0.0006353505560337034,
            label: '',
            warning:
              'The Metis token associated with Metis Andromeda accounts for 91.72% of the TVL!',
            warningSeverity: 'bad',
          },
          sevenDayChange: '-2.64%',
          tvlWarnings: [
            {
              content:
                'The Metis token associated with Metis Andromeda accounts for 91.72% of the TVL!',
              sentiment: 'bad',
            },
          ],
          marketShare: {
            value: 0.013347584779485583,
            displayValue: '1.33%',
          },
          excludedTokens: {
            tvl: {
              value: 51766840.860000014,
              displayValue: '$51.76 M',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0.34796396150027675,
              stable: 0.6443595275634131,
              other: 0.007676510936309818,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '+2.01%',
            tvlWarnings: [],
            marketShare: {
              value: 0.0013334950160752818,
              displayValue: '0.13%',
            },
          },
        },
        tvlTooltip: undefined,
        purposes: ['Universal'],
        stage: {
          stage: 'NotApplicable',
        },
      },
      {
        name: 'dYdX v3',
        shortName: undefined,
        slug: 'dydx',
        provider: 'StarkEx',
        category: 'ZK Rollup',
        riskValues: {
          dataAvailability: {
            sentiment: 'good',
            description:
              'All of the data needed for proof construction is published on Ethereum L1.',
            warning: undefined,
            value: 'On chain',
          },
          sequencerFailure: {
            sentiment: 'good',
            description:
              'Users can force the sequencer to include a trade or a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for 14d, users can use the exit hatch to withdraw their funds. Users are required to find a counterparty for the trade by out of system means.',
            warning: undefined,
            value: 'Force via L1',
          },
          stateValidation: {
            sentiment: 'good',
            description:
              'zkSTARKS are zero knowledge proofs that ensure state correctness.',
            warning: undefined,
            value: 'ZK proofs (ST)',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'There is no exit window. Upgrades have a 9d delay, (or 2d if shortened by the Priority Controller), but withdrawals can be censored for up to 14d.',
            warning: undefined,
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'good',
            description:
              'Users are able to trustlessly exit by submitting a Merkle proof of funds. Positions will be closed using the average price from the last batch state update.',
            warning: undefined,
            value: 'Use escape hatch',
          },
        },
        warning:
          'This page describes dYdX v3, which is an L2 built on Ethereum. Recently deployed dYdX v4 is a separate blockchain based on Cosmos SDK, unrelated to Ethereum and is using different technology. No information on this page applies to dYdX v4.',
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 329837681.78,
            displayValue: '$329.83 M',
          },
          tvlBreakdown: {
            associated: 0,
            ether: 0,
            stable: 1,
            other: 0,
            label: '',
            warning: undefined,
            warningSeverity: 'warning',
          },
          sevenDayChange: '+0.32%',
          tvlWarnings: [],
          marketShare: {
            value: 0.007038835835749126,
            displayValue: '0.70%',
          },
          excludedTokens: {
            tvl: {
              value: 329837681.78,
              displayValue: '$329.83 M',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0,
              stable: 1,
              other: 0,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '+0.32%',
            tvlWarnings: [],
            marketShare: {
              value: 0.008496498868010209,
              displayValue: '0.85%',
            },
          },
        },
        tvlTooltip: undefined,
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
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](https://github.com/l2beat/starkex-explorer)',
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
      },
      {
        name: 'Immutable X',
        shortName: undefined,
        slug: 'immutablex',
        provider: 'StarkEx',
        category: 'Validium',
        riskValues: {
          dataAvailability: {
            sentiment: 'bad',
            description:
              'Proof construction relies fully on data that is NOT published on chain. There exists a Data Availability Committee (DAC) with a threshold of 5/7 that is tasked with protecting and supplying the data.',
            warning: undefined,
            value: 'External (DAC)',
          },
          sequencerFailure: {
            sentiment: 'good',
            description:
              'Users can force the sequencer to include a withdrawal transaction by submitting a request through L1. If the sequencer censors or is down for more than 7d, users can use the exit hatch to withdraw their funds.',
            warning: undefined,
            value: 'Force via L1',
          },
          stateValidation: {
            sentiment: 'good',
            description:
              'zkSTARKS are zero knowledge proofs that ensure state correctness.',
            warning: undefined,
            value: 'ZK proofs (ST)',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
            warning: undefined,
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'good',
            description:
              'Users are able to trustlessly exit by submitting a Merkle proof of funds. NFTs will be minted on L1 to exit.',
            warning: undefined,
            value: 'Use escape hatch',
          },
        },
        warning: undefined,
        hasImplementationChanged: true,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: true,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 192389633.75,
            displayValue: '$192.38 M',
          },
          tvlBreakdown: {
            associated: 0.7938166965817617,
            ether: 0.1266881642992888,
            stable: 0.004391118967967784,
            other: 0.07510402015098176,
            label: '',
            warning:
              'The IMX token associated with Immutable X accounts for 79.38% of the TVL!',
            warningSeverity: 'warning',
          },
          sevenDayChange: '-5.98%',
          tvlWarnings: [],
          marketShare: {
            value: 0.004105652941647199,
            displayValue: '0.41%',
          },
          excludedTokens: {
            tvl: {
              value: 39667530.22999999,
              displayValue: '$39.66 M',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0.614444342480558,
              stable: 0.021297160803852754,
              other: 0.3642584967155895,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '-2.17%',
            tvlWarnings: [],
            marketShare: {
              value: 0.00102182116936159,
              displayValue: '0.10%',
            },
          },
        },
        tvlTooltip: undefined,
        purposes: ['NFT', 'Exchange'],
        stage: {
          stage: 'NotApplicable',
        },
      },
      {
        name: 'RSS3 Value Sublayer',
        shortName: 'RSS3',
        slug: 'rss3',
        provider: 'OP Stack',
        category: 'Optimium',
        riskValues: {
          dataAvailability: {
            sentiment: 'bad',
            description:
              'Proof construction and state derivation rely fully on data that is NOT published on chain.',
            warning: undefined,
            value: 'External',
          },
          sequencerFailure: {
            sentiment: 'good',
            description:
              "In the event of a sequencer failure, users can force transactions to be included in the project's chain by sending them to L1. There is a 12h delay on this operation.",
            warning: undefined,
            value: 'Self sequence',
          },
          stateValidation: {
            sentiment: 'bad',
            description:
              'Currently the system permits invalid state roots. More details in project overview.',
            warning: undefined,
            value: 'In development',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'There is no window for users to exit in case of an unwanted upgrade since contracts are instantly upgradable.',
            warning: undefined,
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'bad',
            description:
              'Only the whitelisted proposers can publish state roots on L1, so in the event of failure the withdrawals are frozen.',
            warning: undefined,
            value: 'Cannot withdraw',
          },
        },
        warning:
          'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 166129217.76,
            displayValue: '$166.12 M',
          },
          tvlBreakdown: {
            associated: 1,
            ether: 0,
            stable: 0,
            other: 0,
            label: '',
            warning:
              'The RSS3 token associated with RSS3 Value Sublayer accounts for 100.00% of the TVL!',
            warningSeverity: 'bad',
          },
          sevenDayChange: '+5.34%',
          tvlWarnings: [
            {
              content:
                'The RSS3 token associated with RSS3 Value Sublayer accounts for 100.00% of the TVL!',
              sentiment: 'bad',
            },
          ],
          marketShare: {
            value: 0.0035452477261649342,
            displayValue: '0.35%',
          },
          excludedTokens: {
            tvl: {
              value: 0,
              displayValue: '$0.00',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0,
              stable: 0,
              other: 0,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '+0.00%',
            tvlWarnings: [],
            marketShare: {
              value: 0,
              displayValue: '0.00%',
            },
          },
        },
        tvlTooltip: undefined,
        purposes: ['AI', 'Information'],
        stage: {
          stage: 'NotApplicable',
        },
      },
      {
        name: 'Polygon zkEVM',
        shortName: undefined,
        slug: 'polygonzkevm',
        provider: 'Polygon',
        category: 'ZK Rollup',
        riskValues: {
          dataAvailability: {
            sentiment: 'good',
            description:
              'All of the data needed for proof construction is published on Ethereum L1. Unlike most ZK rollups transactions are posted instead of state diffs.',
            warning: undefined,
            value: 'On chain',
          },
          sequencerFailure: {
            sentiment: 'bad',
            description:
              'There is no mechanism to have transactions be included if the sequencer is down or censoring. Although the functionality exists in the code, it is currently disabled.',
            warning: undefined,
            value: 'No mechanism',
          },
          stateValidation: {
            sentiment: 'good',
            description:
              'zkSNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
            warning: undefined,
            value: 'ZK proofs (SN)',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'Even though there is a 10d Timelock for upgrades, forced transactions are disabled. Even if they were to be enabled, user withdrawals can be censored up to 15d.',
            warning: {
              value: 'The Security Council can remove the delay on upgrades.',
              sentiment: 'bad',
            },
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'good',
            description:
              'If the Proposer fails, users can leverage the source available prover to submit proofs to the L1 bridge. There is a 5d delay for proving and a 5d delay for finalizing state proven in this way. These delays can only be lowered except during the emergency state.',
            warning: undefined,
            value: 'Self propose',
          },
        },
        warning: 'The forced transaction mechanism is currently disabled.',
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: {
          tvl: {
            value: 164212917.11,
            displayValue: '$164.21 M',
          },
          tvlBreakdown: {
            associated: 0.4464012862087813,
            ether: 0.22312408886480195,
            stable: 0.18939282827042642,
            other: 0.1410817966559902,
            label: '',
            warning:
              'The POL and MATIC tokens associated with Polygon zkEVM account for 44.64% of the TVL!',
            warningSeverity: 'warning',
          },
          sevenDayChange: '-2.34%',
          tvlWarnings: [
            {
              content:
                'The TVL is currently shared among all projects using the shared Polygon CDK contracts.',
              sentiment: 'warning',
            },
          ],
          marketShare: {
            value: 0.0035043532910158117,
            displayValue: '0.35%',
          },
          excludedTokens: {
            tvl: {
              value: 90908059.70000002,
              displayValue: '$90.90 M',
            },
            tvlBreakdown: {
              associated: 0,
              ether: 0.40304300444771224,
              stable: 0.3421121175903834,
              other: 0.2548448779619041,
              label: '',
              warning: undefined,
              warningSeverity: 'warning',
            },
            sevenDayChange: '-1.71%',
            tvlWarnings: [
              {
                content:
                  'The TVL is currently shared among all projects using the shared Polygon CDK contracts.',
                sentiment: 'warning',
              },
            ],
            marketShare: {
              value: 0.0023417585952148472,
              displayValue: '0.23%',
            },
          },
        },
        tvlTooltip:
          'TVL includes canonically bridged and externally bridged assets. Check "Value Locked" for more information.',
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
                  satisfied: true,
                  description:
                    'A source-available node exists that can recreate the state from L1 data. Please note that the L2BEAT team has not verified the validity of the node source code. [View code](https://github.com/0xPolygonHermez/zkevm-node)',
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
      },
      {
        name: 'Astar zkEVM',
        shortName: undefined,
        slug: 'astarzkevm',
        provider: 'Polygon',
        category: 'Validium',
        riskValues: {
          dataAvailability: {
            sentiment: 'bad',
            description:
              'Proof construction relies fully on data that is NOT published on chain. There exists a Data Availability Committee (DAC) with a threshold of 3/5 that is tasked with protecting and supplying the data.',
            warning: undefined,
            value: 'External (DAC)',
          },
          sequencerFailure: {
            sentiment: 'bad',
            description:
              'There is no mechanism to have transactions be included if the sequencer is down or censoring. Although the functionality exists in the code, it is currently disabled.',
            warning: undefined,
            value: 'No mechanism',
          },
          stateValidation: {
            sentiment: 'good',
            description:
              'zkSNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
            warning: undefined,
            value: 'ZK proofs (SN)',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'Even though there is a 10d Timelock for upgrades, forced transactions are disabled. Even if they were to be enabled, user withdrawals can be censored up to 15d.',
            warning: {
              value: 'The Security Council can remove the delay on upgrades.',
              sentiment: 'bad',
            },
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'good',
            description:
              'If the Proposer fails, users can leverage the source available prover to submit proofs to the L1 bridge. There is a 5d delay for proving and a 5d delay for finalizing state proven in this way. These delays can only be lowered except during the emergency state.',
            warning: undefined,
            value: 'Self propose',
          },
        },
        warning: undefined,
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: undefined,
        tvlTooltip: undefined,
        purposes: ['Universal'],
        stage: {
          stage: 'NotApplicable',
        },
      },
      {
        name: 'X Layer',
        shortName: undefined,
        slug: 'xlayer',
        provider: 'Polygon',
        category: 'Validium',
        riskValues: {
          dataAvailability: {
            sentiment: 'bad',
            description:
              'Proof construction relies fully on data that is NOT published on chain. There exists a Data Availability Committee (DAC) with a threshold of 2/2 that is tasked with protecting and supplying the data.',
            warning: undefined,
            value: 'External (DAC)',
          },
          sequencerFailure: {
            sentiment: 'bad',
            description:
              'There is no mechanism to have transactions be included if the sequencer is down or censoring. Although the functionality exists in the code, it is currently disabled.',
            warning: undefined,
            value: 'No mechanism',
          },
          stateValidation: {
            sentiment: 'good',
            description:
              'zkSNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
            warning: undefined,
            value: 'ZK proofs (SN)',
          },
          exitWindow: {
            sentiment: 'bad',
            description:
              'Even though there is a 10d Timelock for upgrades, forced transactions are disabled. Even if they were to be enabled, user withdrawals can be censored up to 15d.',
            warning: {
              value: 'The Security Council can remove the delay on upgrades.',
              sentiment: 'bad',
            },
            value: 'None',
          },
          proposerFailure: {
            sentiment: 'good',
            description:
              'If the Proposer fails, users can leverage the source available prover to submit proofs to the L1 bridge. There is a 5d delay for proving and a 5d delay for finalizing state proven in this way. These delays can only be lowered except during the emergency state.',
            warning: undefined,
            value: 'Self propose',
          },
        },
        warning: undefined,
        hasImplementationChanged: false,
        isVerified: true,
        isArchived: undefined,
        showProjectUnderReview: false,
        isUpcoming: undefined,
        redWarning: undefined,
        data: undefined,
        tvlTooltip: undefined,
        purposes: ['Universal'],
        stage: {
          stage: 'NotApplicable',
        },
      },
    ],
    layer3s: [
      {
        name: 'Xai',
        shortName: undefined,
        slug: 'xai',
        provider: 'Arbitrum',
        warning: undefined,
        isArchived: undefined,
        isUpcoming: true,
        purposes: ['Gaming'],
        category: 'Optimium',
        data: {
          tvl: {
            displayValue: '$95.74 M',
            value: 95740000,
          },
          tvlBreakdown: {
            associated: 0.6996537656690529,
            ether: 0.14096022461913743,
            stable: 0.011848942787376374,
            other: 0.14753706692443325,
            label:
              'IMX – 69.97%<br>Ether – 14.10%<br>Stablecoins – 1.18%<br>Other – 14.75%',
            warning:
              'The IMX token associated with Immutable X accounts for 69.97% of the Value Locked!',
            warningSeverity: 'warning',
          },
          sevenDayChange: '-13.36%',
          tvlWarnings: [],
          excludedTokens: {
            tvl: {
              displayValue: '$95.74 M',
              value: 95740000,
            },
            tvlBreakdown: {
              associated: 0.6996537656690529,
              ether: 0.14096022461913743,
              stable: 0.011848942787376374,
              other: 0.14753706692443325,
              label:
                'IMX – 69.97%<br>Ether – 14.10%<br>Stablecoins – 1.18%<br>Other – 14.75%',
              warning:
                'The IMX token associated with Immutable X accounts for 69.97% of the Value Locked!',
              warningSeverity: 'warning',
            },
            tvlWarnings: [],
            sevenDayChange: '-13.36%',
          },
        },
      },
    ],
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTables()
        configureTabs()
        configureProjectFilters()
        configureOverflowWrappers()
      }, [])
      return <Story />
    },
  ],
  parameters: {
    chromatic: {
      modes: onlyDesktopModes,
    },
  },
} satisfies Meta<typeof ScalingSummaryView>
export default meta

type Story = StoryObj<typeof ScalingSummaryView>

export const Layer2s: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const layer2sTab = canvas.getByText('Layer 2 projects')
    await userEvent.click(canvas.getByText('Layer 2 projects'), { delay: 25 })
    setTimeout(() => layer2sTab.blur(), 1000)
  },
}

export const Layer2sWithRollupsOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Layer 2 projects'), { delay: 25 })
    await userEvent.click(canvas.getByText('Rollups only'))
  },
}

export const Upcoming: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Upcoming projects'), { delay: 25 })
  },
}

export const UpcomingWithRollupsOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Upcoming projects'), { delay: 25 })
    await userEvent.click(canvas.getByText('Rollups only'))
  },
}

export const Archived: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Archived projects'), { delay: 25 })
  },
}

export const ArchivedWithRollupsOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Archived projects'), { delay: 25 })
    await userEvent.click(canvas.getByText('Rollups only'))
  },
}
