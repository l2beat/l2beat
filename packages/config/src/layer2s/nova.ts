import { ProjectId, UnixTime } from '@l2beat/types'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  MILESTONES,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { Layer2 } from './types'

export const nova: Layer2 = {
  type: 'layer2',
  id: ProjectId('nova'),
  display: {
    name: 'Arbitrum Nova',
    slug: 'nova',
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
      explorers: [
        'https://nova.arbiscan.io/',
        'https://a4ba-explorer.arbitrum.io/',
      ],
      repositories: ['https://github.com/OffchainLabs/nitro'],
      socialMedia: [
        'https://twitter.com/OffchainLabs',
        'https://twitter.com/arbitrum',
        'https://medium.com/offchainlabs',
        'https://discord.gg/5KE54JwyTs',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [
      {
        address: '0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd',
        sinceTimestamp: new UnixTime(1656073623),
        tokens: ['ETH'],
      },
      {
        address: '0xA2e996f0cb33575FA0E36e8f62fCd4a9b897aAd3',
        sinceTimestamp: new UnixTime(1659620187),
        tokens: ['DAI'],
      },
      {
        address: '0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf',
        sinceTimestamp: new UnixTime(1656305583),
        tokens: '*',
      },
    ],
    events: [],
    transactionApi: {
      type: 'rpc',
      url: 'https://nova.arbitrum.io/rpc',
      callsPerMinute: 200,
      // We need to subtract the Nitro system transaction in every block except for genesis
      assessCount: (count: number, blockNumber: number) =>
        blockNumber !== 0 ? count - 1 : count,
      startBlock: 1, // block 0 has timestamp of beginning of unix time
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      value: 'Fraud proofs (INT)',
      description:
        'Fraud proofs allow WHITELISTED actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve.',
      sentiment: 'warning',
    },
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_TRANSACT_L1,
    validatorFailure: {
      value: 'Propose blocks',
      description:
        'Anyone can become a Validator after 7-days of inactivity from the currently whitelisted Validators.',
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    category: 'Optimistic Chain',
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
          text: 'RollupUserFacet.sol#L281 - Etherscan source code, onlyValidator modifier',
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
          {
            text: 'Mainnet for everyone - Arbitrum Blog',
            href: 'https://offchain.medium.com/mainnet-for-everyone-27ce0f67c85e',
          },
        ],
        risks: [],
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
        'Arbitrum Nova uses Nitro technology that allows running fraud proofs by executing EVM code on top of WASM.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'there are mistakes in the highly complex Nitro and WASM one-step prover implementation.',
        },
      ],
      references: [
        {
          text: 'Arbitrum Nitro Sneak Preview',
          href: 'https://medium.com/offchainlabs/arbitrum-nitro-sneak-preview-44550d9054f5',
        },
      ],
    },
  },
  contracts: {
    addresses: [
      {
        address: '0x71D78dC7cCC0e037e12de1E50f5470903ce37148',
        name: 'ProxyAdmin',
        description:
          'This contract is an admin of most other contracts allowed to upgrade their implementations. It is owned by a 4-of-6 multisig.',
      },
      {
        address: '0xFb209827c58283535b744575e11953DCC4bEAD88',
        name: 'Rollup',
        description:
          'Main contract implementing Arbitrum Nova Rollup. Manages other Rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.',
        upgradeability: {
          type: 'Arbitrum',
          admin: '0xC234E41AE2cb00311956Aa7109fC801ae8c80941',
          adminImplementation: '0x72f193d0F305F532C87a4B9D0A2F407a3F4f585f',
          userImplementation: '0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff',
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
          implementation: '0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9',
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
          implementation: '0x1b2676D32E2f7430a564DD4560641F990dFE3D6a',
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
          implementation: '0x1066CEcC8880948FE55e427E94F1FF221d626591',
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
          'This is a different proxy admin for the three gateway contracts below. It is also owned by a 4-of-6 multisig.',
      },
      {
        address: '0xC840838Bc438d73C16c2f8b22D2Ce3669963cD48',
        name: 'L1GatewayRouter',
        description: 'Router managing token <--> gateway mapping.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0xa8f7DdEd54a726eB873E98bFF2C95ABF2d03e560',
          implementation: '0x52595021fA01B3E14EC6C88953AFc8E35dFf423c',
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
          implementation: '0xb4299A1F5f26fF6a98B7BA35572290C359fde900',
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
          implementation: '0xC8D26aB9e132C79140b3376a0Ac7932E4680Aa45',
        },
      },
      {
        address: '0x97f63339374fCe157Aa8Ee27830172d2AF76A786',
        name: 'L1DaiGateway',
        description:
          'Custom DAI Gateway, main entry point for users depositing DAI to L2 where "canonical" L2 DAI token managed by MakerDAO will be minted. Managed by MakerDAO.',
      },
      {
        address: '0xA2e996f0cb33575FA0E36e8f62fCd4a9b897aAd3',
        name: 'L1Escrow',
        description: 'DAI Vault for custom DAI Gateway managed by MakerDAO.',
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      ...MILESTONES.MAINNET_OPEN,
      date: '2022-08-09T00:00:00Z',
      link: 'https://medium.com/offchainlabs/its-time-for-a-new-dawn-nova-is-open-to-the-public-a081df1e4ad2',
    },
  ],
}
