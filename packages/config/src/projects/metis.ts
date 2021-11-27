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
      tokens: ['Metis', 'USDT', 'LINK', 'AAVE', 'UNI', 'DAI', 'USDC'],
    },
  ],
  associatedToken: 'Metis',
  details: {
    description:
      'Metis is an EVM-equivalent Optimistic Rollup chain originally forked from Optimism. It provides support for multiple, interconnected rollups with main focus on supporting easy creation of DACs (Decentralized Autonomous Companies).',
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
    riskView: {
      stateValidation: {
        value: 'Proofs disabled',
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
        name: 'Fraud proofs are disabled',
        description:
          'Metis will use fraud proofs to enforce state correctness. This feature is currently disabled and the system permits invalid state roots. In the meantime any staked validator can challenge invalid state root submitted by the Sequencer. Other validators will then act as referees in a interactive challenge game.',
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
            name: 'BondManager',
            address: '0xf51B9C9a1c12e7E48BEC15DC358D0C1f0d7Eb3be',
          },
          {
            name: 'CanonicalTransactionChain',
            address: '0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9',
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
            name: 'L1StandardBridge_for_verification_only',
            address: '0x101500214981e7A5Ad2334D8404eaF365C2c3113',
          },
          {
            name: 'AddressManager',
            address: '0x918778e825747a892b17C66fe7D24C618262867d',
          },
          {
            name: 'MVM_DiscountOracle',
            address: '0xC8953ca384b4AdC8B1b11B030Afe2F05471664b0',
          },
          {
            name: 'MVM_L2ChainManagerOnL1_for_verification_only',
            address: '0x9E2E3be85df5Ca63DE7674BA64ffD564075f3B48',
          },
          {
            name: 'MVM_Verifier',
            address: '0x9Ed4739afd706122591E75F215208ecF522C0Fd3',
          },
          {
            name: 'OVM_L1CrossDomainMessenger',
            address: '0x8bF439ef7167023F009E24b21719Ca5f768Ecb36',
          },
          {
            name: 'Proxy__MVM_ChainManager',
            address: '0xf3d58D1794f2634d6649a978f2dc093898FEEBc0',
            upgradeability: {
              type: 'EIP1967',
              implementation: '0x7b5AFdA01ef32d95858A22E5fc0a6821A12CDAe5',
              admin: '0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21',
            },
          },
          {
            name: 'Proxy__OVM_L1CrossDomainMessenger',
            address: '0x081D1101855bD523bA69A9794e0217F0DB6323ff',
          },
          {
            name: 'Proxy__OVM_L1StandardBridge',
            address: '0x3980c9ed79d2c191A89E02Fa3529C60eD6e9c04b',
            upgradeability: {
              type: 'EIP1967',
              implementation: '0xa0cfE8Af2AB5C9232714647702DbACf862EA4798',
              admin: '0x48fE1f85ff8Ad9D088863A42Af54d06a1328cF21',
            },
          },
          {
            name: 'OVM_StateCommitmentChain',
            address: '0xf209815E595Cdf3ed0aAF9665b1772e608AB9380',
          },
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
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
