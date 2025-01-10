import {
  ContractParameters,
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
import { subtractOneAfterBlockInclusive } from '../../common/assessCount'
import { formatDelay } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../discovery/values/hardcoded'
import { Badge } from '../badges'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('ink')

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

const genesisTimestamp = new UnixTime(1733498411)

const disputeGameFactory = discovery.getContract('DisputeGameFactory')

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

export const ink: Layer2 = {
  type: 'layer2',
  id: ProjectId('ink'),
  createdAt: new UnixTime(1729797861), // 2024-10-24T21:24:21Z
  badges: [
    Badge.VM.EVM,
    Badge.DA.EthereumBlobs,
    Badge.Stack.OPStack,
    Badge.Infra.Superchain,
    Badge.RaaS.Gelato,
  ],
  display: {
    name: 'Ink',
    slug: 'ink',
    description:
      'Ink is an Optimistic Rollup built with the OP Stack by Kraken exchange.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://inkonchain.com/en-US'],
      apps: [],
      documentation: [],
      explorers: [
        'https://explorer.inkonchain.com',
        'https://okx.com/en-au/web3/explorer/inkchain',
      ],
      repositories: ['https://github.com/inkonchain'],
      socialMedia: [
        'https://x.com/inkonchain',
        'https://discord.com/invite/inkonchain',
        'https://t.me/inkonchain',
      ],
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Ink is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets confirmed ${formatSeconds(
        maxClockDuration,
      )} after it has been posted.`,
    },
    finality: { finalizationPeriod: maxClockDuration },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        // OptimismPortal
        address: EthereumAddress('0x5d66C1782664115999C47c9fA5cd031f495D3e4F'),
        tokens: ['ETH'],
      }),
      discovery.getEscrowDetails({
        // L1StandardBridge
        address: EthereumAddress('0x88FF1e5b602916615391F55854588EFcBB7663f0'),
        tokens: '*',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://rpc-gel.inkonchain.com',
      defaultCallsPerMinute: 2000,
      startBlock: 1,
      assessCount: subtractOneAfterBlockInclusive(1),
    },
    finality: {
      type: 'OPStack',
      minTimestamp: new UnixTime(1733502012),
      genesisTimestamp: new UnixTime(1733498411),
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
  dataAvailability: [
    addSentimentToDataAvailability({
      layers: [DA_LAYERS.ETH_BLOBS_OR_CALLDATA],
      bridge: DA_BRIDGES.ENSHRINED,
      mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
    }),
  ],
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
          text: 'DisputeGameFactory.sol - Etherscan source code, create() function',
          href: 'https://etherscan.io/address/0x10d7B35078d3baabB96Dd45a9143B94be65b12CD#code',
        },
        {
          text: 'PermissionedDisputeGame.sol - Etherscan source code, attack() function',
          href: 'https://etherscan.io/address/0xa8E6a9bF1Ba2dF76C6787EAEbE2273Ae98498059#code',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      references: [
        {
          text: 'Derivation: Batch submission - OP Mainnet specs',
          href: 'https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/derivation.md#batch-submission',
        },
        {
          text: 'BatchInbox - Etherscan address',
          href: `https://etherscan.io/address/${sequencerInbox.toString()}`,
        },
        {
          text: 'OptimismPortal.sol - Etherscan source code, depositTransaction function',
          href: `https://etherscan.io/address/${safeGetImplementation(
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
          text: 'Sequencing Window - OP Mainnet Specs',
          href: 'https://github.com/ethereum-optimism/optimism/blob/51eeb76efeb32b3df3e978f311188aa29f5e3e94/specs/glossary.md#sequencing-window',
        },
        {
          text: 'OptimismPortal.sol - Etherscan source code, depositTransaction function',
          href: `https://etherscan.io/address/${safeGetImplementation(
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
            text: 'OptimismPortal.sol - Etherscan source code, proveWithdrawalTransaction function',
            href: `https://etherscan.io/address/${safeGetImplementation(
              portal,
            )}#code`,
          },
          {
            text: 'OptimismPortal.sol - Etherscan source code, finalizeWithdrawalTransaction function',
            href: `https://etherscan.io/address/${safeGetImplementation(
              portal,
            )}#code`,
          },
        ],
      },
      {
        ...EXITS.FORCED('all-withdrawals'),
        references: [
          {
            text: 'Forced withdrawal from an OP Stack blockchain',
            href: 'https://stack.optimism.io/docs/security/forced-withdrawal/',
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
            text: 'Introducing EVM Equivalence',
            href: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
          },
        ],
      },
    ],
  },
  //stateDerivation: DERIVATION.OPSTACK('INK'),
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
            text: 'OP stack specification: Fault Dispute Game',
            href: 'https://specs.optimism.io/fault-proof/stage-one/fault-dispute-game.html#fault-dispute-game',
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
            text: 'Fraud Proof Wars: OPFP',
            href: 'https://medium.com/l2beat/fraud-proof-wars-b0cb4d0f452a',
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
      usersHave7DaysToExit: true,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: true,
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
        text: 'a contract receives a malicious code upgrade. Both regular and emergency upgrades must be approved by both the Security Council and the Foundation. There is no delay on regular upgrades.',
      },
    ],
  },
}
