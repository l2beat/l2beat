import { ProjectId, UnixTime } from '@l2beat/common'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { Project } from './types'

export const nova: Project = {
  name: 'Arbitrum Nova',
  slug: 'nova',
  id: ProjectId('nova'),
  bridges: [
    {
      address: '0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd',
      sinceTimestamp: new UnixTime(1656073623),
      tokens: ['ETH'],
    },
    {
      address: '0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf',
      sinceTimestamp: new UnixTime(1656305583),
      tokens: '*',
    },
  ],
  details: {
    description:
      'Arbitrum Nova is an AnyTrust chain that aims for ultra low transaction fees. Nova differs from Arbitrum One by not posting transaction data on chain, but to Data Availability Committee.',
    purpose: 'Universal',
    links: {
      websites: ['https://arbitrum.io/', 'https://offchainlabs.com/'],
      apps: [],
      documentation: [
        'https://developer.offchainlabs.com/',
        'https://github.com/OffchainLabs/nitro/blob/master/docs/inside_anytrust.md',
      ],
      explorers: ['https://a4ba-explorer.arbitrum.io/'],
      repositories: ['https://github.com/OffchainLabs/nitro'],
      socialMedia: [
        'https://twitter.com/OffchainLabs',
        'https://twitter.com/arbitrum',
        'https://medium.com/offchainlabs',
        'https://discord.gg/5KE54JwyTs',
      ],
    },
    riskView: {
      stateValidation: {
        value: 'Fraud proofs (INT)',
        description:
          'Fraud proofs allow WHITELISTED actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve.',
        sentiment: 'warning',
      },
      dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      sequencerFailure: RISK_VIEW.SEQUENCER_TRANSACT_L1,
      validatorFailure: RISK_VIEW.VALIDATOR_WHITELISTED_BLOCKS,
    },
    technology: {
      category: {
        name: 'Optimistic Chain',
      },
      stateCorrectness: {
        name: 'Fraud proofs ensure state correctness',
        description:
          'After some period of time, the published state root is assumed to be correct. For a certain time period, usually one week one of the whitelisted actors can submit a fraud proof that shows that the state was incorrect.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'none of the whitelisted verifiers checks the published state. Fraud proofs assume at least one honest and able validator.',
            isCritical: true,
          },
        ],
        references: [
          {
            text: 'Executing and Securing the Chain - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/rollup_basics#executing-and-securing-the-chain',
          },
          {
            text: 'Note: onlyValidator modifier',
            href: 'https://etherscan.io/address/0x00c51f63a2d906510cb2c802c0a30589ba75d942#code#F1#L281',
          },
        ],
      },
      dataAvailability: DATA_AVAILABILITY.ANYTRUST_OFF_CHAIN,
      operator: {
        ...OPERATOR.CENTRALIZED_SEQUENCER,
        references: [
          {
            text: 'Validators - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/inside_arbitrum#validators',
          },
          {
            text: 'If the sequencer is malicious - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/inside_arbitrum#if-the-sequencer-is-malicious',
          },
        ],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
        references: [
          {
            text: 'Submitting Transactions - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/rollup_basics#submitting-transactions',
          },
        ],
      },
      exitMechanisms: [
        {
          ...EXITS.REGULAR('optimistic', 'merkle proof'),
          references: [
            {
              text: 'L2 to L1 Messages Lifecycle - Arbitrum documentation',
              href: 'https://developer.offchainlabs.com/docs/l1_l2_messages#l2-to-l1-messages-lifecycle',
            },
            {
              text: 'Rules for Confirming or Rejecting Rollup Blocks - Arbitrum documentation',
              href: 'https://developer.offchainlabs.com/docs/inside_arbitrum#rules-for-confirming-or-rejecting-rollup-blocks',
            },
          ],
          risks: [
            {
              ...EXITS.RISK_CENTRALIZED_VALIDATOR,
              references: [
                {
                  text: 'Mainnet for everyone - Arbitrum Blog',
                  href: 'https://offchain.medium.com/mainnet-for-everyone-27ce0f67c85e',
                },
              ],
            },
          ],
        },
        {
          name: 'Tradeable Bridge Exit',
          description:
            "When a user initiates a regular withdrawal a third party verifying the chain can offer to buy this withdrawal by paying the user on L1. The user will get the funds immediately, however the third party has to wait for the block to be finalized. This is implemented as a first party functionality inside Arbitrum's token bridge.",
          risks: [],
          references: [
            {
              text: 'Tradeable Bridge Exits - Arbitrum documentation',
              href: 'https://developer.offchainlabs.com/docs/withdrawals#tradeable-bridge-exits',
            },
          ],
        },
      ],
      smartContracts: {
        name: 'EVM compatible smart contracts are supported',
        description:
          'Arbitrum uses the Arbitrum Virtual Machine (AVM) to execute transactions. This is similar to the EVM, but is independent from it and allows fraud proofs to be executed.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'there are mistakes in the highly complex AVM implementation.',
          },
        ],
        references: [
          {
            text: 'AVM - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/inside_arbitrum#avm-the-arbitrum-virtual-machine',
          },
        ],
      },
      // permissions: [],
      contracts: {
        addresses: [
          {
            address: '0x71D78dC7cCC0e037e12de1E50f5470903ce37148',
            name: 'ProxyAdmin',
            description:
              'This contract is an admin of most other contracts allowed to upgrade their implementations. It is owned by EOA.',
          },
          {
            address: '0xFb209827c58283535b744575e11953DCC4bEAD88',
            name: 'Rollup',
            description:
              'Main contract implementing Arbitrum Nova Rollup. Manages other Rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.',
            upgradeability: {
              type: 'Arbitrum',
              admin: '0x9C040726F2A657226Ed95712245DeE84b650A1b5',
              adminImplementation: '0x309f49bD32B1098F4dF20a9DD51954e8680d77B1',
              userImplementation: '0xFb333bac71f639de467872aFE02F7896F22F368d',
            },
          },
          {
            address: '0x211E1c4c7f1bF5351Ac850Ed10FD68CFfCF6c21b',
            name: 'SequencerInbox',
            description:
              'Main entry point for the Sequencer submitting transaction batches to a Rollup.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x71D78dC7cCC0e037e12de1E50f5470903ce37148',
              implementation: '0x2e3367cc9bd83959EF103AdF6fFea6200D0A15f0',
            },
          },
          {
            address: '0xc4448b71118c9071Bcb9734A0EAc55D18A153949',
            name: 'Inbox',
            description:
              'Entry point for users depositing ETH and sending L1 --> L2 messages. Deposited ETH is escowed in a Bridge contract.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x71D78dC7cCC0e037e12de1E50f5470903ce37148',
              implementation: '0xB46e8571760Da0CFaEB9c9689C449Eb7dD7cB3e7',
            },
          },
          {
            address: '0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd',
            name: 'Bridge',
            description:
              'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x71D78dC7cCC0e037e12de1E50f5470903ce37148',
              implementation: '0xd4254a4d136203dAd7AE5Ee05D6BD65B8d13157d',
            },
          },
          {
            address: '0xD4B80C3D7240325D18E645B49e6535A3Bf95cc58',
            name: 'Outbox',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x71D78dC7cCC0e037e12de1E50f5470903ce37148',
              implementation: '0x7439d8d4F3b9d9B6222f3E9760c75a47e08a7b3f',
            },
          },
          {
            address: '0xA59075221b50C598aED0Eae0bB9869639513af0D',
            name: 'ChallengeManager',
            description:
              'Contract managing an interactive fraud challenge process.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x71D78dC7cCC0e037e12de1E50f5470903ce37148',
              implementation: '0x7a18bB9DbAF1202F3fc977e42E3C360d522e4566',
            },
          },
          {
            address: '0x7AdcA86896c4220f19B2f7f9746e7A99E57B0Fc5',
            name: 'OneStepProofEntry',
            description:
              'Contract managing adjudication logic for EVM implementation in WASM used by the fraud proofs.',
          },
          {
            address: '0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560',
            name: 'ProxyAdmin (2)',
            description:
              'This is a different proxy admin for the three gateway contracts below. It is also owned by a 4-of-6 multisig..',
          },
          {
            address: '0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48',
            name: 'L1GatewayRouter',
            description: 'Router managing token <--> gateway mapping.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560',
              implementation: '0xa9610559f1E5BB0Eab9a25e21137D39426fd477E',
            },
          },
          {
            address: '0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf',
            name: 'L1ERC20Gateway',
            description:
              'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560',
              implementation: '0xf852de96aD5Ca30d54b40b9cE5c8C6DE56C0Ef4B',
            },
          },
          {
            address: '0x23122da8C581AA7E0d07A36Ff1f16F799650232f',
            name: 'L1CustomGateway',
            description:
              'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560',
              implementation: '0x97367486f5905c2B7EE7b58330Fb4EB52639db17',
            },
          },
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
    },
    news: [
      {
        date: '2022-06-29',
        name: 'Arbitrum Nova open for Developers',
        link: 'https://medium.com/offchainlabs/introducing-nova-arbitrum-anytrust-mainnet-is-open-for-developers-9a54692f345e',
      },
    ],
  },
}
