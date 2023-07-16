import { Meta, StoryObj } from '@storybook/react'
import React, { useEffect } from 'react'

import { PageContent } from '../../components/PageContent'
import { Tooltip } from '../../components/Tooltip'
import { configureCanonicalBridgesFilter } from '../../scripts/configureCanonicalBridgesFilter'
import { configureTableIndexRerender } from '../../scripts/configureTableIndexRerender'
import { configureTabs } from '../../scripts/configureTabs'
import { configureTooltips } from '../../scripts/configureTooltips'
import { click } from '../../utils/storybook/click'
import { BridgesTvlView } from './BridgesTvlView'

const meta = {
  title: 'Pages/Bridges/TvlView',
  component: BridgesTvlView,
  args: {
    items: [
      {
        type: 'layer2',
        name: 'Arbitrum One',
        slug: 'arbitrum',
        warning:
          'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
        isArchived: undefined,
        isVerified: true,
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
        bridgesMarketShare: '102.12%',
        combinedMarketShare: '40.37%',
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        category: 'Optimistic Rollup',
      },
      {
        type: 'bridge',
        name: 'Polygon PoS',
        slug: 'polygon-pos',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        tvl: '$2.16 B',
        tvlBreakdown: {
          empty: false,
          associated: 0,
          ether: 0.1832399261494172,
          stable: 0.6848085267706687,
          other: 0.1319515470799142,
          label: 'Ether – 18.32%<br>Stablecoins – 68.48%<br>Other – 13.20%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '-1.41%',
        sevenDayChange: '-3.88%',
        bridgesMarketShare: '38.86%',
        combinedMarketShare: '15.36%',
        validatedBy: {
          value: 'Destination Chain',
          description:
            'Transfers need to be confirmed by 2/3 of Polygon PoS Validators stake.',
          sentiment: 'warning',
        },
        category: 'Token Bridge',
      },

      {
        type: 'layer2',
        name: 'Metis Andromeda',
        slug: 'metis',
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.       Since April 2022 the transaction data is no longer kept on-chain, instead it is kept in MEMO distributed data storage system.       The optimistic challenge mechanism that allows Validators to force Sequencer to post missing data is not fully implemented yet.',
        isArchived: undefined,
        isVerified: true,
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
        bridgesMarketShare: '1.95%',
        combinedMarketShare: '0.77%',
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        category: 'Optimistic Chain',
      },

      {
        type: 'bridge',
        name: 'Omnichain (LayerZero)',
        slug: 'omnichain',
        warning:
          'The security parameters of each individual token must be individually assessed, and can be changed by the developers. Omnichain tokens are are in the early stages of development, use at your own risk.',
        isArchived: undefined,
        isVerified: false,
        tvl: '$72.31 M',
        tvlBreakdown: {
          empty: false,
          associated: 0,
          ether: 0,
          stable: 0.019308045441298084,
          other: 0.980691954558702,
          label: 'Stablecoins – 1.93%<br>Other – 98.07%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '-6.08%',
        sevenDayChange: '-16.94%',
        bridgesMarketShare: '1.30%',
        combinedMarketShare: '0.51%',
        validatedBy: {
          value: 'Third Party',
          description:
            'Transfers need to be independently confirmed by oracle attesting to source chain checkpoints and Relayer providing merkle proof of the transfer event.',
          sentiment: 'bad',
        },
        category: 'Token Bridge',
      },
      {
        type: 'bridge',
        name: 'Hop',
        slug: 'hop',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        tvl: '$58.35 M',
        tvlBreakdown: {
          empty: false,
          associated: 0,
          ether: 0.5338409413538537,
          stable: 0.38374821995373404,
          other: 0.08241083869241221,
          label: 'Ether – 53.38%<br>Stablecoins – 38.37%<br>Other – 8.24%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '-1.56%',
        sevenDayChange: '-5.59%',
        bridgesMarketShare: '1.05%',
        combinedMarketShare: '0.41%',
        validatedBy: {
          value: 'Optimistically',
          description:
            'Messages are relayed to the destination chain and assumed to be correct unless challenged within the 24 hour fraud proof window.',
          sentiment: 'warning',
        },
        category: 'Liquidity Network',
      },
      {
        type: 'bridge',
        name: 'Synapse',
        slug: 'synapse',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        tvl: '$57.59 M',
        tvlBreakdown: {
          empty: false,
          associated: 0,
          ether: 0.16798902565254775,
          stable: 0.4392974828184493,
          other: 0.3927134915290029,
          label: 'Ether – 16.80%<br>Stablecoins – 43.93%<br>Other – 39.27%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '-1.46%',
        sevenDayChange: '-2.60%',
        bridgesMarketShare: '1.03%',
        combinedMarketShare: '0.41%',
        validatedBy: {
          value: 'Third Party',
          description: 'Withdraws are validated by EOA.',
          sentiment: 'bad',
        },
        category: 'Hybrid',
      },
      {
        type: 'layer2',
        name: 'Starknet',
        slug: 'starknet',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        tvl: '$46.84 M',
        tvlBreakdown: {
          empty: false,
          associated: 0,
          ether: 0.7461191782644722,
          stable: 0.24959920467573504,
          other: 0.004281617059792749,
          label: 'Ether – 74.61%<br>Stablecoins – 24.96%<br>Other – 0.43%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '-0.31%',
        sevenDayChange: '+14.64%',
        bridgesMarketShare: '0.84%',
        combinedMarketShare: '0.33%',
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        category: 'ZK Rollup',
      },
      {
        type: 'layer2',
        name: 'ZKSpace',
        slug: 'zkspace',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        tvl: '$46.46 M',
        tvlBreakdown: {
          empty: false,
          associated: 0.2067512215833826,
          ether: 0.3534782118871487,
          stable: 0.0544648276675966,
          other: 0.385305738861872,
          label:
            'ZKS – 20.68%<br>Ether – 35.35%<br>Stablecoins – 5.45%<br>Other – 38.53%',
          warning:
            'The ZKS token associated with ZKSpace accounts for 20.68% of the TVL!',
          warningSeverity: 'warning',
        },
        oneDayChange: '-3.81%',
        sevenDayChange: '-7.23%',
        bridgesMarketShare: '0.83%',
        combinedMarketShare: '0.33%',
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        category: 'ZK Rollup',
      },
      {
        type: 'bridge',
        name: 'Omnibridge',
        slug: 'omni',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        tvl: '$42.56 M',
        tvlBreakdown: {
          empty: false,
          associated: 0.9881005600854719,
          ether: 0,
          stable: 0,
          other: 0.011899439914528189,
          label: 'GNO – 98.81%<br>Other – 1.19%',
          warning:
            'The GNO token associated with Omnibridge accounts for 98.81% of the TVL!',
          warningSeverity: 'bad',
        },
        oneDayChange: '-4.68%',
        sevenDayChange: '-4.20%',
        bridgesMarketShare: '0.76%',
        combinedMarketShare: '0.30%',
        validatedBy: {
          value: 'Third Party',
          description: '4/6 Validator MultiSig',
          sentiment: 'bad',
        },
        category: 'Token Bridge',
      },
      {
        type: 'bridge',
        name: 'xDai Bridge',
        slug: 'xdai',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        tvl: '$33.01 M',
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
        oneDayChange: '-0.02%',
        sevenDayChange: '+2.07%',
        bridgesMarketShare: '0.59%',
        combinedMarketShare: '0.23%',
        validatedBy: {
          value: 'Third Party',
          description: '4/6 Validator MultiSig',
          sentiment: 'bad',
        },
        category: 'Token Bridge',
      },
      {
        type: 'bridge',
        name: 'Aptos (LayerZero)',
        slug: 'aptos',
        warning: undefined,
        isArchived: undefined,
        isVerified: false,
        tvl: '$19.74 M',
        tvlBreakdown: {
          empty: false,
          associated: 0,
          ether: 0.062040653300189354,
          stable: 0.9379593466998105,
          other: 0,
          label: 'Ether – 6.20%<br>Stablecoins – 93.80%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '-1.59%',
        sevenDayChange: '-4.98%',
        bridgesMarketShare: '0.35%',
        combinedMarketShare: '0.14%',
        validatedBy: {
          value: 'Third Party',
          description:
            'Transfers need to be independently confirmed by oracle attesting to source chain checkpoints and Relayer providing merkle proof of the transfer event.',
          sentiment: 'bad',
        },
        category: 'Token Bridge',
      },

      {
        type: 'layer2',
        name: 'ZKSwap 1.0',
        slug: 'zkswap',
        warning:
          'Version 3 of the protocol called ZkSpace is available and users are encouraged to move their assets there.',
        isArchived: true,
        isVerified: false,
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
        bridgesMarketShare: '0.04%',
        combinedMarketShare: '0.01%',
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        category: 'ZK Rollup',
      },
      {
        type: 'layer2',
        name: 'Polygon Hermez',
        slug: 'hermez',
        warning:
          'Hermez and Polygon have recently merged. Hermez and Polygon Hermez are two names for the same rollup.',
        isArchived: true,
        isVerified: true,
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
        bridgesMarketShare: '0.01%',
        combinedMarketShare: '0.00%',
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        category: 'ZK Rollup',
      },
      {
        type: 'bridge',
        name: 'Wormhole V1',
        slug: 'wormholev1',
        warning: undefined,
        isArchived: true,
        isVerified: true,
        tvl: '$312 K',
        tvlBreakdown: {
          empty: false,
          associated: 0,
          ether: 0.30222096737986903,
          stable: 0.1126101265927411,
          other: 0.5851689060273899,
          label: 'Ether – 30.22%<br>Stablecoins – 11.26%<br>Other – 58.52%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '-1.49%',
        sevenDayChange: '-6.61%',
        bridgesMarketShare: '0.01%',
        combinedMarketShare: '0.00%',
        validatedBy: {
          value: 'Third Party',
          description:
            'Transfers need to be signed offchain by a set of 2/3 of Guardians and then in a permissionless way relayed to the destination chain.',
          sentiment: 'bad',
        },
        category: 'Token Bridge',
      },
      {
        type: 'layer2',
        name: 'ZKSwap 2.0',
        slug: 'zkswap2',
        warning:
          'Version 3 of the protocol called ZkSpace is available and users are encouraged to move their assets there.',
        isArchived: true,
        isVerified: false,
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
        bridgesMarketShare: '0.00%',
        combinedMarketShare: '0.00%',
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        category: 'ZK Rollup',
      },
      {
        type: 'layer2',
        name: 'Gluon',
        slug: 'gluon',
        warning:
          'LeverJ trading platform appears to be in a maintenance mode as the team moved to build NFT trading platform. Social medias associated with the project are silent since mid 2021.',
        isArchived: true,
        isVerified: true,
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
        bridgesMarketShare: '0.00%',
        combinedMarketShare: '0.00%',
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        category: 'Plasma',
      },
      {
        type: 'layer2',
        name: 'OMG Network',
        slug: 'omgnetwork',
        warning: undefined,
        isArchived: true,
        isVerified: false,
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
        bridgesMarketShare: '0.00%',
        combinedMarketShare: '0.00%',
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        category: 'Plasma',
      },
      {
        type: 'bridge',
        name: 'Connext (Legacy)',
        slug: 'connext-legacy',
        warning: undefined,
        isArchived: true,
        isVerified: true,
        tvl: '$5.87 K',
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
        oneDayChange: '-0.03%',
        sevenDayChange: '-0.01%',
        bridgesMarketShare: '0.00%',
        combinedMarketShare: '0.00%',
        validatedBy: {
          value: 'User',
          sentiment: 'good',
          description: 'Transfer is done via peer-to-peer atomic swap',
        },
        category: 'Liquidity Network',
      },
      {
        type: 'bridge',
        name: 'Nomad',
        slug: 'nomad',
        warning:
          'The Nomad token bridge contract has recently been exploited and currently is not operational.',
        isArchived: true,
        isVerified: true,
        tvl: '$4.70 K',
        tvlBreakdown: {
          empty: false,
          associated: 0,
          ether: 0.19511038628288574,
          stable: 0.7913260174823465,
          other: 0.0135635962347678,
          label: 'Ether – 19.51%<br>Stablecoins – 79.13%<br>Other – 1.36%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '-0.90%',
        sevenDayChange: '-1.80%',
        bridgesMarketShare: '0.00%',
        combinedMarketShare: '0.00%',
        validatedBy: {
          value: 'Optimistically',
          description:
            'Messages are relayed to the destination chain and assumed to be correct unless challenged within the 20 min fraud proof window.',
          sentiment: 'warning',
        },
        category: 'Token Bridge',
      },
      {
        type: 'layer2',
        name: 'L2.Finance-zk',
        slug: 'layer2financezk',
        warning:
          'Layer2.finance-ZK has been shut down, users are encouraged to use optimistic rollup version.',
        isArchived: true,
        isVerified: false,
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
        bridgesMarketShare: '0.00%',
        combinedMarketShare: '0.00%',
        validatedBy: {
          value: 'Ethereum',
          description:
            'Smart contracts on Ethereum validate all bridge transfers.',
          sentiment: 'good',
        },
        category: 'Validium',
      },
      {
        type: 'bridge',
        name: 'Sollet',
        slug: 'sollet',
        warning:
          'Sollet Bridge becomes deprecated on Oct 31, 2022. Users are encouraged to use Wormhole instead.',
        isArchived: true,
        isVerified: true,
        tvl: '$2.31 K',
        tvlBreakdown: {
          empty: false,
          associated: 0.000008627941588835443,
          ether: 0.9754491922089686,
          stable: 0.02346368715083799,
          other: 0.0010784926986044303,
          label:
            'SRM – 0.00%<br>Ether – 97.54%<br>Stablecoins – 2.35%<br>Other – 0.11%',
          warning: undefined,
          warningSeverity: 'warning',
        },
        oneDayChange: '-3.81%',
        sevenDayChange: '-6.96%',
        bridgesMarketShare: '0.00%',
        combinedMarketShare: '0.00%',
        validatedBy: {
          value: 'Third Party',
          description: 'Withdrawals need to be signed by an EOA account.',
          sentiment: 'bad',
        },
        category: 'Token Bridge',
      },
    ],
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
} satisfies Meta<typeof BridgesTvlView>
export default meta

type Story = StoryObj<typeof BridgesTvlView>

export const Active: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        configureCanonicalBridgesFilter()
        configureTableIndexRerender()
        click('.TabsItem#active')
      }, [])
      return <Story />
    },
  ],
}

export const ActiveWithCanonicalBridges: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        configureCanonicalBridgesFilter()
        configureTableIndexRerender()
        click('.TabsItem#active')
        click('#combined-bridges-checkbox')
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
        configureCanonicalBridgesFilter()
        configureTableIndexRerender()
        click('.TabsItem#archived')
      }, [])
      return <Story />
    },
  ],
}

export const ArchivedWithCanonicalBridges: Story = {
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTooltips()
        configureTabs()
        configureCanonicalBridgesFilter()
        configureTableIndexRerender()
        click('.TabsItem#archived')
        click('#combined-bridges-checkbox')
      }, [])
      return <Story />
    },
  ],
}
