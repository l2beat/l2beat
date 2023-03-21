import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  MILESTONES,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { ProjectDiscovery } from './common/ProjectDiscovery'
import { UPGRADE_MECHANISM } from './common/upgradeMechanism'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('arbitrum')

export const arbitrum: Layer2 = {
  type: 'layer2',
  id: ProjectId('arbitrum'),
  display: {
    name: 'Arbitrum One',
    slug: 'arbitrum',
    warning:
      'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted. Also, the DAO is not yet deployed, so all the upgrade power lays in the hands of the Security Council.',
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
        address: EthereumAddress('0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a'),
        sinceTimestamp: new UnixTime(1661450734),
        tokens: ['ETH'],
      },
      {
        // This bridge is inactive, but we keep it
        // in case we have to gather historic data
        address: EthereumAddress('0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515'),
        sinceTimestamp: new UnixTime(1622243344),
        tokens: ['ETH'],
      },
      {
        address: EthereumAddress('0xcEe284F754E854890e311e3280b767F80797180d'),
        sinceTimestamp: new UnixTime(1623867835),
        tokens: '*',
      },
      {
        address: EthereumAddress('0xa3A7B6F88361F48403514059F1F16C8E78d60EeC'),
        sinceTimestamp: new UnixTime(1623784100),
        tokens: '*',
      },
      {
        address: EthereumAddress('0xA10c7CE4b876998858b1a9E12b10092229539400'),
        sinceTimestamp: new UnixTime(1632133470),
        tokens: ['DAI'],
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
    upgradeability: RISK_VIEW.UPGRADABLE_ARBITRUM,
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
          text: 'How is fraud proven - Arbitrum documentation FAQ',
          href: 'https://developer.offchainlabs.com/intro/#q-and-how-exactly-is-fraud-proven-sounds-complicated',
        },
        {
          text: 'RollupUser.sol#L288 - Etherscan source code, onlyValidator modifier',
          href: 'https://etherscan.io/address/0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff#code#F61#L288',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'Sequencing followed by deterministic execution - Arbitrum documentation',
          href: 'https://developer.offchainlabs.com/inside-arbitrum-nitro/#sequencing-followed-by-deterministic-execution',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_SEQUENCER,
      references: [
        {
          text: 'Sequencer - Arbitrum documentation',
          href: 'https://developer.offchainlabs.com/sequencer',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
      references: [
        {
          text: 'Sequencer Isn’t Doing Its Job - Arbitrum documentation',
          href: 'https://developer.offchainlabs.com/sequencer#unhappyuncommon-case-sequencer-isnt-doing-its-job',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'Transaction lifecycle - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/tx-lifecycle',
          },
          {
            text: 'L2 to L1 Messages - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/arbos/l2-to-l1-messaging',
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
    upgradeMechanism: UPGRADE_MECHANISM.ARBITRUM_DAO,
  },
  permissions: [
    {
      name: 'Security Council',
      accounts: [
        {
          address: EthereumAddress(
            '0x3666a60ff589873ced457a9a8a0aA6F83D708767',
          ),
          type: 'MultiSig',
        },
      ],
      description:
        'The admin of all contracts in the system, capable of issuing upgrades without notice and delay. This allows it to censor transactions, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer or any other system component (unlimited upgrade power). It is also the admin of the special purpose smart contracts used by validators.',
    },
    {
      name: 'Security Council participants',
      accounts: discovery
        .getContractValue<string[]>(
          '0x3666a60ff589873ced457a9a8a0aA6F83D708767',
          'getOwners',
        )
        .map((owner) => ({ address: EthereumAddress(owner), type: 'EOA' })),
      description: `These addresses are the participants of the ${discovery.getContractValue<number>(
        '0x3666a60ff589873ced457a9a8a0aA6F83D708767',
        'getThreshold',
      )}/${
        discovery.getContractValue<string[]>(
          '0x3666a60ff589873ced457a9a8a0aA6F83D708767',
          'getOwners',
        ).length
      } Security Council MultiSig`,
    },
    {
      name: 'Sequencer',
      accounts: [
        {
          address: EthereumAddress(
            '0xa4b1E63Cb4901E327597bc35d36FE8a23e4C253f',
          ),
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
          address: EthereumAddress(
            '0x758C6bB08B3ea5889B5cddbdeF9A45b3a983c398',
          ),
          type: 'Contract',
        },
        {
          address: EthereumAddress(
            '0xf59caf75e8A4bFBA4e6e07aD86C7E498E4d2519b',
          ),
          type: 'Contract',
        },
        {
          address: EthereumAddress(
            '0x6Fb914de4653eC5592B7c15F4d9466Cbd03F2104',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x0fF813f6BD577c3D1cDbE435baC0621BE6aE34B4',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x56D83349c2B8DCF74d7E92D5b6B33d0BADD52D78',
          ),
          type: 'Contract',
        },
        {
          address: EthereumAddress(
            '0xB0CB1384e3f4a9a9b2447e39b05e10631E1D34B0',
          ),
          type: 'Contract',
        },
        {
          address: EthereumAddress(
            '0x610Aa279989F440820e14248BD3879B148717974',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xdDf2F71Ab206C0138A8eceEb54386567D5abF01E',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x54c0D3d6C101580dB3be8763A2aE2c6bb9dc840c',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xF8D3E1cF58386c92B27710C6a0D8A54c76BC6ab5',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x83215480dB2C6A7E56f9E99EF93AB9B36F8A3DD5',
          ),
          type: 'Contract',
        },
        {
          address: EthereumAddress(
            '0xAB1A39332e934300eBCc57B5f95cA90631a347FF',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x7CF3d537733F6Ba4183A833c9B021265716cE9d0',
          ),
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
        address: EthereumAddress('0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD'),
        name: 'ProxyAdmin (1)',
        description:
          'This contract is an admin of SequencerInbox, RollupEventInbox, Bridge, Outbox, Inbox and ChallengeManager contracts. It is owned by the Upgrade Executor.',
      },
      {
        address: discovery.getContract('UpgradeExecutor').address,
        name: 'UpgradeExecutor',
        description:
          "This contract can upgrade the system's contracts. The upgrades can be done either by the Security Council or by the L1ArbitrumTimelock.",
        upgradeability: discovery.getContract('UpgradeExecutor').upgradeability,
      },
      {
        address: EthereumAddress('0x5613AF0474EB9c528A34701A5b1662E3C8FA0678'),
        name: 'ProxyAdmin (2)',
        description:
          'This contract is an admin of the Update Executor contract, but is also owned by it.',
      },
      {
        address: discovery.getContract('L1ArbitrumTimelock').address,
        name: 'L1ArbitrumTimelock',
        description:
          'Timelock contract for Arbitrum DAO Governance. It gives the DAO participants the ability to upgrade the system. Only the L2 counterpart of this contract can execute the upgrades.',
      },
      {
        address: discovery.getContract('RollupProxy').address,
        name: 'Rollup',
        description:
          'Main contract implementing Arbitrum One Rollup. Manages other Rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.',
        upgradeability: discovery.getContract('RollupProxy').upgradeability,
      },
      {
        address: EthereumAddress('0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6'),
        name: 'SequencerInbox',
        description:
          'Main entry point for the Sequencer submitting transaction batches to a Rollup.',
        upgradeability: discovery.getContract(
          '0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6',
        ).upgradeability,
      },
      {
        address: discovery.getContract('Inbox').address,
        name: 'Inbox',
        description:
          'Entry point for users depositing ETH and sending L1 --> L2 messages. Deposited ETH is escrowed in a Bridge contract.',
        upgradeability: discovery.getContract('Inbox').upgradeability,
      },
      {
        address: EthereumAddress('0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a'),
        name: 'Bridge',
        description:
          'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
        upgradeability: discovery.getContract(
          '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
        ).upgradeability,
      },
      {
        address: EthereumAddress(
          discovery.getContractValue<string>('RollupProxy', 'outbox'),
        ),
        name: 'Outbox',
        upgradeability: discovery.getContract(
          discovery.getContractValue<string>('RollupProxy', 'outbox'),
        ).upgradeability,
      },
      {
        address: EthereumAddress('0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa'),
        name: 'ProxyAdmin (3)',
        description:
          'This is yet another proxy admin for the three gateway contracts below. It is owned by the Upgrade Executor.',
      },
      {
        address: discovery.getContract('L1GatewayRouter').address,
        name: 'L1GatewayRouter',
        description: 'Router managing token <--> gateway mapping.',
        upgradeability: discovery.getContract('L1GatewayRouter').upgradeability,
      },
      {
        address: discovery.getContract('L1ERC20Gateway').address,
        name: 'L1ERC20Gateway',
        description:
          'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
        upgradeability: discovery.getContract('L1ERC20Gateway').upgradeability,
      },
      {
        address: EthereumAddress('0xcEe284F754E854890e311e3280b767F80797180d'),
        name: 'L1CustomGateway',
        description:
          'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
        upgradeability: {
          type: 'EIP1967 proxy',
          admin: EthereumAddress('0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa'),
          implementation: EthereumAddress(
            '0xC8D26aB9e132C79140b3376a0Ac7932E4680Aa45',
          ),
        },
      },
      {
        address: EthereumAddress('0xD3B5b60020504bc3489D6949d545893982BA3011'),
        name: 'L1DaiGateway',
        description:
          'Custom DAI Gateway, main entry point for users depositing DAI to L2 where "canonical" L2 DAI token managed by MakerDAO will be minted. Managed by MakerDAO.',
      },
      {
        address: EthereumAddress('0xA10c7CE4b876998858b1a9E12b10092229539400'),
        name: 'L1Escrow',
        description: 'DAI Vault for custom DAI Gateway managed by MakerDAO.',
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Arbitrum surpasses Ethereum in TPS',
      link: 'https://twitter.com/arbitrum/status/1628410398058708992',
      date: '2023-02-21T00:00:00Z',
      description:
        'For the first time ever, the daily average TPS of a rollup is higher than Ethereum.',
    },
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
  rating: {
    category: {
      score: 'B',
      requirements: ['There is an existing fraud proof system'],
    },
    modifier: {
      score: '-',
      items: ['Validators are behind a whitelist'],
    },
    thingsToImprove: {
      improvedScore: 'A',
      requirements: ['There should be no instant upgradeability'],
    },
  },
  knowledgeNuggets: [
    {
      title: 'Arbitrum update boosts decentralization',
      url: 'https://twitter.com/bkiepuszewski/status/1594754717330309120',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
    {
      title: 'Arbitrum is down... or is it?',
      url: 'https://twitter.com/bkiepuszewski/status/1438445910191710211',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_04,
    },
  ],
}
