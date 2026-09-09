import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { formatDelay } from '../../common/formatDelays'
import { getRollupStage } from '../../common/stages/getRollupStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../discovery/values/hardcoded'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { describeOPFP } from '../../templates/opStack'
import {
  explorerReferences,
  safeGetImplementation,
} from '../../templates/utils'
import { readMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('zircuit')

// Migrated 2026-08-04 from a custom validity-proof + escape-hatch fork
// (L2OutputOracle/SP1 verifiers/ResolverRegistry, all now deleted) onto a
// standard OP-stack PermissionedDisputeGame deployment, operated via Conduit.
// See diffHistory.md for the migration analysis.
const ZIRCUIT_CHALLENGE_PERIOD_SECONDS: number =
  discovery.getContractValue<number>(
    'PermissionedDisputeGame',
    'maxClockDuration',
  )
const ZIRCUIT_EXECUTION_DELAY_SECONDS: number =
  discovery.getContractValue<number>(
    'OptimismPortal2',
    'disputeGameFinalityDelaySeconds',
  )
const ZIRCUIT_PROOF_MATURITY_DELAY_SECONDS: number =
  discovery.getContractValue<number>(
    'OptimismPortal2',
    'proofMaturityDelaySeconds',
  )
const ZIRCUIT_PERMISSIONED_GAME_BOND: number =
  discovery.getContractValueOrUndefined<number>(
    'DisputeGameFactory',
    'initBondGame1',
  ) ??
  discovery.getContractValue<number[]>('DisputeGameFactory', 'initBonds')[1]

const sequencerAddress = ChainSpecificAddress(
  discovery.getContractValue('SystemConfig', 'batcherHash'),
)
const sequencerInbox = discovery.getContractValue<ChainSpecificAddress>(
  'SystemConfig',
  'sequencerInbox',
)
const inboxStartBlock =
  discovery.getContractValueOrUndefined<number>('SystemConfig', 'startBlock') ??
  0
const sequencer = discovery.getContractValue<ChainSpecificAddress>(
  'SystemConfig',
  'batcherHash',
)
// Batcher rotated as part of the Conduit migration. Boundary block is the new
// batcher's first batch tx (old batcher's last batch tx was block 25681834).
const OLD_BATCHER = ChainSpecificAddress(
  'eth:0xAF1E4f6a47af647F87C0Ec814d8032C4a4bFF145',
)
const BATCHER_ROTATION_BLOCK = 25682284
const BATCHER_ROTATION_TIMESTAMP = UnixTime(1785855323)
const portal = discovery.getContract('OptimismPortal2')
const explorerUrl = 'https://explorer.zircuit.com'

const genesisTimestamp = UnixTime(1719936217)
// respectedGameTypeUpdatedAt on OptimismPortal2 - the moment the fault-proof
// system (PermissionedDisputeGame) became the respected withdrawal path.
const FAULT_PROOF_CUTOVER_TIMESTAMP = UnixTime(1785852695)

export const zircuit: ScalingProject = {
  id: ProjectId('zircuit'),
  addedAt: UnixTime(1712559704), // 2024-04-08T07:01:44Z
  badges: [
    BADGES.VM.EVM,
    BADGES.DA.EthereumBlobs,
    BADGES.Stack.OPStack,
    BADGES.RaaS.Conduit,
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  capability: 'universal',
  type: 'layer2',
  display: {
    name: 'Zircuit',
    warning:
      'The fault proof system is deployed but is not functional. The chain ID is not included in the superchain registry snapshot embedded in the op-program release that the dispute games commit to, causing the dispute game to panic during execution. Security relies entirely on the permissioned proposer and challengers.',
    slug: 'zircuit',
    purposes: ['Universal'],
    stacks: ['OP Stack'],
    description:
      'Zircuit is a universal rollup. It is based on the Optimism Bedrock architecture, employing AI to identify and stop malicious transactions at the sequencer level.',
    links: {
      websites: ['https://zircuit.com/'],
      bridges: ['https://bridge.zircuit.com/', 'https://app.zircuit.com/'],
      documentation: ['https://docs.zircuit.com/'],
      explorers: ['https://explorer.zircuit.com/'],
      repositories: ['https://github.com/zircuit-labs'],
      socialMedia: [
        'https://x.com/ZircuitL2',
        'https://discord.com/invite/zircuit',
        'https://zircuit.com/blog',
        'https://t.me/zircuitl2_bot',
      ],
      other: ['https://rollup.codes/zircuit'],
    },
    architectureImage: 'zircuit',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Zircuit is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. Once a dispute game is created for a proposed state root, it must go unchallenged for a challenge period of ${formatSeconds(
        ZIRCUIT_CHALLENGE_PERIOD_SECONDS,
      )} to resolve. After it resolves, a further dispute game finality delay of ${formatSeconds(
        ZIRCUIT_EXECUTION_DELAY_SECONDS,
      )} applies before the state root is considered settled.`,
    },
  },
  stage: getRollupStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: false,
      },
      stage1: {
        principle: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: false,
        noRedTrustedSetups: null,
        programHashesReproducible: null,
        proverSourcePublished: null,
        verifierContractsReproducible: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: false,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/zircuit-labs/l2-geth-public',
    },
  ),
  proofSystem: undefined,
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_FP_INT(
        ZIRCUIT_CHALLENGE_PERIOD_SECONDS,
        ZIRCUIT_EXECUTION_DELAY_SECONDS,
      ),
      description:
        RISK_VIEW.STATE_FP_INT().description +
        ' Only one entity is currently allowed to propose and submit challenges, as only permissioned games are currently allowed.',
      sentiment: 'bad',
      initialBond: {
        value: formatEther(ZIRCUIT_PERMISSIONED_GAME_BOND),
      },
      permissioned: true,
      defenderAdvantage: 'not-applicable',
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    sequencerFailure: {
      // the value is inside the node config, but we have no reference to it
      // so we assume it to be the same value as in other op stack chains
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      ),
      secondLine: formatDelay(HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS),
    },
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stateValidation: describeOPFP({
    disputeGameBonds: ZIRCUIT_PERMISSIONED_GAME_BOND,
    maxClockDuration: ZIRCUIT_CHALLENGE_PERIOD_SECONDS,
    gameMaxDepth: discovery.getContractValue<number>(
      'PermissionedDisputeGame',
      'maxGameDepth',
    ),
    gameSplitDepth: discovery.getContractValue<number>(
      'PermissionedDisputeGame',
      'splitDepth',
    ),
    gameClockExtension: discovery.getContractValue<number>(
      'PermissionedDisputeGame',
      'clockExtension',
    ),
    oracleChallengePeriod: discovery.getContractValue<number>(
      'PreimageOracle',
      'challengePeriod',
    ),
    isPermissionless: false,
  }),
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
  },
  config: {
    associatedTokens: ['ZRC'],
    activityConfig: {
      // zircuit does not have a system transaction in every block but in every 5th/6th, so we do not subtract those and overcount
      type: 'block',
      startBlock: 1,
    },
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: inboxStartBlock,
        untilBlock: BATCHER_ROTATION_BLOCK,
        inbox: ChainSpecificAddress.address(sequencerInbox),
        sequencers: [ChainSpecificAddress.address(OLD_BATCHER)],
      },
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: BATCHER_ROTATION_BLOCK,
        inbox: ChainSpecificAddress.address(sequencerInbox),
        sequencers: [ChainSpecificAddress.address(sequencer)],
      },
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x92Ef6Af472b39F1b363da45E35530c24619245A4',
          ),
          selector: '0xa9efd6b8',
          functionSignature:
            'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber, bytes _proof)',
          sinceTimestamp: UnixTime(1720137600),
          untilTimestamp: UnixTime(1741654919),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'transfer',
          from: ChainSpecificAddress.address(OLD_BATCHER),
          to: ChainSpecificAddress.address(sequencerInbox),
          sinceTimestamp: genesisTimestamp,
          untilTimestamp: BATCHER_ROTATION_TIMESTAMP,
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'transfer',
          from: ChainSpecificAddress.address(sequencerAddress),
          to: ChainSpecificAddress.address(sequencerInbox),
          sinceTimestamp: BATCHER_ROTATION_TIMESTAMP,
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
          { type: 'liveness', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x92Ef6Af472b39F1b363da45E35530c24619245A4',
          ),
          selector: '0x1bf75d29',
          functionSignature:
            'function proposeL2OutputV2(uint256 _batchIndex, bytes32 _batchHash, bytes32 _poseidonPostStateRoot, bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber, bytes _aggrProof) payable',
          sinceTimestamp: UnixTime(1741654919),
          untilTimestamp: UnixTime(1756148051),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
          { type: 'liveness', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x92Ef6Af472b39F1b363da45E35530c24619245A4',
          ),
          selector: '0x76340d0a',
          functionSignature:
            'function proposeL2OutputV3(bytes32 _outputRoot, uint256 _l2BlockNumber, uint256 _l1BlockNumber, bytes _proof, address _proverAddress) payable',
          sinceTimestamp: UnixTime(1756148051),
          untilTimestamp: UnixTime(1764017747),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
          { type: 'liveness', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x92Ef6Af472b39F1b363da45E35530c24619245A4',
          ),
          selector: '0x2685d148',
          functionSignature:
            'function proposeL2OutputV3(bytes32 _outputRoot, uint64 _claimNonce, address _claimSenderAddress, uint256 _l2BlockNumber, uint256 _l1BlockNumber, bytes _proof, address _proverAddress) payable',
          sinceTimestamp: UnixTime(1764017747),
          untilTimestamp: FAULT_PROOF_CUTOVER_TIMESTAMP,
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
          { type: 'liveness', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: ChainSpecificAddress.address(
            discovery.getContract('DisputeGameFactory').address,
          ),
          selector: '0x82ecf2f6',
          functionSignature:
            'function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)',
          sinceTimestamp: FAULT_PROOF_CUTOVER_TIMESTAMP,
        },
      },
    ],
    escrows: [
      // non-template escrows
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x912C7271a6A3622dfb8B218eb46a6122aB046C79',
        ),
        tokens: ['wstETH'],
        description:
          'custom wstETH Vault controlled by Lido governance, using the canonical bridge for messaging.',
      }),
      // template escrows
      discovery.getEscrowDetails({
        includeInTotal: true,
        address: portal.address,
        tokens: ['ETH'],
        premintedTokens: [],
        description: 'Main entry point for users depositing ETH.',
        upgradableBy: [{ name: 'ProxyAdmin', delay: 'no' }],
      }),
      discovery.getEscrowDetails({
        includeInTotal: true,
        address: discovery.getContract('L1StandardBridge').address,
        tokens: '*',
        premintedTokens: ['ZRC'],
        excludedTokens: ['rswETH', 'rsETH'],
        description:
          'Main entry point for users depositing ERC20 token that do not require custom gateway.',
        upgradableBy: [{ name: 'ProxyAdmin', delay: 'no' }],
      }),
    ],
  },
  chainConfig: {
    name: 'zircuit',
    chainId: 48900,
    gasTokens: ['ETH'],
    coingeckoPlatform: 'zircuit',
    sinceTimestamp: UnixTime(1719936217),
    apis: [
      {
        type: 'rpc',
        url: 'https://zircuit.rpc.sentio.xyz',
        callsPerMinute: 3000,
      },
      {
        type: 'sourcify',
        chainId: 48900,
      },
    ],
    explorerUrl,
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      references: [
        {
          title: 'Derivation: Batch submission - OP Mainnet specs',
          url: 'https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/derivation.md#batch-submission',
        },
        ...explorerReferences(explorerUrl, [
          {
            title: 'BatchInbox - address',
            address: ChainSpecificAddress.address(sequencerInbox),
          },
          {
            title: `${portal.name}.sol - source code, depositTransaction function`,
            address: safeGetImplementation(portal),
          },
        ]),
      ],
    },
    operator: OPERATOR.CENTRALIZED_OPERATOR,
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
      references: [
        {
          title: 'Sequencing Window - OP Mainnet Specs',
          url: 'https://github.com/ethereum-optimism/optimism/blob/51eeb76efeb32b3df3e978f311188aa29f5e3e94/specs/glossary.md#sequencing-window',
        },
        ...explorerReferences(explorerUrl, [
          {
            title: `${portal.name}.sol - source code, depositTransaction function`,
            address: safeGetImplementation(portal),
          },
        ]),
      ],
    },
    exitMechanisms: [
      {
        name: 'Regular exits',
        description: readMarkdown('templates/opStack/regularExits.md', {
          disputeGameFinalityDelaySeconds: formatSeconds(
            ZIRCUIT_EXECUTION_DELAY_SECONDS,
          ),
          proofMaturityDelaySeconds: formatSeconds(
            ZIRCUIT_PROOF_MATURITY_DELAY_SECONDS,
          ),
          challengePeriod: formatSeconds(ZIRCUIT_CHALLENGE_PERIOD_SECONDS),
        }),
        risks: [],
        references: [
          {
            title: `${portal.name}.sol - Etherscan source code, proveWithdrawalTransaction function`,
            url: `https://etherscan.io/address/${safeGetImplementation(portal)}#code`,
          },
          {
            title: `${portal.name}.sol - Etherscan source code, finalizeWithdrawalTransaction function`,
            url: `https://etherscan.io/address/${safeGetImplementation(portal)}#code`,
          },
        ],
      },
      {
        ...EXITS.FORCED_MESSAGING('all-messages'),
        references: [
          {
            title: 'Forced withdrawal from an OP Stack blockchain',
            url: 'https://docs.optimism.io/stack/transactions/forced-transaction',
          },
        ],
      },
    ],
    otherConsiderations: [
      {
        name: 'EVM compatible smart contracts are supported',
        description:
          'OP stack chains are pursuing the EVM Equivalence model. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on L2.',
        risks: [],
        references: [
          {
            title: 'Introducing EVM Equivalence',
            url: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
          },
        ],
      },
    ],
  },
  milestones: [
    {
      title: 'Migrated to Conduit fault proofs',
      url: 'https://www.conduit.xyz',
      date: '2026-08-04T00:00:00.00Z',
      description:
        'Zircuit migrates to a standard OP Stack PermissionedDisputeGame deployment via Conduit.',
      type: 'general',
    },
    {
      title: 'Proof system migrated to SP1',
      url: 'https://zircuit.com/blog',
      date: '2025-08-25T00:00:00.00Z',
      description:
        'Zircuit deprecates its in-house proof system in favor of SP1.',
      type: 'general',
    },
    {
      title: 'Escape mechanism',
      url: 'https://www.zircuit.com/blog/mainnet-phase-1-is-live',
      date: '2025-08-05T00:00:00.00Z',
      description: 'Zircuit introduces a custom escape mechanism.',
      type: 'general',
    },
    {
      title: 'Mainnet Launch',
      url: 'https://www.zircuit.com/blog/mainnet-phase-1-is-live',
      date: '2024-08-05T00:00:00.00Z',
      description: 'Zircuit is live on mainnet.',
      type: 'general',
    },
  ],
}
