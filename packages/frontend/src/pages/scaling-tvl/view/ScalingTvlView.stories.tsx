import { Meta, StoryObj } from '@storybook/react'
import React, { useEffect } from 'react'

import { PageContent } from '../../../components/PageContent'
import { Tooltip } from '../../../components/Tooltip'
import { configureTabs } from '../../../scripts/configureTabs'
import { configureTooltips } from '../../../scripts/configureTooltips'
import { click } from '../../../utils/storybook/click'
import { ScalingTvlView } from './ScalingTvlView'

const meta = {
  title: 'Pages/Scaling/TvlView',
  component: ScalingTvlView,
  args: {
    items: [
      {
        name: 'Base',
        slug: 'base',
        provider: 'Optimism',
        riskValues: {
          dataAvailability: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          sequencerFailure: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          stateValidation: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          upgradeability: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          proposerFailure: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
        },
        warning: undefined,
        isVerified: true,
        isArchived: undefined,
        isUpcoming: true,
        tvl: '$0.00',
        tvlBreakdown: {
          empty: true,
          associated: 0,
          ether: 0,
          stable: 0,
          other: 0,
          label: 'No tokens',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '+0.00%',
        sevenDayChange: '+0.00%',
        marketShare: '0.00%',
        purpose: 'Universal',
        technology: 'Optimistic Rollup',
        stage: undefined,
      },
      {
        name: 'Linea',
        slug: 'linea',
        provider: undefined,
        riskValues: {
          dataAvailability: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          sequencerFailure: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          stateValidation: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          upgradeability: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          proposerFailure: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
        },
        warning: undefined,
        isVerified: true,
        isArchived: undefined,
        isUpcoming: true,
        tvl: '$0.00',
        tvlBreakdown: {
          empty: true,
          associated: 0,
          ether: 0,
          stable: 0,
          other: 0,
          label: 'No tokens',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '+0.00%',
        sevenDayChange: '+0.00%',
        marketShare: '0.00%',
        purpose: 'Universal',
        technology: 'ZK Rollup',
        stage: undefined,
      },
      {
        name: 'Mantle',
        slug: 'mantle',
        provider: undefined,
        riskValues: {
          dataAvailability: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          sequencerFailure: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          stateValidation: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          upgradeability: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          proposerFailure: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
        },
        warning: undefined,
        isVerified: true,
        isArchived: undefined,
        isUpcoming: true,
        tvl: '$0.00',
        tvlBreakdown: {
          empty: true,
          associated: 0,
          ether: 0,
          stable: 0,
          other: 0,
          label: 'No tokens',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '+0.00%',
        sevenDayChange: '+0.00%',
        marketShare: '0.00%',
        purpose: 'Universal',
        technology: 'Optimistic Chain',
        stage: undefined,
      },
      {
        name: 'Scroll',
        slug: 'scroll',
        provider: undefined,
        riskValues: {
          dataAvailability: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          sequencerFailure: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          stateValidation: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          upgradeability: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          proposerFailure: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
        },
        warning: undefined,
        isVerified: true,
        isArchived: undefined,
        isUpcoming: true,
        tvl: '$0.00',
        tvlBreakdown: {
          empty: true,
          associated: 0,
          ether: 0,
          stable: 0,
          other: 0,
          label: 'No tokens',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '+0.00%',
        sevenDayChange: '+0.00%',
        marketShare: '0.00%',
        purpose: 'Universal',
        technology: 'ZK Rollup',
        stage: undefined,
      },
      {
        name: 'Taiko',
        slug: 'taiko',
        provider: undefined,
        riskValues: {
          dataAvailability: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          sequencerFailure: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          stateValidation: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          upgradeability: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
          proposerFailure: {
            value: '',
            description: 'No information available.',
            sentiment: 'neutral',
          },
        },
        warning: undefined,
        isVerified: true,
        isArchived: undefined,
        isUpcoming: true,
        tvl: '$0.00',
        tvlBreakdown: {
          empty: true,
          associated: 0,
          ether: 0,
          stable: 0,
          other: 0,
          label: 'No tokens',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '+0.00%',
        sevenDayChange: '+0.00%',
        marketShare: '0.00%',
        purpose: 'Universal',
        technology: 'ZK Rollup',
        stage: undefined,
      },
      {
        name: 'ZKSwap 1.0',
        slug: 'zkswap',
        provider: 'zkSync',
        riskValues: {
          dataAvailability: {
            value: 'On chain',
            description:
              'All of the data needed for proof construction is published on chain.',
            sentiment: 'good',
          },
          sequencerFailure: {
            value: 'Force exit to L1',
            description:
              'The user is only able to submit an L1 withdrawal request and force the sequencer to include it on L2. After that the user exits the system with their funds.',
            sentiment: 'good',
          },
          stateValidation: {
            value: 'ZK proofs (SN)',
            description:
              'ZK-SNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
            sentiment: 'good',
          },
          upgradeability: {
            value: '8 days delay',
            description:
              'The code that secures the system can be changed arbitrarily but users have some time to react.',
            sentiment: 'warning',
          },
          proposerFailure: {
            value: 'Escape hatch (ZK)',
            description:
              'Users are able to trustlessly exit by submitting a zero knowledge proof of funds.',
            sentiment: 'warning',
          },
        },
        warning:
          'Version 3 of the protocol called ZkSpace is available and users are encouraged to move their assets there.',
        isVerified: false,
        isArchived: true,
        isUpcoming: undefined,
        tvl: '$2.10 M',
        tvlBreakdown: {
          empty: false,
          associated: 0.0853887859117437,
          ether: 0.31752242264719316,
          stable: 0.1754928641590603,
          other: 0.4215959272820028,
          label:
            'ZKS – 8.54%<br>Ether – 31.75%<br>Stablecoins – 17.55%<br>Other – 42.16%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '-3.28%',
        sevenDayChange: '-6.69%',
        marketShare: '0.02%',
        purpose: 'Payments, AMM',
        technology: 'ZK Rollup',
        stage: undefined,
      },
      {
        name: 'Polygon Hermez',
        slug: 'hermez',
        provider: undefined,
        riskValues: {
          dataAvailability: {
            value: 'On chain',
            description:
              'All of the data needed for proof construction is published on chain.',
            sentiment: 'good',
          },
          sequencerFailure: {
            value: 'Force exit to L1',
            description:
              'The user is only able to submit an L1 withdrawal request and force the sequencer to include it on L2. After that the user exits the system with their funds.',
            sentiment: 'good',
          },
          stateValidation: {
            value: 'ZK proofs (SN)',
            description:
              'ZK-SNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
            sentiment: 'good',
          },
          upgradeability: {
            value: '7 days delay',
            description:
              'The code that secures the system can be changed arbitrarily but users have some time to react.',
            sentiment: 'warning',
          },
          proposerFailure: {
            value: 'Propose blocks (ZK)',
            description:
              'The user needs to run their own node and use it to propose new blocks to replace the validator. Proposing new blocks requires creating ZK proofs which are very computationally expensive.',
            sentiment: 'warning',
          },
        },
        warning:
          'Hermez and Polygon have recently merged. Hermez and Polygon Hermez are two names for the same rollup.',
        isVerified: true,
        isArchived: true,
        isUpcoming: undefined,
        tvl: '$318 K',
        tvlBreakdown: {
          empty: false,
          associated: 0,
          ether: 0.16329741189789196,
          stable: 0.09245415103824679,
          other: 0.7442484370638612,
          label: 'Ether – 16.33%<br>Stablecoins – 9.25%<br>Other – 74.42%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '-0.63%',
        sevenDayChange: '-2.40%',
        marketShare: '0.00%',
        purpose: 'Payments',
        technology: 'ZK Rollup',
        stage: undefined,
      },
      {
        name: 'ZKSwap 2.0',
        slug: 'zkswap2',
        provider: 'zkSync',
        riskValues: {
          dataAvailability: {
            value: 'On chain',
            description:
              'All of the data needed for proof construction is published on chain.',
            sentiment: 'good',
          },
          sequencerFailure: {
            value: 'Force exit to L1',
            description:
              'The user is only able to submit an L1 withdrawal request and force the sequencer to include it on L2. After that the user exits the system with their funds.',
            sentiment: 'good',
          },
          stateValidation: {
            value: 'ZK proofs (SN)',
            description:
              'ZK-SNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
            sentiment: 'good',
          },
          upgradeability: {
            value: '8 days delay',
            description:
              'The code that secures the system can be changed arbitrarily but users have some time to react.',
            sentiment: 'warning',
          },
          proposerFailure: {
            value: 'Escape hatch (ZK)',
            description:
              'Users are able to trustlessly exit by submitting a zero knowledge proof of funds.',
            sentiment: 'warning',
          },
        },
        warning:
          'Version 3 of the protocol called ZkSpace is available and users are encouraged to move their assets there.',
        isVerified: false,
        isArchived: true,
        isUpcoming: undefined,
        tvl: '$238 K',
        tvlBreakdown: {
          empty: false,
          associated: 0.4465246475306472,
          ether: 0.24771855202884424,
          stable: 0.3005893110458202,
          other: 0.005167489394688509,
          label:
            'ZKS – 44.65%<br>Ether – 24.77%<br>Stablecoins – 30.06%<br>Other – 0.52%',
          warning:
            'The ZKS token associated with ZKSwap 2.0 accounts for 44.65% of the TVL!',
          warningSeverity: 'warning',
        },
        oneDayChange: '-2.67%',
        sevenDayChange: '-4.12%',
        marketShare: '0.00%',
        purpose: 'Payments, AMM',
        technology: 'ZK Rollup',
        stage: undefined,
      },
      {
        name: 'Gluon',
        slug: 'gluon',
        provider: undefined,
        riskValues: {
          dataAvailability: {
            value: 'External',
            description:
              'Proof construction relies fully on data that is NOT published on chain.',
            sentiment: 'bad',
          },
          sequencerFailure: {
            value: 'Exit to L1',
            description:
              'The user is only able to submit an L1 withdrawal request. After that the user exits the system with their funds.',
            sentiment: 'good',
          },
          stateValidation: {
            value: 'Fraud proofs (!)',
            description:
              'Fraud proofs allow actors watching the chain to prove that the state is incorrect. Because the data is not present on chain the security of fraud proofs is severely weakened.',
            sentiment: 'warning',
          },
          upgradeability: {
            value: 'Yes',
            description:
              'The code that secures the system can be changed arbitrarily and without notice.',
            sentiment: 'bad',
          },
          proposerFailure: {
            value: 'Escape hatch (MP)',
            description:
              'Users are able to trustlessly exit by submitting a merkle proof of funds.',
            sentiment: 'good',
          },
        },
        warning:
          'LeverJ trading platform appears to be in a maintenance mode as the team moved to build NFT trading platform. Social medias associated with the project are silent since mid 2021.',
        isVerified: true,
        isArchived: true,
        isUpcoming: undefined,
        tvl: '$65.60 K',
        tvlBreakdown: {
          empty: false,
          associated: 0.5028382192182544,
          ether: 0.15792256558799808,
          stable: 0.3392392151937476,
          other: 0,
          label: 'L2 – 50.28%<br>Ether – 15.79%<br>Stablecoins – 33.92%',
          warning:
            'The L2 token associated with Gluon accounts for 50.28% of the TVL!',
          warningSeverity: 'warning',
        },
        oneDayChange: '+27.17%',
        sevenDayChange: '-32.13%',
        marketShare: '0.00%',
        purpose: 'Exchange',
        technology: 'Plasma',
        stage: undefined,
      },
      {
        name: 'OMG Network',
        slug: 'omgnetwork',
        provider: undefined,
        riskValues: {
          dataAvailability: {
            value: 'External',
            description:
              'Proof construction relies fully on data that is NOT published on chain.',
            sentiment: 'bad',
          },
          sequencerFailure: {
            value: 'Exit to L1',
            description:
              'The user is only able to submit an L1 withdrawal request. After that the user exits the system with their funds.',
            sentiment: 'good',
          },
          stateValidation: {
            value: 'Exits only',
            description:
              'Exits from the network are subject to a period when they can be challenged. The internal network state is left unchecked.',
            sentiment: 'bad',
          },
          upgradeability: {
            value: 'Yes',
            description:
              'The code that secures the system can be changed arbitrarily and without notice.',
            sentiment: 'bad',
          },
          proposerFailure: {
            value: 'Escape hatch (?)',
            description:
              'Users are able to exit the system. The details are unknown.',
            sentiment: 'warning',
          },
        },
        warning: undefined,
        isVerified: false,
        isArchived: true,
        isUpcoming: undefined,
        tvl: '$42.92 K',
        tvlBreakdown: {
          empty: false,
          associated: 0.06320958328246715,
          ether: 0.7138106119132178,
          stable: 0.20433552298670088,
          other: 0.018644281817614204,
          label:
            'OMG – 6.32%<br>Ether – 71.38%<br>Stablecoins – 20.43%<br>Other – 1.86%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '-3.48%',
        sevenDayChange: '-7.42%',
        marketShare: '0.00%',
        purpose: 'Payments',
        technology: 'Plasma',
        stage: undefined,
      },
      {
        name: 'L2.Finance-zk',
        slug: 'layer2financezk',
        provider: 'StarkEx',
        riskValues: {
          dataAvailability: {
            value: 'External (DAC)',
            description:
              'Proof construction relies fully on data that is NOT published on chain. There exists a data availability committee (DAC) that is tasked with protecting and supplying the data.',
            sentiment: 'warning',
          },
          sequencerFailure: {
            value: 'Force exit to L1',
            description:
              'The user can force the the sequencer to include their withdrawal transaction by submitting a request through L1. If the sequencer is down, the user can use the exit hatch to withdraw funds.',
            sentiment: 'good',
          },
          stateValidation: {
            value: 'ZK proofs (ST)',
            description:
              'ZK-STARKS are zero knowledge proofs that ensure state correctness.',
            sentiment: 'good',
          },
          upgradeability: {
            value: 'Yes',
            description:
              'The code that secures the system can be changed arbitrarily and without notice.',
            sentiment: 'bad',
          },
          proposerFailure: {
            value: 'Escape hatch (MP)',
            description:
              'Users are able to trustlessly exit by submitting a merkle proof of funds.',
            sentiment: 'good',
          },
        },
        warning:
          'Layer2.finance-ZK has been shut down, users are encouraged to use optimistic rollup version.',
        isVerified: false,
        isArchived: true,
        isUpcoming: undefined,
        tvl: '$3.80 K',
        tvlBreakdown: {
          empty: false,
          associated: 0,
          ether: 0.2848073348246637,
          stable: 0.6173923774115967,
          other: 0.09780028776373967,
          label: 'Ether – 28.48%<br>Stablecoins – 61.74%<br>Other – 9.78%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '-1.46%',
        sevenDayChange: '-2.76%',
        marketShare: '0.00%',
        purpose: 'DeFi protocols',
        technology: 'Validium',
        stage: undefined,
      },
      {
        name: 'Arbitrum One',
        slug: 'arbitrum',
        provider: undefined,
        riskValues: {
          dataAvailability: {
            value: 'On chain',
            description:
              'All of the data needed for proof construction is published on chain.',
            sentiment: 'good',
          },
          sequencerFailure: {
            value: 'Transact using L1',
            description:
              'In the event of sequencer failure, after 1d (5760 blocks) user can force the transaction to be included in the L2 chain by sending it to the L1.',
            sentiment: 'good',
          },
          stateValidation: {
            value: 'Fraud proofs (INT)',
            description:
              'Fraud proofs allow WHITELISTED actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve.',
            sentiment: 'warning',
          },
          upgradeability: {
            value: '13d or no delay',
            description:
              'There is a 13 days delay for upgrades initiated by the DAO that can be canceled by the 9/12 Security Council multisig. This multisig can also upgrade with no delay',
            sentiment: 'warning',
          },
          proposerFailure: {
            value: 'Propose blocks',
            description:
              'Anyone can become a Validator after approximately 7 days (45818 blocks) of inactivity from the currently whitelisted Validators.',
            sentiment: 'good',
          },
        },
        warning:
          'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
        isVerified: true,
        isArchived: undefined,
        isUpcoming: undefined,
        tvl: '$5.68 B',
        tvlBreakdown: {
          empty: false,
          associated: 0.25000137161168967,
          ether: 0.33752308646138407,
          stable: 0.3418472246673708,
          other: 0.07062831725955551,
          label:
            'ARB – 25.00%<br>Ether – 33.75%<br>Stablecoins – 34.18%<br>Other – 7.06%',
          warning:
            'The ARB token associated with Arbitrum One accounts for 25.00% of the TVL!',
          warningSeverity: 'warning',
        },
        oneDayChange: '-2.44%',
        sevenDayChange: '-7.73%',
        marketShare: '66.75%',
        purpose: 'Universal',
        technology: 'Optimistic Rollup',
        stage: {
          stage: 'Stage 0',
          missing: {
            nextStage: 'Stage 1',
            requirements: ['B requirement'],
          },
          summary: [
            {
              stage: 'Stage 0',
              requirements: [{ satisfied: true, description: 'A requirement' }],
            },
            {
              stage: 'Stage 1',
              requirements: [
                { satisfied: false, description: 'B requirement' },
              ],
            },
          ],
        },
      },
      {
        name: 'Optimism',
        slug: 'optimism',
        provider: 'Optimism',
        riskValues: {
          dataAvailability: {
            value: 'On chain',
            description:
              'All of the data needed for proof construction is published on chain.',
            sentiment: 'good',
          },
          sequencerFailure: {
            value: 'Transact using L1',
            description:
              'The user is able to submit a transaction through L1 and force its inclusion on L2.',
            sentiment: 'good',
          },
          stateValidation: {
            value: 'In development',
            description:
              'Currently the system permits invalid state roots. More details in project overview.',
            sentiment: 'bad',
          },
          upgradeability: {
            value: 'Yes',
            description:
              'The code that secures the system can be changed arbitrarily and without notice.',
            sentiment: 'bad',
          },
          proposerFailure: {
            value: 'No mechanism',
            description:
              'If the whitelisted validator goes down, withdrawals cannot be processed. Users can still transact on L2.',
            sentiment: 'bad',
          },
        },
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
        isVerified: true,
        isArchived: undefined,
        isUpcoming: undefined,
        tvl: '$1.65 B',
        tvlBreakdown: {
          empty: false,
          associated: 0.20059416417864723,
          ether: 0.30997784466438966,
          stable: 0.31273438344767346,
          other: 0.17669360770928963,
          label:
            'OP – 20.06%<br>Ether – 31.00%<br>Stablecoins – 31.27%<br>Other – 17.67%',
          warning:
            'The OP token associated with Optimism accounts for 20.06% of the TVL!',
          warningSeverity: 'warning',
        },
        oneDayChange: '-3.42%',
        sevenDayChange: '-10.76%',
        marketShare: '19.46%',
        purpose: 'Universal',
        technology: 'Optimistic Rollup',
        stage: undefined,
      },
      {
        name: 'dYdX',
        slug: 'dydx',
        provider: 'StarkEx',
        riskValues: {
          dataAvailability: {
            value: 'On chain',
            description:
              'All of the data needed for proof construction is published on chain.',
            sentiment: 'good',
          },
          sequencerFailure: {
            value: 'Force trade/exit to L1',
            description:
              'The user can force the sequencer to include a trade or withdrawal transaction by submitting a request through L1. The user is required to find a counterparty for the trade by out of system means. If the sequencer is down, the user can use the exit hatch to withdraw funds.',
            sentiment: 'warning',
          },
          stateValidation: {
            value: 'ZK proofs (ST)',
            description:
              'ZK-STARKS are zero knowledge proofs that ensure state correctness.',
            sentiment: 'good',
          },
          upgradeability: {
            value: 'Yes',
            description:
              'The code that secures the system can be changed arbitrarily and without notice.',
            sentiment: 'bad',
          },
          proposerFailure: {
            value: 'Escape hatch (MP)',
            description:
              'Users are able to trustlessly exit their collateral by submitting a merkle proof of funds. Positions will be closed using average price from the last batch state update.',
            sentiment: 'good',
          },
        },
        warning: undefined,
        isVerified: true,
        isArchived: undefined,
        isUpcoming: undefined,
        tvl: '$347 M',
        tvlBreakdown: {
          empty: false,
          associated: 0,
          ether: 0,
          stable: 1,
          other: 0,
          label: 'Stablecoins – 100.00%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '+0.49%',
        sevenDayChange: '+3.96%',
        marketShare: '4.08%',
        purpose: 'Exchange',
        technology: 'ZK Rollup',
        stage: undefined,
      },
      {
        name: 'zkSync Era',
        slug: 'zksync-era',
        provider: 'zkSync',
        riskValues: {
          dataAvailability: {
            value: 'On chain (SD)',
            description:
              'All of the data (SD = state diffs) needed for proof construction is published on chain.',
            sentiment: 'good',
          },
          sequencerFailure: {
            value: 'Transact using L1',
            description:
              'L2 transactions can be forced through L1 by adding them to append only queue on L1, which is processed sequentially by Sequencer, meaning that the individual user cannot be censored. At the moment there is no mechanism that forces L2 Sequencer to empty the L1 queue.',
            sentiment: 'warning',
          },
          stateValidation: {
            value: 'ZK proofs',
            description:
              'Uses PLONK zero-knowledge proof system with KZG commitments.',
            sentiment: 'good',
          },
          upgradeability: {
            value: 'Yes',
            description:
              'The code that secures the system can be changed arbitrarily and without notice by the governor, that currently is a 4 / 7 Multisig.',
            sentiment: 'bad',
          },
          proposerFailure: {
            value: 'No mechanism',
            description:
              'Only whitelisted validators can update the state on L1, so in the event of failure the withdrawals are blocked.',
            sentiment: 'bad',
          },
        },
        warning:
          'Withdrawals are delayed by 1d. The length of the delay can be arbitrarily set by a MultiSig.',
        isVerified: true,
        isArchived: undefined,
        isUpcoming: undefined,
        tvl: '$236 M',
        tvlBreakdown: {
          empty: false,
          associated: 0,
          ether: 0.6048822341283192,
          stable: 0.3648893886142565,
          other: 0.0302283772574242,
          label: 'Ether – 60.49%<br>Stablecoins – 36.49%<br>Other – 3.02%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '-2.25%',
        sevenDayChange: '-8.56%',
        marketShare: '2.77%',
        purpose: 'Universal',
        technology: 'ZK Rollup',
        stage: undefined,
      },
      {
        name: 'Metis Andromeda',
        slug: 'metis',
        provider: 'Optimism',
        riskValues: {
          dataAvailability: {
            value: 'Optimistic (MEMO)',
            description:
              'Transaction data is kept in MEMO decentralized storage. Validators can force Sequencer to make data available on-chain via L1 contract call if they find that Sequencer did not push tx data to MEMO.     Challenge mechanizm is not yet fully implemented.',
            sentiment: 'warning',
          },
          sequencerFailure: {
            value: 'Transact using L1',
            description:
              'The user is able to submit a transaction through L1 and force its inclusion on L2.',
            sentiment: 'good',
          },
          stateValidation: {
            value: 'In development',
            description:
              'Currently the system permits invalid state roots. More details in project overview.',
            sentiment: 'bad',
          },
          upgradeability: {
            value: 'Yes',
            description:
              'The code that secures the system can be changed arbitrarily and without notice.',
            sentiment: 'bad',
          },
          proposerFailure: {
            value: 'No mechanism',
            description:
              'If the whitelisted validator goes down, withdrawals cannot be processed. Users can still transact on L2.',
            sentiment: 'bad',
          },
        },
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.       Since April 2022 the transaction data is no longer kept on-chain, instead it is kept in MEMO distributed data storage system.       The optimistic challenge mechanism that allows Validators to force Sequencer to post missing data is not fully implemented yet.',
        isVerified: true,
        isArchived: undefined,
        isUpcoming: undefined,
        tvl: '$108 M',
        tvlBreakdown: {
          empty: false,
          associated: 0.5396893906261344,
          ether: 0.05179250906979395,
          stable: 0.40452030240916287,
          other: 0.003997797894908878,
          label:
            'Metis – 53.97%<br>Ether – 5.18%<br>Stablecoins – 40.45%<br>Other – 0.40%',
          warning:
            'The Metis token associated with Metis Andromeda accounts for 53.97% of the TVL!',
          warningSeverity: 'warning',
        },
        oneDayChange: '-3.15%',
        sevenDayChange: '-10.62%',
        marketShare: '1.27%',
        purpose: 'Universal',
        technology: 'Optimistic Chain',
        stage: undefined,
      },
      {
        name: 'Loopring',
        slug: 'loopring',
        provider: undefined,
        riskValues: {
          dataAvailability: {
            value: 'On chain',
            description:
              'All of the data needed for proof construction is published on chain.',
            sentiment: 'good',
          },
          sequencerFailure: {
            value: 'Force exit to L1',
            description:
              'The user is only able to submit an L1 withdrawal request and force the sequencer to include it on L2. After that the user exits the system with their funds.',
            sentiment: 'good',
          },
          stateValidation: {
            value: 'ZK proofs (SN)',
            description:
              'ZK-SNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
            sentiment: 'good',
          },
          upgradeability: {
            value: 'Yes',
            description:
              'The code that secures the system can be changed arbitrarily and without notice.',
            sentiment: 'bad',
          },
          proposerFailure: {
            value: 'Escape hatch (MP)',
            description:
              'Users are able to trustlessly exit by submitting a merkle proof of funds.',
            sentiment: 'good',
          },
        },
        warning: undefined,
        isVerified: true,
        isArchived: undefined,
        isUpcoming: undefined,
        tvl: '$106 M',
        tvlBreakdown: {
          empty: false,
          associated: 0.5495338969521688,
          ether: 0.2699220974322546,
          stable: 0.1378002128537851,
          other: 0.04274379276179153,
          label:
            'LRC – 54.95%<br>Ether – 26.99%<br>Stablecoins – 13.78%<br>Other – 4.27%',
          warning:
            'The LRC token associated with Loopring accounts for 54.95% of the TVL!',
          warningSeverity: 'warning',
        },
        oneDayChange: '-2.30%',
        sevenDayChange: '-10.45%',
        marketShare: '1.25%',
        purpose: 'Tokens, NFTs, AMM',
        technology: 'ZK Rollup',
        stage: undefined,
      },
      {
        name: 'Immutable X',
        slug: 'immutablex',
        provider: 'StarkEx',
        riskValues: {
          dataAvailability: {
            value: 'External (DAC)',
            description:
              'Proof construction relies fully on data that is NOT published on chain. There exists a data availability committee (DAC) that is tasked with protecting and supplying the data.',
            sentiment: 'warning',
          },
          sequencerFailure: {
            value: 'Force exit to L1',
            description:
              'The user can force the the sequencer to include their withdrawal transaction by submitting a request through L1. If the sequencer is down, the user can use the exit hatch to withdraw funds.',
            sentiment: 'good',
          },
          stateValidation: {
            value: 'ZK proofs (ST)',
            description:
              'ZK-STARKS are zero knowledge proofs that ensure state correctness.',
            sentiment: 'good',
          },
          upgradeability: {
            value: '14d delay',
            description:
              'The code that secures the system can be changed arbitrarily but users have some time to react.',
            sentiment: 'warning',
          },
          proposerFailure: {
            value: 'Escape hatch (MP)',
            description:
              'Users are able to trustlessly exit by submitting a merkle proof of their assets. NFTs will be minted on L1 on exit.',
            sentiment: 'good',
          },
        },
        warning: undefined,
        isVerified: true,
        isArchived: undefined,
        isUpcoming: undefined,
        tvl: '$95.74 M',
        tvlBreakdown: {
          empty: false,
          associated: 0.6996537656690529,
          ether: 0.14096022461913743,
          stable: 0.011848942787376374,
          other: 0.14753706692443325,
          label:
            'IMX – 69.97%<br>Ether – 14.10%<br>Stablecoins – 1.18%<br>Other – 14.75%',
          warning:
            'The IMX token associated with Immutable X accounts for 69.97% of the TVL!',
          warningSeverity: 'warning',
        },
        oneDayChange: '-0.37%',
        sevenDayChange: '-13.36%',
        marketShare: '1.12%',
        purpose: 'NFT, Exchange',
        technology: 'Validium',
        stage: undefined,
      },
    ],
    stagesEnabled: true,
  },
  decorators: [
    (Story) => (
      <>
        <PageContent>
          <Story />
        </PageContent>
        <Tooltip />
      </>
    ),
  ],
} satisfies Meta<typeof ScalingTvlView>
export default meta

type Story = StoryObj<typeof ScalingTvlView>

export const Active: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        click('.TabsItem#active')
      }, [])
      return <Story />
    },
  ],
}

export const Upcoming: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        click('.TabsItem#upcoming')
      }, [])
      return <Story />
    },
  ],
}

export const Archived: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        click('.TabsItem#archived')
      }, [])
      return <Story />
    },
  ],
}
