import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'

import {
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { Layer2 } from './types'

export const metis: Layer2 = {
  type: 'layer2',
  id: ProjectId('metis'),
  display: {
    name: 'Metis Andromeda',
    slug: 'metis',
    warning:
      'On April 12 2022 the protocol architecture was significantly upgraded. The transaction data is no longer kept on-chain, instead it is kept in MEMO distributed data storage system.',
    description:
      'Metis is an EVM-equivalent Scaling Solution originally forked from Optimism. It provides support for multiple, \
      interconnected L2 chains with main focus on supporting easy creation of DACs (Decentralized Autonomous Companies). \
      The risk analysis below relates to the default chain with chainId=1088 called Andromeda. Since April 2022 Andromeda \
      uses "optimistic data availability" scheme in which transaction data is kept off-chain in MEMO while Validators can \
      request tx data from Sequencer via L1 challenge mechanism if it does not make it available for validation off-chain.',
    purpose: 'Universal',
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
  },
  config: {
    associatedTokens: ['Metis'],
    escrows: [
      {
        address: '0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b',
        sinceTimestamp: new UnixTime(1637077208),
        tokens: '*',
      },
    ],
    events: [
      {
        name: 'StateBatchAppended',
        abi: 'event StateBatchAppended (uint256 _chainId, uint256 indexed _batchIndex, bytes32 _batchRoot, uint256 _batchSize, uint256 _prevTotalElements, bytes _extraData)',
        emitter: EthereumAddress('0xf209815E595Cdf3ed0aAF9665b1772e608AB9380'),
        type: 'state',
        sinceTimestamp: new UnixTime(1637071157),
      },
      {
        name: 'TransactionBatchAppended',
        abi: 'event TransactionBatchAppended (uint256 _chainId, uint256 indexed _batchIndex, bytes32 _batchRoot, uint256 _batchSize, uint256 _prevTotalElements, bytes _extraData)',
        emitter: EthereumAddress('0x56a76bcc92361f6df8d75476fed8843edc70e1c9'),
        type: 'data',
        sinceTimestamp: new UnixTime(1637070766),
      },
    ],
    transactionApi: {
      type: 'rpc',
      provider: 'jsonRpc',
      url: 'https://andromeda.metis.io/',
    },
  },
  riskView: {
    stateValidation: {
      value: 'In development',
      description:
        'Currently the system permits invalid state roots. More details in project overview.',
      sentiment: 'bad',
    },
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_MEMO,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_TRANSACT_L1,
    validatorFailure: RISK_VIEW.VALIDATOR_WHITELISTED_BLOCKS,
  },
  technology: {
    provider: 'Optimism',
    category: 'Optimistic Chain',
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
    {
      name: 'Metis manager',
      accounts: [
        {
          address: '0xDD6FFC7D9a4Fb420b637747edc6456340d12d377',
          type: 'EOA',
        },
      ],
      description:
        'This address is the owner of the following contracts: MVM_L1CrossDomainMessenger, L1StandardBridge, LibAddressManager. This allows it to censor messages or pause message bridge altogether, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    },
    {
      name: 'Sequencer',
      accounts: [
        {
          address: '0xcDf02971871B7736874E20B8487c019D28090019',
          type: 'EOA',
        },
      ],
      description: 'Central actor allowed to commit L2 transactions to L1.',
    },
    {
      name: 'State Root Proposer',
      accounts: [
        {
          address: '0x9cB01d516D930EF49591a05B09e0D33E6286689D',
          type: 'EOA',
        },
      ],
      description: 'Central actor to post new L2 state roots to L1.',
    },
    {
      name: 'Data Availability Verifiers',
      accounts: [
        {
          address: '0x48fe1f85ff8ad9d088863a42af54d06a1328cf21',
          type: 'EOA',
        },
      ],
      description:
        'Those addresses can try to force the sequencer to post data on chain.',
    },
    {
      name: 'Execution Verifiers',
      accounts: [
        {
          address: '0x48fe1f85ff8ad9d088863a42af54d06a1328cf21',
          type: 'EOA',
        },
      ],
      description:
        'Those addresses can challenge the state roots submitted by the state root proposer.',
    },
  ],
  contracts: {
    addresses: [
      {
        name: '1088_MVM_CanonicalTransaction',
        address: '0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a',
        description:
          'MVM CanonicalTransaction is a wrapper of Canonical Transactin Chain that implements optimistic data \
            availability scheme L1. If Sequencer is not malicious, it simply forwards appendSequencerBatch() calls\
            to CanonicalTransactionChain.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21',
          implementation: '0xC878771A4ff7466B7be8b59FB8766719AEa8d562',
        },
      },
      {
        name: 'CanonicalTransactionChain',
        description:
          'The Canonical Transaction Chain (CTC) contract is an append-only log of transactions which must be applied to the OVM state. It defines the ordering of transactions by writing them to the CTC:batches instance of the Chain Storage Container. CTC batches can only be submitted by OVM_Sequencer. The CTC also allows any account to enqueue() an L2 transaction, which the Sequencer must eventually append to the rollup state.',
        address: '0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9',
      },
      {
        name: 'StateCommitmentChain',
        description:
          'The State Commitment Chain (SCC) contract contains a list of proposed state roots which Proposers assert to be a result of each transaction in the Canonical Transaction Chain (CTC). Elements here have a 1:1 correspondence with transactions in the CTC, and should be the unique state root calculated off-chain by applying the canonical transactions one by one. Currenlty olny OVM_Proposer can submit new state roots.',
        address: '0xf209815E595Cdf3ed0aAF9665b1772e608AB9380',
      },
      {
        name: 'ChainStorageContainer-CTC-batches',
        address: '0x38473Feb3A6366757A249dB2cA4fBB2C663416B7',
      },
      {
        name: 'ChainStorageContainer-CTC-queue',
        address: '0xA91Ea6F5d1EDA8e6686639d6C88b309cF35D2E57',
      },
      {
        name: 'ChainStorageContainer-SCC-batches',
        address: '0x10739F09f6e62689c0aA8A1878816de9e166d6f9',
      },
      {
        name: 'BondManager',
        description:
          "The Bond Manager contract will handle deposits in the form of an ERC20 token from bonded Proposers. It will also handle the accounting of gas costs spent by a Verifier during the course of a challenge. In the event of a successful challenge, the faulty Proposer's bond will be slashed, and the Verifier's gas costs will be refunded. Current mock implementation allows only OVM_Proposer to propose new state roots. No slashing is implemented.",
        address: '0xf51B9C9a1c12e7E48BEC15DC358D0C1f0d7Eb3be',
      },
      {
        name: 'L1CrossDomainMessenger',
        address: '0x081D1101855bD523bA69A9794e0217F0DB6323ff',
        description:
          "The L1 Cross Domain Messenger (L1xDM) contract sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.",
        upgradeability: {
          type: 'EIP1967',
          admin: '0xDD6FFC7D9a4Fb420b637747edc6456340d12d377',
          implementation: '0x8bF439ef7167023F009E24b21719Ca5f768Ecb36',
        },
      },
      {
        name: 'MVM_DiscountOracle',
        description:
          'Oracle specifing user fees for sending L1 -> L2 messages and other parameters for cross-chain communication.',
        address: '0x7f6B0b7589febc40419a8646EFf9801b87397063',
      },
      {
        name: 'Lib_AddressManager',
        description:
          'This is a library that stores the mappings between names such as OVM_Sequencer, OVM_Proposer and other contracts and their addresses.',
        address: '0x918778e825747a892b17C66fe7D24C618262867d',
      },
      {
        name: 'MVM_Verifier',
        description:
          'This contract imlements a voting scheme with which the majority of Verifiers can challenge malicious Sequencer.',
        address: '0xe70DD4dE81D282B3fa92A6700FEE8339d2d9b5cb',
        upgradeability: {
          type: 'EIP1967',
          implementation: '0x47b5A78E127Dfd521532Fdca89651c832Acb7e0E',
          admin: '0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21',
        },
      },
      {
        name: 'MVM_L2ChainManagerOnL1',
        address: '0xf3d58D1794f2634d6649a978f2dc093898FEEBc0',
        description: 'Contract that allows METIS_MANAGER to switch Sequencer.',
        upgradeability: {
          type: 'EIP1967',
          implementation: '0x7b5AFdA01ef32d95858A22E5fc0a6821A12CDAe5',
          admin: '0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21',
        },
      },
      {
        name: 'L1StandardBridge',
        address: '0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b',
        description:
          'Main entry point for users depositing ERC20 tokens and ETH that do not require custom gateway.',
        upgradeability: {
          type: 'EIP1967',
          implementation: '0xa0cfE8Af2AB5C9232714647702DbACf862EA4798',
          admin: '0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21',
        },
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  news: [
    {
      date: '2022-09-14',
      name: 'What does The Merge mean for Metis Andromeda',
      link: 'https://metisdao.medium.com/what-is-the-ethereum-merge-and-what-does-it-mean-for-metis-andromeda-b6f96809bdd3',
    },
    {
      date: '2022-09-06',
      name: 'Relay Chain will be joining the Metis marathon',
      link: 'https://metisdao.medium.com/relay-chain-becomes-joins-the-metis-marathon-as-a-bridge-21fcd2e9b3e8',
    },
    {
      date: '2022-09-06',
      name: 'QiDAO has joined the Metis Marathon',
      link: 'https://metisdao.medium.com/qidao-has-oficially-joined-the-metis-marathon-d41a385d9fcb',
    },
  ],
}
