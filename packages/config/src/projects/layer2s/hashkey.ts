import {
  type ContractParameters,
  get$Implementations,
} from '@l2beat/discovery-types'
import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { formatDelay } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../discovery/values/hardcoded'
import { Badge } from '../badges'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common'
import { getStage } from './common/stages/getStage'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('hashkey')

function safeGetImplementation(contract: ContractParameters): string {
  const implementation = get$Implementations(contract.values)[0]
  if (!implementation) {
    throw new Error(`No implementation found for ${contract.name}`)
  }
  return implementation.toString()
}

const maxClockDuration = discovery.getContractValue<number>(
  'PermissionedDisputeGame',
  'maxClockDuration',
)

const sequencerAddress = EthereumAddress(
  discovery.getContractValue('SystemConfig', 'batcherHash'),
)

const sequencerInbox = EthereumAddress(
  discovery.getContractValue('SystemConfig', 'sequencerInbox'),
)

const genesisTimestamp = new UnixTime(1734347135)

const disputeGameFactory = discovery.getContract('DisputeGameFactory')
const permissionedDisputeGame = discovery.getContract('PermissionedDisputeGame')

const FINALIZATION_PERIOD_SECONDS: number = discovery.getContractValue<number>(
  'OptimismPortal2',
  'proofMaturityDelaySeconds',
)

const disputeGameFinalityDelaySeconds = discovery.getContractValue<number>(
  'OptimismPortal2',
  'disputeGameFinalityDelaySeconds',
)

const proofMaturityDelaySeconds = discovery.getContractValue<number>(
  'OptimismPortal2',
  'proofMaturityDelaySeconds',
)

const portal = discovery.getContract('OptimismPortal2')

// >>> NOTE: THE VALUES BELOW ARE JUST FOR PERMISSIONED GAMES !!! UPDATE IF IT CHANGES
assert(
  discovery.getContractValue<number>('OptimismPortal2', 'respectedGameType') ===
    1,
)

const permissionedDisputeGameBonds = discovery.getContractValue<number[]>(
  'DisputeGameFactory',
  'initBonds',
)[1] // 1 is for permissioned games!

const permissionedGameClockExtension = discovery.getContractValue<number>(
  'PermissionedDisputeGame',
  'clockExtension',
)

const exponentialBondsFactor = 1.09493 // hardcoded, from https://specs.optimism.io/fault-proof/stage-one/bond-incentives.html?highlight=1.09493#bond-scaling

const permissionedGameMaxDepth = discovery.getContractValue<number>(
  'PermissionedDisputeGame',
  'maxGameDepth',
)

const permissionedGameSplitDepth = discovery.getContractValue<number>(
  'PermissionedDisputeGame',
  'splitDepth',
)

const permissionedGameFullCost = (() => {
  let cost = 0
  const scaleFactor = 100000
  for (let i = 0; i <= permissionedGameMaxDepth; i++) {
    cost =
      cost +
      (permissionedDisputeGameBonds / scaleFactor) * exponentialBondsFactor ** i
  }
  return BigNumber.from(cost).mul(BigNumber.from(scaleFactor))
})()

const oracleChallengePeriod = discovery.getContractValue<number>(
  'PreimageOracle',
  'challengePeriod',
)

const permissionedGameMaxClockExtension =
  permissionedGameClockExtension * 2 + // at SPLIT_DEPTH - 1
  oracleChallengePeriod + // at MAX_GAME_DEPTH - 1
  permissionedGameClockExtension * (permissionedGameMaxDepth - 3) // the rest, excluding also the last depth

export const hashkey: Layer2 = {
  type: 'layer2',
  id: ProjectId('hashkey'),
  addedAt: new UnixTime(1736518370), // 2025-01-10T17:09:00Z
  badges: [
    Badge.VM.EVM,
    Badge.DA.EthereumBlobs,
    Badge.Stack.OPStack,
    Badge.Infra.Superchain,
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'HashKey Chain',
    slug: 'hashkey',
    purposes: ['Exchange'],
    stack: 'OP Stack',
    description:
      "HashKey Chain is a regulatory-compliant, institutional-grade OP stack Layer 2 solution bridging traditional finance and Web3. It is powered by Hong Kong's premier virtual asset ecosystem.",
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://hsk.xyz/'],
      apps: ['https://bridge.hsk.xyz/'],
      documentation: ['https://docs.hsk.xyz/'],
      explorers: [
        'https://explorer.hsk.xyz/',
        'https://hashkey.blockscout.com',
      ],
      repositories: ['https://github.com/HashKeyChain'],
      socialMedia: [
        'https://x.com/HashKeyHSK',
        'https://t.me/hashkeyhsk',
        'https://discord.com/invite/ujaF7aKAEk',
      ],
    },
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets confirmed ${formatSeconds(
        maxClockDuration,
      )} after it has been posted.`,
    },
    finality: { finalizationPeriod: maxClockDuration },
  },
  config: {
    associatedTokens: ['HSK'],
    gasTokens: ['HSK'],
    escrows: [
      discovery.getEscrowDetails({
        // OptimismPortal
        address: EthereumAddress('0xe7Aa79B59CAc06F9706D896a047fEb9d3BDA8bD3'),
        tokens: ['HSK'],
      }),
      discovery.getEscrowDetails({
        // L1StandardBridge
        address: EthereumAddress('0x2171E6d3B7964fA9654Ce41dA8a8fFAff2Cc70be'),
        tokens: '*',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://mainnet.hsk.xyz',
      defaultCallsPerMinute: 1500,
      startBlock: 1,
      adjustCount: { type: 'SubtractOneSinceBlock', blockNumber: 1 },
    },
    finality: {
      type: 'OPStack',
      minTimestamp: new UnixTime(1734347135),
      genesisTimestamp: new UnixTime(1734347135),
      l2BlockTimeSeconds: 2,
      lag: 0,
      stateUpdate: 'disabled',
    },
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'transfer',
          from: sequencerAddress,
          to: sequencerInbox,
          sinceTimestamp: genesisTimestamp,
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: disputeGameFactory.address,
          selector: '0x82ecf2f6',
          functionSignature:
            'function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)',
          sinceTimestamp: genesisTimestamp,
        },
      },
    ],
  },
  dataAvailability: addSentimentToDataAvailability({
    layers: [DA_LAYERS.ETH_BLOBS_OR_CALLDATA],
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
  }),
  riskView: {
    stateValidation: (() => {
      assert(
        discovery.getContractValue<number>(
          'OptimismPortal2',
          'respectedGameType',
        ) === 1,
      )
      return {
        ...RISK_VIEW.STATE_FP_INT,
        description:
          RISK_VIEW.STATE_FP_INT.description +
          ` Only one entity is currently allowed to propose and submit challenges, as only permissioned games are currently allowed.`,
        sentiment: 'bad',
      }
    })(),
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, FINALIZATION_PERIOD_SECONDS),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      ),
      secondLine: formatDelay(HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS),
    },
    proposerFailure: (() => {
      assert(
        discovery.getContractValue<number>(
          'OptimismPortal2',
          'respectedGameType',
        ) === 1,
      )
      return RISK_VIEW.PROPOSER_CANNOT_WITHDRAW
    })(),
  },
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs ensure state correctness',
      description:
        'After some period of time, the published state root is assumed to be correct. For a certain time period, one of the whitelisted actors can submit a fraud proof that shows that the state was incorrect.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'no validator checks the published state. Fraud proofs assume at least one honest and able validator.',
        },
      ],
      references: [
        {
          title:
            'DisputeGameFactory.sol - Etherscan source code, create() function',
          url: `https://etherscan.io/address/${safeGetImplementation(
            disputeGameFactory,
          )}#code`,
        },
        {
          title:
            'PermissionedDisputeGame.sol - Etherscan source code, attack() function',
          url: `https://etherscan.io/address/${permissionedDisputeGame.address}#code`,
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      references: [
        {
          title: 'Derivation: Batch submission - OP Mainnet specs',
          url: 'https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/derivation.md#batch-submission',
        },
        {
          title: 'BatchInbox - Etherscan address',
          url: `https://etherscan.io/address/${sequencerInbox.toString()}`,
        },
        {
          title:
            'OptimismPortal.sol - Etherscan source code, depositTransaction function',
          url: `https://etherscan.io/address/${safeGetImplementation(
            portal,
          )}#code`,
        },
      ],
    },
    operator: OPERATOR.CENTRALIZED_SEQUENCER,
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
      references: [
        {
          title: 'Sequencing Window - OP Mainnet Specs',
          url: 'https://github.com/ethereum-optimism/optimism/blob/51eeb76efeb32b3df3e978f311188aa29f5e3e94/specs/glossary.md#sequencing-window',
        },
        {
          title:
            'OptimismPortal.sol - Etherscan source code, depositTransaction function',
          url: `https://etherscan.io/address/${safeGetImplementation(
            portal,
          )}#code`,
        },
      ],
    },
    exitMechanisms: [
      {
        name: 'Regular exits',
        description: `The user initiates the withdrawal by submitting a regular transaction on this chain. When a state root containing such transaction is settled, the funds become available for withdrawal on L1 after ${formatSeconds(
          disputeGameFinalityDelaySeconds,
        )}. Withdrawal inclusion can be proven before state root settlement, but a ${formatSeconds(
          proofMaturityDelaySeconds,
        )} period has to pass before it becomes actionable. The process of state root settlement takes a challenge period of at least ${formatSeconds(
          maxClockDuration,
        )} to complete. Finally the user submits an L1 transaction to claim the funds. This transaction requires a merkle proof.`,
        risks: [],
        references: [
          {
            title:
              'OptimismPortal.sol - Etherscan source code, proveWithdrawalTransaction function',
            url: `https://etherscan.io/address/${safeGetImplementation(
              portal,
            )}#code`,
          },
          {
            title:
              'OptimismPortal.sol - Etherscan source code, finalizeWithdrawalTransaction function',
            url: `https://etherscan.io/address/${safeGetImplementation(
              portal,
            )}#code`,
          },
        ],
      },
      {
        ...EXITS.FORCED('all-withdrawals'),
        references: [
          {
            title: 'Forced withdrawal from an OP Stack blockchain',
            url: 'https://stack.optimism.io/docs/security/forced-withdrawal/',
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
  stateValidation: {
    // NOTE THAT DESCRIPTIONS ARE SLIGHTLY MODIFIED BECAUSE PERMISSIONED
    description:
      'Currently, updates to the system state can only be proposed and challenged by the same entity as the proof system is permissioned. If a state root passes the challenge period, it is optimistically considered correct and made actionable for withdrawals.',
    categories: [
      {
        title: 'State root proposals',
        description: `Proposers submit state roots as children of the latest confirmed state root (called anchor state), by calling the \`create\` function in the DisputeGameFactory. A state root can have multiple conflicting children. Each proposal requires a stake, currently set to ${formatEther(
          permissionedDisputeGameBonds,
        )} ETH, that can be slashed if the proposal is proven incorrect via a fraud proof. Stakes can be withdrawn only after the proposal has been confirmed. A state root gets confirmed if the challenge period has passed and it is not countered.`,
        references: [
          {
            title: 'OP stack specification: Fault Dispute Game',
            url: 'https://specs.optimism.io/fault-proof/stage-one/fault-dispute-game.html#fault-dispute-game',
          },
        ],
      },
      {
        title: 'Challenges',
        description: `Challenges are opened to disprove invalid state roots using bisection games. Each bisection move requires a stake that increases expontentially with the depth of the bisection, with a factor of ${exponentialBondsFactor}. The maximum depth is ${permissionedGameMaxDepth}, and reaching it therefore requires a cumulative stake of ${parseFloat(
          formatEther(permissionedGameFullCost),
        ).toFixed(
          2,
        )} ETH from depth 0. Actors can participate in any challenge by calling the \`defend\` or \`attack\` functions, depending whether they agree or disagree with the latest claim and want to move the bisection game forward. Actors that disagree with the top-level claim are called challengers, and actors that agree are called defenders. Each actor might be involved in multiple (sub-)challenges at the same time, meaning that the protocol operates with [full concurrency](https://medium.com/l2beat/fraud-proof-wars-b0cb4d0f452a). Challengers and defenders alternate in the bisection game, and they pass each other a clock that starts with ${formatSeconds(
          maxClockDuration,
        )}. If a clock expires, the claim is considered defeated if it was countered, or it gets confirmed if uncountered. Since honest parties can inherit clocks from malicious parties that play both as challengers and defenders (see [freeloader claims](https://specs.optimism.io/fault-proof/stage-one/fault-dispute-game.html#freeloader-claims)), if a clock gets inherited with less than ${formatSeconds(
          permissionedGameClockExtension,
        )}, it generally gets extended by ${formatSeconds(
          permissionedGameClockExtension,
        )} with the exception of ${formatSeconds(
          permissionedGameClockExtension * 2,
        )} right before depth ${permissionedGameSplitDepth}, and ${formatSeconds(
          oracleChallengePeriod,
        )} right before the last depth. The maximum clock extension that a top level claim can get is therefore ${formatSeconds(
          permissionedGameMaxClockExtension,
        )}. Since unconfirmed state roots are independent of one another, users can decide to exit with a subsequent confirmed state root if the previous one is delayed. Winners get the entire losers' stake, meaning that sybils can potentially play against each other at no cost. The final instruction found via the bisection game is then executed onchain in the MIPS one step prover contract who determines the winner. The protocol does not enforce valid bisections, meaning that actors can propose correct initial claims and then provide incorrect midpoints. The protocol can be subject to resource exhaustion attacks ([Spearbit 5.1.3](https://github.com/ethereum-optimism/optimism/blob/develop/docs/security-reviews/2024_08_report-cb-fault-proofs-non-mips.pdf)).`,
        references: [
          {
            title: 'Fraud Proof Wars: OPFP',
            url: 'https://medium.com/l2beat/fraud-proof-wars-b0cb4d0f452a',
          },
        ],
      },
    ],
  },
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: 'UnderReview',
    },
    stage1: {
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: false,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: false,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: false,
      delayWith30DExitWindow: false,
    },
  }),
  milestones: [],
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: discovery.getDiscoveredContracts(),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'a contract receives a malicious code upgrade. There is no delay on upgrades.',
      },
    ],
  },
}
