import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { Project } from './types'

export const metis: Project = {
  name: 'Metis Andromeda',
  slug: 'metis',
  bridges: [
    {
      address: '0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b',
      sinceBlock: 13627429,
      tokens: '*',
    },
  ],
  associatedTokens: ['Metis'],
  details: {
    description:
      'Metis is an EVM-equivalent Optimistic Rollup chain originally forked from Optimism. It provides support for multiple, \
      interconnected rollups with main focus on supporting easy creation of DACs (Decentralized Autonomous Companies). \
      The risk analysis below relates to the default chain with chainId=1088 called Andromeda.',
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
    provider: 'Optimism',
    riskView: {
      stateValidation: {
        value: 'In development',
        description:
          'Currently the system permits invalid state roots. More details in project overview.',
        sentiment: 'bad',
      },
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      sequencerFailure: RISK_VIEW.SEQUENCER_TRANSACT_L1,
      validatorFailure: RISK_VIEW.VALIDATOR_WHITELISTED_BLOCKS,
    },
    technology: {
      category: {
        name: 'Optimistic Rollup',
      },
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
        ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
        references: [
          {
            text: 'CanonicalTransactionChain - Etherscan source code',
            href: 'https://etherscan.io/address/0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9#code',
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
      contracts: {
        addresses: [
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
            address: '0xC8953ca384b4AdC8B1b11B030Afe2F05471664b0',
          },
          {
            name: 'Lib_AddressManager',
            description:
              'This is a library that stores the mappings between names such as OVM_Sequencer, OVM_Proposer and other contracts and their addresses.',
            address: '0x918778e825747a892b17C66fe7D24C618262867d',
          },
          {
            name: 'MVM_Verifier',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
            address: '0x9Ed4739afd706122591E75F215208ecF522C0Fd3',
          },
          {
            name: 'MVM_L2ChainManagerOnL1',
            address: '0xf3d58D1794f2634d6649a978f2dc093898FEEBc0',
            description:
              'Contract that allows METIS_MANAGER to switch Sequencer.',
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
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK, CONTRACTS.UNVERIFIED_RISK],
      },
    },
    news: [
      {
        date: '2021-11-03',
        name: 'Metis to Launch Andromeda, Honoring Our Commitment to Decentralization',
        link: 'https://metisdao.medium.com/metis-to-launch-andromeda-honoring-our-commitment-to-decentralization-fa2d03394398',
      },
      {
        date: '2021-11-23',
        name: 'Metis DAC Staking Starts Nov 26',
        link: 'https://metisdao.medium.com/metis-dac-staking-starts-nov-26-heres-everything-you-need-to-know-53220bfb4874',
      },
    ],
  },
}
