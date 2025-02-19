import {
  type ContractParameters,
  get$Implementations,
} from '@l2beat/discovery-types'
import {
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
  DERIVATION,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { ESCROW } from '../../common'
import { formatChallengePeriod, formatDelay } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../discovery/values/hardcoded'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common'
import { getStage } from './common/stages/getStage'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from './templates/generateDiscoveryDrivenSections'

const discovery = new ProjectDiscovery('base')

function safeGetImplementation(contract: ContractParameters): string {
  const implementation = get$Implementations(contract.values)[0]
  if (!implementation) {
    throw new Error(`No implementation found for ${contract.name}`)
  }
  return implementation.toString()
}

const FINALIZATION_PERIOD_SECONDS: number = discovery.getContractValue<number>(
  'OptimismPortal',
  'proofMaturityDelaySeconds',
)

const maxClockDuration = discovery.getContractValue<number>(
  'FaultDisputeGame',
  'maxClockDuration',
)

const disputeGameFinalityDelaySeconds = discovery.getContractValue<number>(
  'OptimismPortal',
  'disputeGameFinalityDelaySeconds',
)

const proofMaturityDelaySeconds = discovery.getContractValue<number>(
  'OptimismPortal',
  'proofMaturityDelaySeconds',
)

const sequencerAddress = EthereumAddress(
  discovery.getContractValue('SystemConfig', 'batcherHash'),
)

const sequencerInbox = EthereumAddress(
  discovery.getContractValue('SystemConfig', 'sequencerInbox'),
)

const disputeGameFactory = discovery.getContract('DisputeGameFactory')

const genesisTimestamp = new UnixTime(1686074603)
const portal = discovery.getContract('OptimismPortal')

const permissionlessDisputeGameBonds = discovery.getContractValue<number[]>(
  'DisputeGameFactory',
  'initBonds',
)[0]

const permissionlessGameClockExtension = discovery.getContractValue<number>(
  'FaultDisputeGame',
  'clockExtension',
)

const exponentialBondsFactor = 1.09493 // hardcoded, from https://specs.optimism.io/fault-proof/stage-one/bond-incentives.html?highlight=1.09493#bond-scaling

const permissionlessGameMaxDepth = discovery.getContractValue<number>(
  'FaultDisputeGame',
  'maxGameDepth',
)

const permissionlessGameSplitDepth = discovery.getContractValue<number>(
  'FaultDisputeGame',
  'splitDepth',
)

const permissionlessGameFullCost = (() => {
  let cost = 0
  const scaleFactor = 100000
  for (let i = 0; i <= permissionlessGameMaxDepth; i++) {
    cost =
      cost +
      (permissionlessDisputeGameBonds / scaleFactor) *
        exponentialBondsFactor ** i
  }
  return BigNumber.from(cost).mul(BigNumber.from(scaleFactor))
})()

const oracleChallengePeriod = discovery.getContractValue<number>(
  'PreimageOracle',
  'challengePeriod',
)

const permissionlessGameMaxClockExtension =
  permissionlessGameClockExtension * 2 + // at SPLIT_DEPTH - 1
  oracleChallengePeriod + // at MAX_GAME_DEPTH - 1
  permissionlessGameClockExtension * (permissionlessGameMaxDepth - 3) // the rest, excluding also the last depth

export const base: Layer2 = {
  type: 'layer2',
  id: ProjectId('base'),
  capability: 'universal',
  addedAt: new UnixTime(1679651674), // 2023-03-24T09:54:34Z
  badges: [
    Badge.VM.EVM,
    Badge.DA.EthereumBlobs,
    Badge.Stack.OPStack,
    Badge.Infra.Superchain,
    Badge.Other.L3HostChain,
  ],
  display: {
    name: 'Base',
    slug: 'base',
    stateValidationImage: 'opfp',
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    description:
      'Base is an Optimistic Rollup built with the OP Stack. It offers a low-cost and builder-friendly way for anyone, anywhere, to build onchain.',
    purposes: ['Universal'],
    links: {
      websites: ['https://base.org/'],
      apps: ['https://bridge.base.org/'],
      documentation: ['https://docs.base.org/', 'https://stack.optimism.io/'],
      explorers: [
        'https://basescan.org/',
        'https://base.superscan.network',
        'https://base.blockscout.com/',
        'https://base.l2scan.co/',
      ],
      repositories: ['https://github.com/base-org'],
      socialMedia: [
        'https://twitter.com/BuildOnBase',
        'https://discord.gg/buildonbase',
        'https://base.mirror.xyz/',
        'https://warpcast.com/base',
      ],
      rollupCodes: 'https://rollup.codes/base',
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
    escrows: [
      discovery.getEscrowDetails({
        // OptimismPortal
        address: EthereumAddress('0x49048044D57e1C92A77f79988d21Fa8fAF74E97e'),
        tokens: ['ETH'],
      }),
      discovery.getEscrowDetails({
        // L1StandardBridge
        address: EthereumAddress('0x3154Cf16ccdb4C6d922629664174b904d80F2C35'),
        tokens: '*',
        excludedTokens: ['SolvBTC', 'SolvBTC.BBN', 'rsETH'], // TODO: check
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x9de443AdC5A411E83F1878Ef24C3F52C61571e72'),
        tokens: ['wstETH'],
        ...ESCROW.CANONICAL_EXTERNAL,
        description:
          'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x7F311a4D48377030bD810395f4CCfC03bdbe9Ef3'),
        tokens: ['USDS', 'sUSDS'],
        ...ESCROW.CANONICAL_EXTERNAL,
        description:
          'Maker-controlled vault for USDS ans sUSDS bridged with canonical messaging.',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://developer-access-mainnet.base.org',
      startBlock: 1,
      adjustCount: { type: 'SubtractOneSinceBlock', blockNumber: 1 },
    },
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 0, // Edge Case: config added @ DA Module start
        inbox: discovery.getContractValue('SystemConfig', 'sequencerInbox'),
        sequencers: [discovery.getContractValue('SystemConfig', 'batcherHash')],
      },
    ],
    finality: {
      type: 'OPStack',
      minTimestamp: new UnixTime(1710375515),
      genesisTimestamp: new UnixTime(1686789347),
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
          address: EthereumAddress(
            '0x56315b90c40730925ec5485cf004d835058518A0',
          ),
          selector: '0x9aaab648',
          functionSignature:
            'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
          sinceTimestamp: new UnixTime(1686793895),
          untilTimestamp: new UnixTime(1730303471), // before proofs
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
          sinceTimestamp: new UnixTime(1730303471), // after proofs
        },
      },
    ],
  },
  chainConfig: {
    name: 'base',
    blockscoutV2ApiUrl: 'https://base.blockscout.com/api/v2',
    chainId: 8453,
    explorerUrl: 'https://basescan.org',
    explorerApi: {
      url: 'https://api.basescan.org/api',
      type: 'etherscan',
    },
    // ~ Timestamp of block number 0 on Base
    // https://basescan.org/block/0
    minTimestampForTvl: UnixTime.fromDate(new Date('2023-06-15T12:35:47Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 5022,
        version: '3',
      },
    ],
    coingeckoPlatform: 'base',
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_FP_INT,
      secondLine: formatChallengePeriod(maxClockDuration),
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, FINALIZATION_PERIOD_SECONDS), // different than op mainnet!
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      ),
      secondLine: formatDelay(HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS),
    },
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_ROOTS,
  },
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs ensure state correctness',
      description:
        'After some period of time, the published state root is assumed to be correct. For a certain time period, actors can submit a fraud proof that shows that the state was incorrect.',
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
          url: 'https://etherscan.io/address/0xc641A33cab81C559F2bd4b21EA34C290E2440C2B#code',
        },
        {
          title:
            'FaultDisputeGame.sol - Etherscan source code, attack() function',
          url: 'https://etherscan.io/address/0xc5f3677c3C56DB4031ab005a3C9c98e1B79D438e#code',
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
        ...EXITS.FORCED_MESSAGING('all-messages'),
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
  stateDerivation: DERIVATION.OPSTACK('BASE'),
  stateValidation: {
    description:
      'Updates to the system state can be proposed and challenged by anyone who has sufficient funds. If a state root passes the challenge period, it is optimistically considered correct and made actionable for withdrawals.',
    categories: [
      {
        title: 'State root proposals',
        description: `Proposers submit state roots as children of the latest confirmed state root (called anchor state), by calling the \`create\` function in the DisputeGameFactory. A state root can have multiple conflicting children. Each proposal requires a stake, currently set to ${formatEther(
          permissionlessDisputeGameBonds,
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
        description: `Challenges are opened to disprove invalid state roots using bisection games. Each bisection move requires a stake that increases expontentially with the depth of the bisection, with a factor of ${exponentialBondsFactor}. The maximum depth is ${permissionlessGameMaxDepth}, and reaching it therefore requires a cumulative stake of ${parseFloat(
          formatEther(permissionlessGameFullCost),
        ).toFixed(
          2,
        )} ETH from depth 0. Actors can participate in any challenge by calling the \`defend\` or \`attack\` functions, depending whether they agree or disagree with the latest claim and want to move the bisection game forward. Actors that disagree with the top-level claim are called challengers, and actors that agree are called defenders. Each actor might be involved in multiple (sub-)challenges at the same time, meaning that the protocol operates with [full concurrency](https://medium.com/l2beat/fraud-proof-wars-b0cb4d0f452a). Challengers and defenders alternate in the bisection game, and they pass each other a clock that starts with ${formatSeconds(
          maxClockDuration,
        )}. If a clock expires, the claim is considered defeated if it was countered, or it gets confirmed if uncountered. Since honest parties can inherit clocks from malicious parties that play both as challengers and defenders (see [freeloader claims](https://specs.optimism.io/fault-proof/stage-one/fault-dispute-game.html#freeloader-claims)), if a clock gets inherited with less than ${formatSeconds(
          permissionlessGameClockExtension,
        )}, it generally gets extended by ${formatSeconds(
          permissionlessGameClockExtension,
        )} with the exception of ${formatSeconds(
          permissionlessGameClockExtension * 2,
        )} right before depth ${permissionlessGameSplitDepth}, and ${formatSeconds(
          oracleChallengePeriod,
        )} right before the last depth. The maximum clock extension that a top level claim can get is therefore ${formatSeconds(
          permissionlessGameMaxClockExtension,
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
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: false,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: true,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: false,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: true,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/base-org/node',
    },
  ),
  milestones: [
    {
      title: 'Fault proofs!',
      url: 'https://base.mirror.xyz/eOsedW4tm8MU5OhdGK107A9wsn-aU7MAb8f3edgX5Tk',
      date: '2024-10-30T00:00:00Z',
      description: 'Base upgrades to OP stack fault proofs for state proving.',
      type: 'general',
    },
    {
      title: 'Chain stall',
      url: 'https://status.base.org/incidents/n3q0q4z24b7h',
      date: '2023-09-05T00:00:00Z',
      description:
        'Due to an RPC issue, the sequencer stops producing blocks for ~30 minutes.',
      type: 'incident',
    },
    {
      title: 'Base starts using blobs',
      url: 'https://twitter.com/Optimism/status/1768235284494450922',
      date: '2024-03-14T00:00:00Z',
      description: 'Base starts publishing data to blobs.',
      type: 'general',
    },
    {
      title: 'Base Mainnet Launch',
      url: 'https://base.mirror.xyz/hwNwqXHVoLlO8s4DZppog4DfGvM34tigaDjOWuEJQfY',
      date: '2023-07-13T00:00:00.00Z',
      description: 'Base is live on mainnet.',
      type: 'general',
    },
  ],
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: `a contract receives a malicious code upgrade. Upgrades must be approved by both the BaseMultisig1 and the OpFoundationOperationsSafe. There is no delay on upgrades.`,
      },
    ],
  },
}
