import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'

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

export const arbitrum: Layer2 = {
  type: 'layer2',
  id: ProjectId('arbitrum'),
  display: {
    name: 'Arbitrum One',
    slug: 'arbitrum',
    warning:
      'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
    description:
      "Arbitrum is an Optimistic Rollup that aims to feel exactly like interacting with Ethereum, but with transactions costing a fraction of what they do on L1.\
      Centralized Sequencer receives users' transactions and regularly sends the transaction batch to mainnet Ethereum. Independent Validators (currently whitelisted)\
      read transaction batches from L1, execute them and submit a resulting L2 state root to L1. Any other Validator can challenge the state root within the challenge window (7-days). \
      The challenge will result in an interactive fraud proof game that will be eventually settled by L1. As long as there is at least one honest Validator, users are guaranteed that\
      eventually correct L2 state root will be published to L1. If Sequencer is censoring users transactions, it is possible to force the transaction via L1 queue. If no Validator publishes\
      L2 state root within 7 days, the Validator whitelist is dropped and anyone can take over as a new Validator.",
    purpose: 'Universal',
    links: {
      websites: ['https://arbitrum.io/', 'https://offchainlabs.com/'],
      apps: [],
      documentation: ['https://developer.offchainlabs.com/'],
      explorers: ['https://arbiscan.io', 'https://explorer.arbitrum.io/'],
      repositories: [
        'https://github.com/OffchainLabs/arbitrum',
        'https://github.com/OffchainLabs/nitro',
        'https://github.com/OffchainLabs/arb-os',
      ],
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
        address: '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
        sinceTimestamp: new UnixTime(1661450734),
        tokens: ['ETH'],
      },
      {
        // This bridge is inactive, but we keep it
        // in case we have to gather historic data
        address: '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
        sinceTimestamp: new UnixTime(1622243344),
        tokens: ['ETH'],
      },
      {
        address: '0xcEe284F754E854890e311e3280b767F80797180d',
        sinceTimestamp: new UnixTime(1623867835),
        tokens: '*',
      },
      {
        address: '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
        sinceTimestamp: new UnixTime(1623784100),
        tokens: '*',
      },
      {
        address: '0xA10c7CE4b876998858b1a9E12b10092229539400',
        sinceTimestamp: new UnixTime(1632133470),
        tokens: ['DAI'],
      },
    ],
    events: [
      {
        name: 'NodeConfirmed',
        abi: 'event NodeConfirmed(uint256 indexed nodeNum, bytes32 afterSendAcc, uint256 afterSendCount, bytes32 afterLogAcc, uint256 afterLogCount)',
        emitter: EthereumAddress('0xC12BA48c781F6e392B49Db2E25Cd0c28cD77531A'),
        type: 'state',
        sinceTimestamp: new UnixTime(1622243344),
        untilTimestamp: new UnixTime(1661957100),
      },
      {
        name: 'SequencerBatchDeliveredFromOrigin',
        abi: 'event SequencerBatchDeliveredFromOrigin (uint256 indexed firstMessageNum, bytes32 indexed beforeAcc, uint256 newMessageCount, bytes32 afterAcc, uint256 seqBatchIndex)',
        emitter: EthereumAddress('0x4c6f947ae67f572afa4ae0730947de7c874f95ef'),
        type: 'data',
        sinceTimestamp: new UnixTime(1622243344),
        untilTimestamp: new UnixTime(1661956210),
      },
      {
        name: 'SequencerBatchDelivered',
        abi: 'event SequencerBatchDelivered(uint256 indexed batchSequenceNumber,bytes32 indexed beforeAcc,bytes32 indexed afterAcc,bytes32 delayedAcc,uint256 afterDelayedMessagesRead,tuple(uint64 minTimestamp,uint64 maxTimestamp,uint64 minBlockNumber, uint64 maxBlockNumber) timeBounds,uint8 dataLocation)',
        emitter: EthereumAddress('0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6'),
        type: 'data',
        sinceTimestamp: new UnixTime(1661457944),
      },
      {
        name: 'NodeCreated',
        abi: 'event NodeCreated(uint64 indexed nodeNum,bytes32 indexed parentNodeHash,bytes32 indexed nodeHash,bytes32 executionHash,tuple(tuple(tuple(bytes32[2] bytes32Vals,uint64[2] u64Vals) globalState, uint8 machineStatus) beforeState, tuple(tuple(bytes32[2] bytes32Vals,uint64[2] u64Vals) globalState, uint8 machineStatus) afterState, uint64 numBlocks),bytes32 afterInboxBatchAcc,bytes32 wasmModuleRoot,uint256 inboxMaxCount)',
        emitter: EthereumAddress('0x5eF0D09d1E6204141B4d37530808eD19f60FBa35'),
        type: 'state',
        sinceTimestamp: new UnixTime(1661457944),
      },
    ],
    transactionApi: {
      type: 'rpc',
      // We need to subtract the Nitro system transactions
      // after the block of the update
      assessCount: (count: number, blockNumber: number) =>
        blockNumber >= 22207818 ? count - 1 : count,
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
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_TRANSACT_L1,
    validatorFailure: {
      value: 'Propose blocks',
      description:
        'Anyone can become a Validator after 7-days of inactivity from the currently whitelisted Validators.',
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  }),
  technology: {
    category: 'Optimistic Rollup',
    stateCorrectness: {
      name: 'Fraud proofs ensure state correctness',
      description:
        'After some period of time, the published state root is assumed to be correct. For a certain time period, usually one week, one of the whitelisted actors can submit a fraud proof that shows that the state was incorrect.',
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
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'Submitting Transactions - Arbitrum documentation',
          href: 'https://developer.offchainlabs.com/docs/rollup_basics#submitting-transactions',
        },
      ],
    },
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
        'Arbitrum One uses Nitro technology that allows running fraud proofs by executing EVM code on top of WASM.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'there are mistakes in the highly complex Nitro and WASM one-step prover implementation.',
        },
      ],
      references: [
        {
          text: 'Inside Arbitrum Nitro',
          href: 'https://developer.offchainlabs.com/inside-arbitrum-nitro/',
        },
      ],
    },
  },
  permissions: [
    {
      name: 'Arbitrum MultiSig',
      accounts: [
        {
          address: '0xC234E41AE2cb00311956Aa7109fC801ae8c80941',
          type: 'MultiSig',
        },
      ],
      description:
        'The admin of all contracts in the system, capable of issuing upgrades without notice and delay. This allows it to censor transactions, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer or any other system component (unlimited upgrade power). It is also the admin of the special purpose smart contracts used by validators.',
    },
    {
      name: 'MultiSig participants',
      accounts: [
        {
          address: '0x702105E66C468b5191553702cD6BF3D6Bbfa4C6b',
          type: 'EOA',
        },
        {
          address: '0xfE2bf40f2A9183774BF8E871d634A4E50255158B',
          type: 'EOA',
        },
        {
          address: '0x64379Dee676ab442B48925Ed603771f386510Ee7',
          type: 'EOA',
        },
        {
          address: '0x290Aa3E7533c873B3326DabFe7579e86ed951428',
          type: 'EOA',
        },
        {
          address: '0x4d9A23BD4DBBdC04A88B99d8d2ac450EB6b8f49C',
          type: 'EOA',
        },
        {
          address: '0x79D3Bb67EA7aB77E015af3dA885E8ed9C48a9fCe',
          type: 'EOA',
        },
      ],
      description:
        'These addresses are the participants of the 4/6 Arbitrum MultiSig.',
    },
    {
      name: 'Sequencer',
      accounts: [
        {
          address: '0xa4b1E63Cb4901E327597bc35d36FE8a23e4C253f',
          type: 'EOA',
        },
      ],
      description:
        'Central actor allowed to set the order in which L2 transactions are executed.',
    },
    {
      name: 'Validators',
      accounts: [
        {
          address: '0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398',
          type: 'Contract',
        },
        {
          address: '0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b',
          type: 'Contract',
        },
        {
          address: '0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104',
          type: 'EOA',
        },
        {
          address: '0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4',
          type: 'EOA',
        },
        {
          address: '0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78',
          type: 'Contract',
        },
        {
          address: '0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0',
          type: 'Contract',
        },
        {
          address: '0x610Aa279989F440820e14248BD3879B148717974',
          type: 'EOA',
        },
        {
          address: '0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E',
          type: 'EOA',
        },
        {
          address: '0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c',
          type: 'EOA',
        },
        {
          address: '0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5',
          type: 'EOA',
        },
        {
          address: '0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5',
          type: 'Contract',
        },
        {
          address: '0xAB1A39332e934300eBCc57B5f95cA90631a347FF',
          type: 'EOA',
        },
        {
          address: '0x7CF3d537733F6Ba4183A833c9B021265716cE9d0',
          type: 'Contract',
        },
      ],
      description:
        'They can submit new state roots and challenge state roots. Some of the validators perform their duties through special purpose smart contracts.',
    },
  ],
  contracts: {
    addresses: [
      {
        address: '0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD',
        name: 'ProxyAdmin (1)',
        description:
          'This contract is an admin of SequencerInbox, Bridge, Outbox and ChallengeManager contracts. It is owned by a 4-of-6 multisig.',
      },
      {
        address: '0x5eF0D09d1E6204141B4d37530808eD19f60FBa35',
        name: 'Rollup',
        description:
          'Main contract implementing Arbitrum One Rollup. Manages other Rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.',
        upgradeability: {
          type: 'Arbitrum',
          admin: '0xC234E41AE2cb00311956Aa7109fC801ae8c80941',
          adminImplementation: '0x72f193d0F305F532C87a4B9D0A2F407a3F4f585f',
          userImplementation: '0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff',
        },
      },
      {
        address: '0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6',
        name: 'SequencerInbox',
        description:
          'Main entry point for the Sequencer submitting transaction batches to a Rollup.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD',
          implementation: '0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9',
        },
      },
      {
        address: '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
        name: 'Inbox',
        description:
          'Entry point for users depositing ETH and sending L1 --> L2 messages. Deposited ETH is escowed in a Bridge contract.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD',
          implementation: '0x5aED5f8A1e3607476F1f81c3d8fe126deB0aFE94',
        },
      },
      {
        address: '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
        name: 'Bridge',
        description:
          'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD',
          implementation: '0x1066CEcC8880948FE55e427E94F1FF221d626591',
        },
      },
      {
        address: '0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840',
        name: 'Outbox',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD',
          implementation: '0x0eA7372338a589e7f0b00E463a53AA464ef04e17',
        },
      },
      {
        address: '0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa',
        name: 'ProxyAdmin (2)',
        description:
          'This is a different proxy admin for the three gateway contracts below. It is also owned by a 4-of-6 multisig..',
      },
      {
        address: '0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef',
        name: 'L1GatewayRouter',
        description: 'Router managing token <--> gateway mapping.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa',
          implementation: '0x52595021fA01B3E14EC6C88953AFc8E35dFf423c',
        },
      },
      {
        address: '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
        name: 'L1ERC20Gateway',
        description:
          'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa',
          implementation: '0xb4299A1F5f26fF6a98B7BA35572290C359fde900',
        },
      },
      {
        address: '0xcEe284F754E854890e311e3280b767F80797180d',
        name: 'L1CustomGateway',
        description:
          'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa',
          implementation: '0xC8D26aB9e132C79140b3376a0Ac7932E4680Aa45',
        },
      },
      {
        address: '0xD3B5b60020504bc3489D6949d545893982BA3011',
        name: 'L1DaiGateway',
        description:
          'Custom DAI Gateway, main entry point for users depositing DAI to L2 where "canonical" L2 DAI token managed by MakerDAO will be minted. Managed by MakerDAO.',
      },
      {
        address: '0xA10c7CE4b876998858b1a9E12b10092229539400',
        name: 'L1Escrow',
        description: 'DAI Vault for custom DAI Gateway managed by MakerDAO.',
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Nitro Upgrade',
      link: 'https://medium.com/offchainlabs/arbitrum-nitro-one-small-step-for-l2-one-giant-leap-for-ethereum-bc9108047450',
      date: '2022-08-31T00:00:00Z',
      description:
        'Upgrade is live, introducing new architecture, increased throughput and lower fees.',
    },
    {
      name: 'Odyssey paused',
      link: 'https://twitter.com/arbitrum/status/1542159109511847937',
      date: '2022-06-29T00:00:00Z',
      description:
        'Due of the heavy load being put on the chain, Odyssey program got paused.',
    },
    {
      name: 'Odyssey started',
      link: 'https://twitter.com/arbitrum/status/1539292126105706496',
      date: '2022-06-21T00:00:00Z',
      description: 'Incentives program to onboard new users has started.',
    },
    {
      ...MILESTONES.MAINNET_OPEN,
      link: 'https://twitter.com/arbitrum/status/1432817424752128008',
      date: '2021-08-31T00:00:00Z',
    },
  ],
}
