import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('metis')

export const metis: Layer2 = {
  type: 'layer2',
  id: ProjectId('metis'),
  display: {
    name: 'Metis Andromeda',
    slug: 'metis',
    warning:
      'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots. \
      Since April 2022 the transaction data is no longer kept on-chain, instead it is kept in MEMO distributed data storage system. \
      The optimistic challenge mechanism that allows Validators to force Sequencer to post missing data is not fully implemented yet.',
    description:
      'Metis is an EVM-equivalent Scaling Solution originally forked from Optimism. It provides support for multiple, \
      interconnected L2 chains with main focus on supporting easy creation of DACs (Decentralized Autonomous Companies). \
      The risk analysis below relates to the default chain with chainId=1088 called Andromeda. Since April 2022 Andromeda \
      uses "optimistic data availability" scheme in which transaction data is kept off-chain in MEMO while Validators can \
      request tx data from Sequencer via L1 challenge mechanism if it does not make it available for validation off-chain.',
    purpose: 'Universal',
    provider: 'Optimism',
    category: 'Optimistic Chain',
    links: {
      websites: ['https://www.metis.io'],
      apps: [],
      documentation: ['https://docs.metis.io'],
      explorers: ['https://andromeda-explorer.metis.io'],
      repositories: ['https://github.com/MetisProtocol'],
      socialMedia: [
        'https://medium.com/@MetisDAO',
        'https://twitter.com/MetisDAO',
        'https://discord.gg/RqfEJZXnxd',
        'https://youtube.com/c/MetisDAO',
        'https://t.me/MetisDAO',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    associatedTokens: ['Metis'],
    escrows: [
      {
        address: EthereumAddress('0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b'),
        sinceTimestamp: new UnixTime(1637077208),
        tokens: '*',
      },
    ],
    transactionApi: {
      type: 'rpc',
      url: 'https://andromeda.metis.io/',
      startBlock: 1,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      value: 'In development',
      description:
        'Currently the system permits invalid state roots. More details in project overview.',
      sentiment: 'bad',
    },
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_MEMO,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_ENQUEUE_VIA_L1,
      sources: [
        {
          contract: 'CanonicalTransactionChain',
          references: [
            'https://etherscan.io/address/0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9#code#F1#L212',
          ],
        },
      ],
    },
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL('METIS'),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    stateCorrectness: {
      name: 'No automatic on-chain fraud proof system',
      description:
        'For additional security, any staked Validator can challenge invalid state root submitted by the Sequencer. Other Validators will then act as referees in an interactive challenge game. Dishonest Validator majority can push invalid state root on-chain, and potentially slash honest Sequencer.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'an invalid state root is submitted to the system.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'MVM_Verifier.sol#L133 - Metis source code',
          href: 'https://github.com/MetisProtocol/mvm/blob/develop/packages/contracts/contracts/MVM/MVM_Verifier.sol#L133',
        },
      ],
    },
    dataAvailability: {
      name: 'Data is recorded off-chain in MEMO',
      description:
        'Transaction data is not stored on-chain, rather it is recorded in off-chain decentralized storage \
        MEMO from MemoLabs. If Validators find that data is unavailable, they can request that Sequencer \
        posts data on-chain via L1 contract.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'sequencer withholds data for more than seven days while at the same time submits fraudulent state root.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'The Tech Journey: Lower Gas Costs & Storage Layer on Metis',
          href: 'https://metisdao.medium.com/the-tech-journey-lower-gas-costs-storage-layer-on-metis-867ddcf6d381',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_SEQUENCER,
      references: [
        {
          text: 'CanonicalTransactionChain#L735 - Etherscan source code',
          href: 'https://etherscan.io/address/0x56a76bcc92361f6df8d75476fed8843edc70e1c9#code#F1#L735',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
      references: [
        {
          text: 'CanonicalTransactionChain - Etherscan source code',
          href: 'https://etherscan.io/address/0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9#code',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'Withdrawing from Metis - Metis documentation',
            href: 'https://docs.metis.io/building-on-metis/metis-bridge#withdrawing-from-metis',
          },
        ],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
    ],
    smartContracts: {
      name: 'EVM compatible smart contracts are supported',
      description:
        'Metis uses the Optimistic Virtual Machine (OVM) 2.0 to execute transactions. This is similar to the EVM, but is independent from it and allows fraud proofs to be executed.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'there are mistakes in the highly complex OVM implementation.',
        },
      ],
      references: [
        {
          text: 'MVM repository - Metis source code',
          href: 'https://github.com/MetisProtocol/mvm',
        },
      ],
    },
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'Metis Multisig',
      'This address is the owner of the following contracts: MVM_L1CrossDomainMessenger, L1StandardBridge, LibAddressManager. This allows it to censor messages or pause message bridge altogether, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
    {
      name: 'Sequencer',
      accounts: [
        discovery.getPermissionedAccount(
          'Lib_AddressManager',
          '_1088_MVM_Sequencer_Wrapper',
        ),
      ],
      description: 'Central actor allowed to commit L2 transactions to L1.',
    },
    {
      name: 'State Root Proposer',
      accounts: [
        discovery.getPermissionedAccount(
          'Lib_AddressManager',
          '_1088_MVM_Proposer',
        ),
      ],
      description: 'Central actor to post new L2 state roots to L1.',
    },
    {
      name: 'Data Availability Verifiers',
      accounts: [
        // TODO: Verify this. This is the same address as the multisig. If this is correct, we should remove it and change multisig description.
        {
          address: EthereumAddress(
            '0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Those addresses can try to force the sequencer to post data on chain.',
    },
    {
      name: 'Execution Verifiers',
      accounts: [
        // TODO: Verify this. This is the same address as the multisig. If this is correct, we should remove it and change multisig description.
        {
          address: EthereumAddress(
            '0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Those addresses can challenge the state roots submitted by the state root proposer.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'MVM_CanonicalTransaction',
        'MVM CanonicalTransaction is a wrapper of Canonical Transaction Chain that implements optimistic data availability scheme L1. If Sequencer is not malicious, it simply forwards appendSequencerBatch() calls to CanonicalTransactionChain.',
      ),
      discovery.getContractDetails(
        'CanonicalTransactionChain',
        'The Canonical Transaction Chain (CTC) contract is an append-only log of transactions which must be applied to the OVM state. It defines the ordering of transactions by writing them to the CTC:batches instance of the Chain Storage Container. CTC batches can only be submitted by OVM_Sequencer. The CTC also allows any account to enqueue() an L2 transaction, which the Sequencer must eventually append to the rollup state.',
      ),
      discovery.getContractDetails(
        'StateCommitmentChain',
        'The State Commitment Chain (SCC) contract contains a list of proposed state roots which Proposers assert to be a result of each transaction in the Canonical Transaction Chain (CTC). Elements here have a 1:1 correspondence with transactions in the CTC, and should be the unique state root calculated off-chain by applying the canonical transactions one by one. Currently only OVM_Proposer can submit new state roots.',
      ),
      {
        name: 'ChainStorageContainer-CTC-batches',
        address: EthereumAddress('0x38473Feb3A6366757A249dB2cA4fBB2C663416B7'),
      },
      {
        name: 'ChainStorageContainer-CTC-queue',
        address: EthereumAddress('0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57'),
      },
      {
        name: 'ChainStorageContainer-SCC-batches',
        address: EthereumAddress('0x10739F09f6e62689c0aA8A1878816de9e166d6f9'),
      },
      discovery.getContractDetails(
        'BondManager',
        "The Bond Manager contract will handle deposits in the form of an ERC20 token from bonded Proposers. It will also handle the accounting of gas costs spent by a Verifier during the course of a challenge. In the event of a successful challenge, the faulty Proposer's bond will be slashed, and the Verifier's gas costs will be refunded. Current mock implementation allows only OVM_Proposer to propose new state roots. No slashing is implemented.",
      ),
      discovery.getContractDetails(
        'L1CrossDomainMessenger',
        "The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.",
      ),
      discovery.getContractDetails(
        'MVM_DiscountOracle',
        'Oracle specifying user fees for sending L1 -> L2 messages and other parameters for cross-chain communication.',
      ),
      discovery.getContractDetails(
        'Lib_AddressManager',
        'This is a library that stores the mappings between names such as OVM_Sequencer, OVM_Proposer and other contracts and their addresses.',
      ),
      discovery.getContractDetails(
        'MVM_Verifier',
        'This contract implements a voting scheme with which the majority of Verifiers can challenge malicious Sequencer.',
      ),
      discovery.getContractDetails(
        'MVM_L2ChainManagerOnL1',
        'Contract that allows METIS_MANAGER to switch Sequencer.',
      ),
      discovery.getContractDetails(
        'L1StandardBridge',
        'Main entry point for users depositing ERC20 tokens and ETH that do not require custom gateway.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Mainnet launch',
      link: 'https://metisdao.medium.com/metis-to-launch-andromeda-honoring-our-commitment-to-decentralization-fa2d03394398',
      date: '2021-11-19T00:00:00Z',
      description:
        'Public launch of Metis Layer 2 Andromeda, based on the Optimism codebase.',
    },
    {
      name: 'Data availability change',
      link: 'https://metisdao.medium.com/decentralized-storage-goes-live-da876dc6eb70',
      date: '2022-04-12T00:00:00Z',
      description: 'Update moving data to an off-chain committee.',
    },
  ],
}
