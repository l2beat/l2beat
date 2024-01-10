import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { VALUES } from '../discovery/values'
import { formatSeconds } from '../utils/formatSeconds'
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
  subtractOneAfterBlockInclusive,
} from './common'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { getStage } from './common/stages/getStage'
import { UPGRADE_MECHANISM } from './common/upgradeMechanism'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('parallel')
const assumedBlockTime = 12 // seconds, different from RollupUserLogic.sol#L35 which assumes 13.2 seconds
const validatorAfkBlocks = discovery.getContractValue<number>(
  'RollupProxy',
  'VALIDATOR_AFK_BLOCKS',
) // 45818
const validatorAfkTime = validatorAfkBlocks * assumedBlockTime
const challengeWindow = discovery.getContractValue<number>(
  'RollupProxy',
  'confirmPeriodBlocks',
) // 43200

const challengeWindowSeconds = challengeWindow * assumedBlockTime
const totalDelay = challengeWindowSeconds

// const totalDelayString = formatSeconds(totalDelay)

const upgradesExecutor = {
  upgradableBy: ['UpgradeExecutorAdmin'],
  upgradeDelay: `${formatSeconds(
    totalDelay,
  )} or 0 if overridden by Security Council`,
  upgradeConsiderations:
    'An upgrade initiated by the DAO can be vetoed by the Security Council.',
}

const upgradesProxyAdmin = {
  upgradableBy: ['ArbitrumProxyAdmin'],
  upgradeDelay: `${formatSeconds(
    totalDelay,
  )} or 0 if overridden by Security Council`,
  upgradeConsiderations:
    'An upgrade initiated by the DAO can be vetoed by the Security Council.',
}

const upgradesGatewaysAdmin = {
  upgradableBy: ['GatewaysAdmin'],
  upgradeDelay: `${formatSeconds(
    totalDelay,
  )} or 0 if overridden by Security Council`,
  upgradeConsiderations:
    'An upgrade initiated by the DAO can be vetoed by the Security Council.',
}

const maxTimeVariation = discovery.getContractValue<number[]>(
  'SequencerInbox',
  'maxTimeVariation',
)
const selfSequencingDelay = maxTimeVariation[2]

const TOKENS: Omit<Token, 'chainId'>[] = []

export const arbitrum: Layer2 = {
  type: 'layer2',
  id: ProjectId('parallel'),
  display: {
    name: 'Parallel Finance',
    slug: 'parallel',
    warning:
      'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
    description: `Parallel is an Optimistic Rollup that aims to feel exactly like interacting with Ethereum, but with transactions costing a fraction of what they do on L1.\
      Centralized Sequencer receives users' transactions and regularly sends the transaction batch to mainnet Ethereum. Independent Proposers (currently whitelisted)\
      read transaction batches from L1, execute them and submit a resulting L2 state root to L1. Any Validator (currently whitelisted) can challenge the state root within the challenge window (${formatSeconds(
        challengeWindow * assumedBlockTime,
      )}). \
      The challenge will result in an interactive fraud proof game that will be eventually settled by L1. As long as there is at least one honest Validator, users are guaranteed that\
      eventually correct L2 state root will be published to L1. If Sequencer is censoring users transactions, it is possible to force the transaction via L1 queue. If no Proposer publishes\
    L2 state root within ${formatSeconds(
      validatorAfkTime,
    )} (${validatorAfkBlocks} blocks), the whitelist is dropped and anyone can take over as a new Proposer or Validator.`,
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'Arbitrum',
    links: {
      websites: ['https://parallel.fi'],
      apps: [],
      documentation: ['https://docs.parallel.fi'],
      explorers: ['https://explorer.parallel.fi'],
      repositories: [
        'https://github.com/ArbitrumFoundation/docs',
        'https://github.com/ArbitrumFoundation/governance',
        'https://github.com/OffchainLabs/arbitrum',
        'https://github.com/OffchainLabs/nitro',
        'https://github.com/OffchainLabs/arb-os',
      ],
      socialMedia: [
        'https://twitter.com/ParallelFi',
        'https://t.me/parallelfi_community',
        'https://discord.gg/rdjVz8zavF',
      ],
      rollupCodes: 'https://rollup.codes/arbitrum-one',
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Parallelis an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted on L1. Forced txs can be delayed up to ${formatSeconds(
        selfSequencingDelay,
      )}. The state root gets finalized ${formatSeconds(
        challengeWindow * assumedBlockTime,
      )} after it has been posted.`,
    },
  },
  config: {
    tokenList: TOKENS.map((t) => ({ ...t, chainId: ChainId.PARALLEL })),
    associatedTokens: ['PARA'],
    nativeL2TokensIncludedInTVL: ['PARA'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x5a961c7D162195a9Dc5a357Cc168b0694283382E'),
        tokens: ['ETH'],
        description:
          'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
        ...upgradesProxyAdmin,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xa1c86E2362dba0525075622af6d5f739B1304D45'),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
        ...upgradesGatewaysAdmin,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d'),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
        ...upgradesGatewaysAdmin,
      }),
    ],
    transactionApi: {
      type: 'rpc',
      url: 'https://rpc.parallel.fi',
      assessCount: subtractOne,
      startBlock: 1,
    },
    liveness: {
      proofSubmissions: [],
      batchSubmissions: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xb4795A0edae98d7820C37F06f6b858e7acb51DF8',
          ),
          selector: '0x8f111f3c',
          functionSignature:
            'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
          sinceTimestamp: new UnixTime(1704057743),
        },
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xb4795A0edae98d7820C37F06f6b858e7acb51DF8',
          ),
          selector: '0x6f12b0c9',
          functionSignature:
            'function addSequencerL2BatchFromOrigin(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder)',
          sinceTimestamp: new UnixTime(1704057743),
        },
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xb4795A0edae98d7820C37F06f6b858e7acb51DF8',
          ),
          selector: '0xe0bc9729',
          functionSignature:
            'function addSequencerL2Batch(uint256 sequenceNumber,bytes calldata data,uint256 afterDelayedMessagesRead,address gasRefunder,uint256 prevMessageCount,uint256 newMessageCount)',
          sinceTimestamp: new UnixTime(1704057743),
        },
      ],
      stateUpdates: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xB6e0586616ebE79b2F86dDB32048c500D23b3AC3',
          ),
          selector: '0xa04cee60',
          functionSignature:
            'function updateSendRoot(bytes32 root, bytes32 l2BlockHash) external',
          sinceTimestamp: new UnixTime(1704057743),
        },
      ],
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      value: 'Fraud proofs (INT)',
      description:
        'Fraud proofs allow WHITELISTED actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve. The challenge protocol can be subject to delay attacks.',
      sentiment: 'warning',
      sources: [
        {
          contract: 'ChallengeManager',
          references: [
            'https://etherscan.io/address/0xEe9E5546A11Cb5b4A86e92DA05f2ef75C26E4754#code#F6#L113',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'SequencerInbox',
          references: [
            'https://etherscan.io/address/0x873484ba63353c8b71210ce123b465512d408b27#code#F8#L195',
          ],
        },
      ],
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelay, 0),
      sentiment: 'bad',
      description: `Upgrades are initiated on L2 and have to go first through a ${formatSeconds(
        l2TimelockDelay,
      )} delay. Since there is a ${formatSeconds(
        selfSequencingDelay,
      )} to force a tx, users have only ${formatSeconds(
        l2TimelockDelay - selfSequencingDelay,
      )} to exit. If users post a tx after that time, they would need to self propose a root with a ${formatSeconds(
        validatorAfkTime,
      )} delay and then wait for the ${formatSeconds(
        challengeWindowSeconds,
      )} challenge window, while the upgrade would be confirmed just after the ${formatSeconds(
        challengeWindowSeconds,
      )} challenge window.`,
      sources: [
        {
          contract: 'OutboxV2',
          references: [
            'https://etherscan.io/address/0x2a6dd4433ffa96dc1755814fc0d9cc83a5f68dec#code',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(selfSequencingDelay),
      sources: [
        {
          contract: 'SequencerInbox',
          references: [
            'https://etherscan.io/address/0x873484ba63353c8b71210ce123b465512d408b27#code#F8#L147',
            'https://developer.arbitrum.io/sequencer',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(
        validatorAfkBlocks * assumedBlockTime,
      ),
      sources: [
        {
          contract: 'RollupProxy',
          references: [
            'https://etherscan.io/address/0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff#code#F1#L55', // TODO!!!!
          ],
        },
      ],
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  }),
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs ensure state correctness',
      description:
        'After some period of time, the published state root is assumed to be correct. For a certain time period, one of the whitelisted actors can submit a fraud proof that shows that the state was incorrect. The challenge protocol can be subject to delay attacks.',
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
          text: 'Arbitrum Glossary: Challenge Period',
          href: 'https://developer.arbitrum.io/intro/glossary#challenge-period',
        },
        {
          text: 'RollupUser.sol#L288 - Etherscan source code, onlyValidator modifier',
          href: 'https://etherscan.io/address/0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff#code#F1#L288', // TODO!!!
        },
        {
          text: 'Solutions to Delay Attacks on Rollups',
          href: 'https://medium.com/offchainlabs/solutions-to-delay-attacks-on-rollups-434f9d05a07a',
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
        {
          text: 'SequencerInbox.sol#206 - Etherscan source code, addSequencerL2BatchFromOrigin function',
          href: 'https://etherscan.io/address/0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9#code#F1#L206', // TODO!!!
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
      description:
        FORCE_TRANSACTIONS.CANONICAL_ORDERING.description +
        ' ' +
        VALUES.ARBITRUM.getProposerFailureString(validatorAfkBlocks),
      references: [
        {
          text: 'SequencerInbox.sol#L125 - Etherscan source code, forceInclusion function',
          href: 'https://etherscan.io/address/0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9#code#F1#L125',
        },
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
      EXITS.AUTONOMOUS,
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
    upgradeMechanism: UPGRADE_MECHANISM.ARBITRUM_DAO(
      l1TimelockDelay,
      challengeWindow * assumedBlockTime,
      l2TimelockDelay,
    ),
  },
  stateDerivation: {
    nodeSoftware: `The rollup node (Arbitrum Nitro) consists of three parts. The base layer is the core Geth server (with minor modifications to add hooks) that emulates the execution of EVM contracts and maintains Ethereum's state. The middle layer, ArbOS, provides additional Layer 2 functionalities such as decompressing data batches, accounting for Layer 1 gas costs, and supporting cross-chain bridge functionalities. The top layer consists of node software, primarily from Geth, that handles client connections (i.e., regular RPC node). [View Code](https://github.com/OffchainLabs/nitro/)`,
    compressionScheme: `The Sequencer's batches are compressed using a general-purpose data compression algorithm known as [Brotli](https://github.com/google/brotli), configured to its highest compression setting.`,
    genesisState:
      'They performed a regenesis from Classic to Nitro, and that file represents the [last Classic state](https://snapshot.arbitrum.foundation/arb1/nitro-genesis.tar). To sync from the initial Classic state, instructions can be found [here](https://docs.arbitrum.io/migration/state-migration).',
    dataFormat: `Nitro supports Ethereum's data structures and formats by incorporating the core code of the popular go-ethereum ("Geth") Ethereum node software. The batch is composed of a header and a compressed blob, which results from compressing concatenated RLP-encoded transactions using the standard RLP encoding.`,
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'SecurityCouncil',
      'The admin of all contracts in the system, capable of issuing upgrades without notice and delay. This allows it to censor transactions, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer or any other system component (unlimited upgrade power). It is also the admin of the special purpose smart contracts used by validators.',
      [
        {
          text: 'Security Council members - Arbitrum DAO Governance Docs',
          href: 'https://docs.arbitrum.foundation/foundational-documents/transparency-report-initial-foundation-setup',
        },
      ],
    ),
    discovery.contractAsPermissioned(
      discovery.getContract('ArbitrumProxyAdmin'),
      'This contract is an admin of SequencerInbox, RollupEventInbox, Bridge, Outbox, Inbox and ChallengeManager contracts. It is owned by the Upgrade Executor.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContractFromUpgradeability('UpgradeExecutor', 'admin'),
      "This contract is an admin of the UpgradeExecutor contract, but is also owned by it. Can cancel Timelock's proposals.",
    ),
    discovery.contractAsPermissioned(
      discovery.getContractFromUpgradeability('L1GatewayRouter', 'admin'),
      'This is yet another proxy admin for the three gateway contracts. It is owned by the Upgrade Executor.',
    ),
    {
      name: 'Sequencer',
      accounts: VALUES.ARBITRUM.SEQUENCER,
      description:
        'Central actor allowed to set the order in which L2 transactions are executed.',
    },
    {
      name: 'Validators/Proposers',
      accounts: VALUES.ARBITRUM.VALIDATORS,
      description:
        'They can submit new state roots and challenge state roots. Some of the operators perform their duties through special purpose smart contracts.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('RollupProxy', {
        description:
          'Main contract implementing Arbitrum One Rollup. Manages other Rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.',
        ...upgradesExecutor,
      }),
      discovery.getContractDetails('ArbitrumOneBridge', {
        description:
          'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
        ...upgradesProxyAdmin,
      }),
      discovery.getContractDetails('SequencerInbox', {
        description:
          'Main entry point for the Sequencer submitting transaction batches to a Rollup.',
        ...upgradesProxyAdmin,
      }),
      discovery.getContractDetails('Inbox', {
        description:
          'Entry point for users depositing ETH and sending L1 --> L2 messages. Deposited ETH is escrowed in a Bridge contract.',
        ...upgradesProxyAdmin,
      }),
      discovery.getContractFromValue('RollupProxy', 'outbox', {
        description:
          "Arbitrum's Outbox system allows for arbitrary L2 to L1 contract calls; i.e., messages initiated from L2 which eventually resolve in execution on L1.",
        ...upgradesProxyAdmin,
      }),
      discovery.getContractDetails('UpgradeExecutor', {
        description:
          "This contract can upgrade the system's contracts. The upgrades can be done either by the Security Council or by the L1ArbitrumTimelock.",
        ...upgradesExecutor,
      }),
      discovery.getContractDetails('L1ArbitrumTimelock', {
        description:
          'Timelock contract for Arbitrum DAO Governance. It gives the DAO participants the ability to upgrade the system. Only the L2 counterpart of this contract can execute the upgrades.',
        ...upgradesExecutor,
      }),
      discovery.getContractDetails('L1GatewayRouter', {
        description: 'Router managing token <--> gateway mapping.',
        ...upgradesGatewaysAdmin,
      }),
    ],
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_RISK_WITH_SC(
        Math.round(totalDelay / 86400).toString(), // delay in days
      ),
    ],
  },
  milestones: [
    {
      ...MILESTONES.MAINNET_OPEN,
      link: 'https://twitter.com/arbitrum/status/1432817424752128008',
      date: '2021-08-31T00:00:00Z',
    },
  ],
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: true,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: true,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: false,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/OffchainLabs/nitro/',
    },
  ),
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
