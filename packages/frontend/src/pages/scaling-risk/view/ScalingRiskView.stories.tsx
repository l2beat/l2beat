import { Meta, StoryObj } from '@storybook/react'
import React, { useEffect } from 'react'

import { PageContent } from '../../../components/PageContent'
import { Tooltip } from '../../../components/Tooltip'
import { configureTabs } from '../../../scripts/configureTabs'
import { configureTooltips } from '../../../scripts/configureTooltips'
import { click } from '../../../utils/storybook/click'
import { ScalingRiskView } from './ScalingRiskView'

const meta = {
  title: 'Pages/Scaling/RiskView',
  component: ScalingRiskView,
  args: {
    items: [
      {
        name: 'ZKSwap 1.0',
        slug: 'zkswap',
        provider: 'zkSync',
        warning:
          'Version 3 of the protocol called ZkSpace is available and users are encouraged to move their assets there.',
        isArchived: true,
        isVerified: false,
        isUpcoming: undefined,
        stateValidation: {
          value: 'ZK proofs (SN)',
          description:
            'ZK-SNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
        },
        dataAvailability: {
          value: 'On chain',
          description:
            'All of the data needed for proof construction is published on chain.',
        },
        upgradeability: {
          value: '8 days delay',
          description:
            'The code that secures the system can be changed arbitrarily but users have some time to react.',
          sentiment: 'warning',
        },
        sequencerFailure: {
          value: 'Force exit to L1',
          description:
            'The user is only able to submit an L1 withdrawal request and force the sequencer to include it on L2. After that the user exits the system with their funds.',
        },
        validatorFailure: {
          value: 'Escape hatch (ZK)',
          description:
            'Users are able to trustlessly exit by submitting a zero knowledge proof of funds.',
          sentiment: 'warning',
        },
      },
      {
        name: 'Polygon Hermez',
        slug: 'hermez',
        provider: undefined,
        warning:
          'Hermez and Polygon have recently merged. Hermez and Polygon Hermez are two names for the same rollup.',
        isArchived: true,
        isVerified: true,
        isUpcoming: undefined,
        stateValidation: {
          value: 'ZK proofs (SN)',
          description:
            'ZK-SNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
        },
        dataAvailability: {
          value: 'On chain',
          description:
            'All of the data needed for proof construction is published on chain.',
        },
        upgradeability: {
          value: '7 days delay',
          description:
            'The code that secures the system can be changed arbitrarily but users have some time to react.',
          sentiment: 'warning',
        },
        sequencerFailure: {
          value: 'Force exit to L1',
          description:
            'The user is only able to submit an L1 withdrawal request and force the sequencer to include it on L2. After that the user exits the system with their funds.',
        },
        validatorFailure: {
          value: 'Propose blocks (ZK)',
          description:
            'The user needs to run their own node and use it to propose new blocks to replace the validator. Proposing new blocks requires creating ZK proofs which are very computationally expensive.',
          sentiment: 'warning',
        },
      },
      {
        name: 'ZKSwap 2.0',
        slug: 'zkswap2',
        provider: 'zkSync',
        warning:
          'Version 3 of the protocol called ZkSpace is available and users are encouraged to move their assets there.',
        isArchived: true,
        isVerified: false,
        isUpcoming: undefined,
        stateValidation: {
          value: 'ZK proofs (SN)',
          description:
            'ZK-SNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
        },
        dataAvailability: {
          value: 'On chain',
          description:
            'All of the data needed for proof construction is published on chain.',
        },
        upgradeability: {
          value: '8 days delay',
          description:
            'The code that secures the system can be changed arbitrarily but users have some time to react.',
          sentiment: 'warning',
        },
        sequencerFailure: {
          value: 'Force exit to L1',
          description:
            'The user is only able to submit an L1 withdrawal request and force the sequencer to include it on L2. After that the user exits the system with their funds.',
        },
        validatorFailure: {
          value: 'Escape hatch (ZK)',
          description:
            'Users are able to trustlessly exit by submitting a zero knowledge proof of funds.',
          sentiment: 'warning',
        },
      },
      {
        name: 'Gluon',
        slug: 'gluon',
        provider: undefined,
        warning:
          'LeverJ trading platform appears to be in a maintanance mode as the team moved to build NFT trading platform. Social medias associated with the project are silent since mid 2021.',
        isArchived: true,
        isVerified: true,
        isUpcoming: undefined,
        stateValidation: {
          value: 'Fraud proofs (!)',
          description:
            'Fraud proofs allow actors watching the chain to prove that the state is incorrect. Because the data is not present on chain the security of fraud proofs is severely weakened.',
          sentiment: 'warning',
        },
        dataAvailability: {
          value: 'External',
          description:
            'Proof construction relies fully on data that is NOT published on chain.',
          sentiment: 'bad',
        },
        upgradeability: {
          value: 'Yes',
          description:
            'The code that secures the system can be changed arbitrarily and without notice.',
          sentiment: 'bad',
        },
        sequencerFailure: {
          value: 'Exit to L1',
          description:
            'The user is only able to submit an L1 withdrawal request. After that the user exits the system with their funds.',
        },
        validatorFailure: {
          value: 'Escape hatch (MP)',
          description:
            'Users are able to trustlessly exit by submitting a merkle proof of funds.',
        },
      },
      {
        name: 'OMG Network',
        slug: 'omgnetwork',
        provider: undefined,
        warning: undefined,
        isArchived: true,
        isVerified: false,
        isUpcoming: undefined,
        stateValidation: {
          value: 'Exits only',
          description:
            'Exits from the network are subject to a period when they can be challenged. The internal network state is left unchecked.',
          sentiment: 'bad',
        },
        dataAvailability: {
          value: 'External',
          description:
            'Proof construction relies fully on data that is NOT published on chain.',
          sentiment: 'bad',
        },
        upgradeability: {
          value: 'Yes',
          description:
            'The code that secures the system can be changed arbitrarily and without notice.',
          sentiment: 'bad',
        },
        sequencerFailure: {
          value: 'Exit to L1',
          description:
            'The user is only able to submit an L1 withdrawal request. After that the user exits the system with their funds.',
        },
        validatorFailure: {
          value: 'Escape hatch (?)',
          description:
            'Users are able to exit the system. The details are unknown.',
          sentiment: 'warning',
        },
      },
      {
        name: 'L2.Finance-zk',
        slug: 'layer2financezk',
        provider: 'StarkEx',
        warning:
          'Layer2.finance-ZK has been shut down, users are encouraged to use optimistic rollup version.',
        isArchived: true,
        isVerified: false,
        isUpcoming: undefined,
        stateValidation: {
          value: 'ZK proofs (ST)',
          description:
            'ZK-STARKS are zero knowledge proofs that ensure state correctness.',
        },
        dataAvailability: {
          value: 'External (DAC)',
          description:
            'Proof construction relies fully on data that is NOT published on chain. There exists a data availability committee (DAC) that is tasked with protecting and supplying the data.',
          sentiment: 'warning',
        },
        upgradeability: {
          value: 'Yes',
          description:
            'The code that secures the system can be changed arbitrarily and without notice.',
          sentiment: 'bad',
        },
        sequencerFailure: {
          value: 'Force exit to L1',
          description:
            'The user can force the the sequencer to include their withdrawal transaction by submitting a request through L1. If the sequencer is down, the user can use the exit hatch to withdraw funds.',
        },
        validatorFailure: {
          value: 'Escape hatch (MP)',
          description:
            'Users are able to trustlessly exit by submitting a merkle proof of funds.',
        },
      },
      {
        name: 'Arbitrum One',
        slug: 'arbitrum',
        provider: undefined,
        warning:
          'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
        isArchived: undefined,
        isVerified: true,
        isUpcoming: undefined,
        stateValidation: {
          value: 'Fraud proofs (INT)',
          description:
            'Fraud proofs allow WHITELISTED actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve.',
          sentiment: 'warning',
        },
        dataAvailability: {
          value: 'On chain',
          description:
            'All of the data needed for proof construction is published on chain.',
        },
        upgradeability: {
          value: '13d or no delay',
          description:
            'There is a 13 days delay for upgrades initiated by the DAO that can be canceled by the 9/12 Security Council multisig. This multisig can also upgrade with no delay',
          sentiment: 'warning',
        },
        sequencerFailure: {
          value: 'Transact using L1',
          description:
            'In the event of sequencer failure, after 1d (5760 blocks) user can force the transaction to be included in the L2 chain by sending it to the L1.',
          references: [
            'https://etherscan.io/address/0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9#code#F1#L125',
            'https://developer.arbitrum.io/sequencer',
          ],
          contracts: ['SequencerInbox'],
        },
        validatorFailure: {
          value: 'Propose blocks',
          description:
            'Anyone can become a Validator after approximately 7 days (45818 blocks) of inactivity from the currently whitelisted Validators.',
          references: [
            'https://etherscan.io/address/0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff#code#F61#L55',
          ],
          contracts: ['RollupProxy'],
        },
      },
      {
        name: 'Optimism',
        slug: 'optimism',
        provider: 'Optimism',
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
        isArchived: undefined,
        isVerified: true,
        isUpcoming: undefined,
        stateValidation: {
          value: 'In development',
          description:
            'Currently the system permits invalid state roots. More details in project overview.',
          sentiment: 'bad',
        },
        dataAvailability: {
          value: 'On chain',
          description:
            'All of the data needed for proof construction is published on chain.',
        },
        upgradeability: {
          value: 'Yes',
          description:
            'The code that secures the system can be changed arbitrarily and without notice.',
          sentiment: 'bad',
        },
        sequencerFailure: {
          value: 'Transact using L1',
          description:
            'The user is able to submit a transaction through L1 and force its inclusion on L2.',
        },
        validatorFailure: {
          value: 'No mechanism',
          description:
            'If the whitelisted validator goes down, withdrawals cannot be processed. Users can still transact on L2.',
          sentiment: 'bad',
        },
      },
      {
        name: 'dYdX',
        slug: 'dydx',
        provider: 'StarkEx',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        isUpcoming: undefined,
        stateValidation: {
          value: 'ZK proofs (ST)',
          description:
            'ZK-STARKS are zero knowledge proofs that ensure state correctness.',
        },
        dataAvailability: {
          value: 'On chain',
          description:
            'All of the data needed for proof construction is published on chain.',
        },
        upgradeability: {
          value: 'Yes',
          description:
            'The code that secures the system can be changed arbitrarily and without notice.',
          sentiment: 'bad',
        },
        sequencerFailure: {
          value: 'Force trade/exit to L1',
          description:
            'The user can force the sequencer to include a trade or withdrawal transaction by submitting a request through L1. The user is required to find a counterparty for the trade by out of system means. If the sequencer is down, the user can use the exit hatch to withdraw funds.',
          sentiment: 'warning',
        },
        validatorFailure: {
          value: 'Escape hatch (MP)',
          description:
            'Users are able to trustlessly exit their collateral by submitting a merkle proof of funds. Positions will be closed using average price from the last batch state update.',
        },
      },
      {
        name: 'zkSync Era',
        slug: 'zksync-era',
        provider: 'zkSync',
        warning:
          'Withdrawals are delayed by 1d. The length of the delay can be arbitrarily set by a MultiSig.',
        isArchived: undefined,
        isVerified: true,
        isUpcoming: undefined,
        stateValidation: {
          value: 'ZK proofs',
          description:
            'Uses PLONK zero-knowledge proof system with KZG commitments.',
          references: [
            'https://etherscan.io/address/0x3dB52cE065f728011Ac6732222270b3F2360d919#code#F5#L89',
            'https://etherscan.io/address/0x389a081BCf20e5803288183b929F08458F1d863D#code#F10#L254',
            'https://etherscan.io/address/0xF1fB730b7f8E8391B27B91f8f791e10E4a53CEcc#code#F7#L24',
            'https://etherscan.io/address/0x473b1887d45d61efd87731a1d8ec3590b93c565d#code#F5#L227',
            'https://era.zksync.io/docs/dev/developer-guides/transactions/transactions.html#transaction-types',
            'https://era.zksync.io/docs/dev/developer-guides/system-contracts.html#executorfacet',
          ],
          contracts: ['ValidatorTimelock', 'DiamondProxy', 'Verifier'],
        },
        dataAvailability: {
          value: 'On chain (SD)',
          description:
            'All of the data (SD = state diffs) needed for proof construction is published on chain.',
          references: [
            'https://etherscan.io/address/0x3dB52cE065f728011Ac6732222270b3F2360d919#code#F5#L71',
            'https://etherscan.io/address/0x389a081BCf20e5803288183b929F08458F1d863D#code#F10#L149',
            'https://etherscan.io/address/0x389a081BCf20e5803288183b929F08458F1d863D#code#F11#L41',
            'https://etherscan.io/tx/0xef9ad50d9b6a30365e4cc6709a5b7479fb67b8948138149597c49ef614782e1b',
            'https://era.zksync.io/docs/dev/developer-guides/system-contracts.html#executorfacet',
          ],
          contracts: ['ValidatorTimelock', 'DiamondProxy'],
        },
        upgradeability: {
          value: 'Yes',
          description:
            'The code that secures the system can be changed arbitrarily and without notice by the governor, that currently is a 4 / 7 Multisig.',
          sentiment: 'bad',
          references: [
            'https://etherscan.io/address/0x2a2d6010202B93E727b61a60dfC1d5CF2707c1CE#code#F8#L121',
            'https://etherscan.io/address/0x2a2d6010202B93E727b61a60dfC1d5CF2707c1CE#code#F6#L51',
          ],
          contracts: ['DiamondProxy'],
        },
        sequencerFailure: {
          value: 'Transact using L1',
          description:
            'L2 transactions can be forced through L1 by adding them to append only queue on L1, which is processed sequentially by Sequencer, meaning that the individual user cannot be censored. At the moment there is no mechanism that forces L2 Sequencer to empty the L1 queue.',
          sentiment: 'warning',
          references: [
            'https://era.zksync.io/docs/dev/developer-guides/bridging/l1-l2-interop.html#priority-queue',
            'https://era.zksync.io/docs/dev/developer-guides/bridging/l1-l2-interop.html#priority-mode',
            'https://etherscan.io/address/0x389a081BCf20e5803288183b929F08458F1d863D#code#F13#L56',
            'https://etherscan.io/address/0x389a081BCf20e5803288183b929F08458F1d863D#code#F13#L73',
          ],
          contracts: ['DiamondProxy'],
        },
        validatorFailure: {
          value: 'No mechanism',
          description:
            'Only whitelisted validators can update the state on L1, so in the event of failure the withdrawals are blocked.',
          sentiment: 'bad',
        },
      },
      {
        name: 'Metis Andromeda',
        slug: 'metis',
        provider: 'Optimism',
        warning:
          'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.       Since April 2022 the transaction data is no longer kept on-chain, instead it is kept in MEMO distributed data storage system.       The optimistic challenge mechanism that allows Validators to force Sequencer to post missing data is not fully implemented yet.',
        isArchived: undefined,
        isVerified: true,
        isUpcoming: undefined,
        stateValidation: {
          value: 'In development',
          description:
            'Currently the system permits invalid state roots. More details in project overview.',
          sentiment: 'bad',
        },
        dataAvailability: {
          value: 'Optimistic (MEMO)',
          description:
            'Transaction data is kept in MEMO decentralized storage. Validators can force Sequencer to make data available on-chain via L1 contract call if they find that Sequencer did not push tx data to MEMO.     Challange mechanizm is not yet fully implemented.',
          sentiment: 'warning',
        },
        upgradeability: {
          value: 'Yes',
          description:
            'The code that secures the system can be changed arbitrarily and without notice.',
          sentiment: 'bad',
        },
        sequencerFailure: {
          value: 'Transact using L1',
          description:
            'The user is able to submit a transaction through L1 and force its inclusion on L2.',
        },
        validatorFailure: {
          value: 'No mechanism',
          description:
            'If the whitelisted validator goes down, withdrawals cannot be processed. Users can still transact on L2.',
          sentiment: 'bad',
        },
      },
      {
        name: 'Loopring',
        slug: 'loopring',
        provider: undefined,
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        isUpcoming: undefined,
        stateValidation: {
          value: 'ZK proofs (SN)',
          description:
            'ZK-SNARKS are zero knowledge proofs that ensure state correctness, but require trusted setup.',
        },
        dataAvailability: {
          value: 'On chain',
          description:
            'All of the data needed for proof construction is published on chain.',
        },
        upgradeability: {
          value: 'Yes',
          description:
            'The code that secures the system can be changed arbitrarily and without notice.',
          sentiment: 'bad',
        },
        sequencerFailure: {
          value: 'Force exit to L1',
          description:
            'The user is only able to submit an L1 withdrawal request and force the sequencer to include it on L2. After that the user exits the system with their funds.',
        },
        validatorFailure: {
          value: 'Escape hatch (MP)',
          description:
            'Users are able to trustlessly exit by submitting a merkle proof of funds.',
        },
      },
      {
        name: 'Immutable X',
        slug: 'immutablex',
        provider: 'StarkEx',
        warning: undefined,
        isArchived: undefined,
        isVerified: true,
        isUpcoming: undefined,
        stateValidation: {
          value: 'ZK proofs (ST)',
          description:
            'ZK-STARKS are zero knowledge proofs that ensure state correctness.',
        },
        dataAvailability: {
          value: 'External (DAC)',
          description:
            'Proof construction relies fully on data that is NOT published on chain. There exists a data availability committee (DAC) that is tasked with protecting and supplying the data.',
          sentiment: 'warning',
          references: [
            'https://etherscan.io/address/0x86d8f977C9cEC503ad4E6805802cEf62Cde13773#code#F34#L180',
            'https://etherscan.io/address/0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295#code#F1#L63',
          ],
          contracts: ['StarkExchange', 'Committee'],
        },
        upgradeability: {
          value: '14d delay',
          description:
            'The code that secures the system can be changed arbitrarily but users have some time to react.',
          sentiment: 'warning',
        },
        sequencerFailure: {
          value: 'Force exit to L1',
          description:
            'The user can force the the sequencer to include their withdrawal transaction by submitting a request through L1. If the sequencer is down, the user can use the exit hatch to withdraw funds.',
        },
        validatorFailure: {
          value: 'Escape hatch (MP)',
          description:
            'Users are able to trustlessly exit by submitting a merkle proof of their assets. NFTs will be minted on L1 on exit.',
        },
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
} satisfies Meta<typeof ScalingRiskView>
export default meta

type Story = StoryObj<typeof ScalingRiskView>

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
