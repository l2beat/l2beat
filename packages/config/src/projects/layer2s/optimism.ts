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
  NUGGETS,
  RISK_VIEW,
} from '../../common'
import { ESCROW } from '../../common'
import { FORCE_TRANSACTIONS } from '../../common/forceTransactions'
import { formatChallengePeriod, formatDelay } from '../../common/formatDelays'
import { OPERATOR } from '../../common/operator'
import { TECHNOLOGY_DATA_AVAILABILITY } from '../../common/technologyDataAvailability'
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

const discovery = new ProjectDiscovery('optimism')
const l2Discovery = new ProjectDiscovery('optimism', 'optimism')

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

export const optimism: Layer2 = {
  type: 'layer2',
  id: ProjectId('optimism'),
  capability: 'universal',
  addedAt: new UnixTime(1623153328), // 2021-06-08T11:55:28Z
  badges: [
    Badge.VM.EVM,
    Badge.DA.EthereumBlobs,
    Badge.Stack.OPStack,
    Badge.Infra.Superchain,
    Badge.Other.L3HostChain,
    Badge.Other.Governance,
  ],
  display: {
    name: 'OP Mainnet',
    slug: 'op-mainnet',
    stateValidationImage: 'opfp',
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    description:
      'OP Mainnet is an EVM-equivalent Optimistic Rollup. It aims to be fast, simple, and secure.',
    purposes: ['Universal'],
    links: {
      websites: ['https://optimism.io/'],
      apps: ['https://app.optimism.io'],
      documentation: ['https://community.optimism.io'],
      explorers: [
        'https://optimistic.etherscan.io',
        'https://optimism.blockscout.com/',
        'https://mainnet.superscan.network',
      ],
      repositories: ['https://github.com/ethereum-optimism/optimism'],
      socialMedia: [
        'https://x.com/Optimism',
        'https://optimism.mirror.xyz/',
        'https://twitter.com/OPLabsPBC',
        'https://youtube.com/playlist?list=PLX_rXoLYCf5HqTWygUfoMfzRirGz5lekH',
        'https://twitch.tv/optimismpbc',
        'https://discord.gg/optimism',
      ],
      rollupCodes: 'https://rollup.codes/optimism',
    },
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `OP Mainnet is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets confirmed ${formatSeconds(
        maxClockDuration,
      )} after it has been posted.`,
    },
    finality: { finalizationPeriod: maxClockDuration },
  },
  config: {
    associatedTokens: ['OP'],
    escrows: [
      discovery.getEscrowDetails({
        // OptimismPortal
        address: EthereumAddress('0xbEb5Fc579115071764c7423A4f12eDde41f106Ed'),
        tokens: ['ETH'],
      }),
      discovery.getEscrowDetails({
        // L1StandardBridge
        address: EthereumAddress('0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1'),
        tokens: '*',
        excludedTokens: ['rsETH'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65'),
        sinceTimestamp: new UnixTime(1625675779),
        ...ESCROW.CANONICAL_EXTERNAL,
        tokens: ['DAI'],
        description: 'DAI Vault for custom DAI Gateway managed by MakerDAO.',
      }),
      discovery.getEscrowDetails({
        // current SNX bridge escrow
        address: EthereumAddress('0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f'),
        sinceTimestamp: new UnixTime(1620680982),
        tokens: ['SNX'],
        ...ESCROW.CANONICAL_EXTERNAL,
        description: 'SNX Vault for custom SNX Gateway managed by Synthetix.',
      }),
      {
        // old snx bridge
        address: EthereumAddress('0x045e507925d2e05D114534D0810a1abD94aca8d6'),
        sinceTimestamp: new UnixTime(1610668212),
        tokens: ['SNX'],
        ...ESCROW.CANONICAL_EXTERNAL,
        isHistorical: true,
        chain: 'ethereum',
      },
      {
        // also old snx bridge
        address: EthereumAddress('0xCd9D4988C0AE61887B075bA77f08cbFAd2b65068'),
        sinceTimestamp: new UnixTime(1620680934),
        tokens: ['SNX'],
        ...ESCROW.CANONICAL_EXTERNAL,
        isHistorical: true,
        chain: 'ethereum',
      },
      discovery.getEscrowDetails({
        address: EthereumAddress('0x76943C0D61395d8F2edF9060e1533529cAe05dE6'),
        tokens: ['wstETH'],
        ...ESCROW.CANONICAL_EXTERNAL,
        description:
          'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://mainnet.optimism.io/',
      startBlock: 1,
      adjustCount: { type: 'SubtractOneSinceBlock', blockNumber: 105235064 },
    },
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 0, // Edge Case: config added @ DA Module start
        inbox: '0xFF00000000000000000000000000000000000010',
        sequencers: ['0x6887246668a3b87f54deb3b94ba47a6f63f32985'],
      },
    ],
    finality: {
      type: 'OPStack',
      // timestamp of the first blob tx
      minTimestamp: new UnixTime(1710375155),
      l2BlockTimeSeconds: 2,
      genesisTimestamp: new UnixTime(1686068903),
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
            '0xdfe97868233d1aa22e815a266982f2cf17685a27',
          ),
          selector: '0x9aaab648',
          functionSignature:
            'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
          sinceTimestamp: new UnixTime(1660662182),
          untilTimestamp: new UnixTime(1718039363),
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
          sinceTimestamp: new UnixTime(1718039363), // first create() tx after upgrade https://etherscan.io/tx/0x720954e51b8d5a39475666a54b8087e4b11fcab184eab57e51f821ba14b4c014
        },
      },
    ],
  },
  chainConfig: {
    name: 'optimism',
    chainId: 10,
    explorerUrl: 'https://optimistic.etherscan.io',
    explorerApi: {
      url: 'https://api-optimistic.etherscan.io/api',
      type: 'etherscan',
    },
    blockscoutV2ApiUrl: 'https://optimism.blockscout.com/api/v2',
    // ~ Timestamp of block number 138 on Optimism
    // The first full hour timestamp that will return the block number
    // https://optimistic.etherscan.io/block/138
    minTimestampForTvl: UnixTime.fromDate(new Date('2021-11-11T22:00:00Z')),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 4286263,
        version: '3',
      },
      {
        sinceBlock: 0,
        batchSize: 150,
        address: EthereumAddress('0xE295aD71242373C37C5FdA7B57F26f9eA1088AFe'),
        version: 'optimism',
      },
    ],
    coingeckoPlatform: 'optimistic-ethereum',
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
    exitWindow: {
      value: 'None',
      description:
        'There is no exit window for users to exit in case of unwanted regular upgrades as they are initiated by the Security Council with instant upgrade power and without proper notice.',
      sentiment: 'bad',
      orderHint: -FINALIZATION_PERIOD_SECONDS, // 0-7 days
    },
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
        'After some period of time, the published state root is assumed to be correct. During the challenge period, anyone is allowed to submit a fraud proof that shows that the state was incorrect.',
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
          url: 'https://etherscan.io/address/0xc641a33cab81c559f2bd4b21ea34c290e2440c2b#code',
        },
        {
          title:
            'FaultDisputeGame.sol - Etherscan source code, attack() function',
          url: 'https://etherscan.io/address/0x27B81db41F586016694632193b99E45b1a27B8f8#code',
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
  stateDerivation: {
    ...DERIVATION.OPSTACK('OP_MAINNET'),
    genesisState:
      'Since OP Mainnet has migrated from the OVM to Bedrock, a node must be synced using a data directory that can be found [here](https://docs.optimism.io/builders/node-operators/management/snapshots). To reproduce the migration itself, see this [guide](https://blog.oplabs.co/reproduce-bedrock-migration/).',
  },
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
        )}. Since unconfirmed state roots are independent of one another, users can decide to exit with a subsequent confirmed state root if the previous one is delayed. Winners get the entire losers' stake, meaning that sybils can potentially play against each other at no cost. The final instruction found via the bisection game is then executed onchain in the MIPS one step prover contract who determines the winner. The protocol does not enforce valid bisections, meaning that actors can propose correct initial claims and then provide incorrect midpoints. The protocol can be subject to resource exhaustion attacks ([Spearbit 5.1.3](https://github.com/ethereum-optimism/optimism/blob/develop/docs/security-reviews/2024_08_Fault-Proofs-No-MIPS_Spearbit.pdf)).`,
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
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: true,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: true,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink:
        'https://github.com/ethereum-optimism/optimism/tree/develop/op-node',
    },
  ),
  permissions: generateDiscoveryDrivenPermissions([discovery, l2Discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery, l2Discovery]),
    risks: [
      {
        category: 'Funds can be stolen if',
        text: `a contract receives a malicious code upgrade. Both regular and emergency upgrades must be approved by both the Security Council and the Foundation. There is no delay on regular upgrades.`,
      },
    ],
  },
  upgradesAndGovernance:
    'All contracts are upgradable by the `SuperchainProxyAdmin` which is controlled by a 2/2 multisig composed by the Optimism Foundation and a Security Council. The Guardian role is assigned to the Security Council multisig, with a Safe Module that allows the Foundation to act through it to stop withdrawals in the whole Superchain, blacklist dispute games, or deactivate the fault proof system entirely in case of emergencies. The Security Council can remove the module if the Foundation becomes malicious. The single Sequencer actor can be modified by the `OpFoundationOperationsSafe` via the `SystemConfig` contract. The SuperchainProxyAdminOwner can recover dispute bonds in case of bugs that would distribute them incorrectly. \n\nAt the moment, for regular upgrades, the DAO signals its intent by voting on upgrade proposals, but has no direct control over the upgrade process.',
  milestones: [
    {
      title: 'Fallback to permissioned proposals for 26 days.',
      url: 'https://x.com/Optimism/status/1824560759747256596',
      date: '2024-08-16T00:00:00Z',
      description:
        'OP Mainnet preventively disables the fraud proof system due to a bug for 26 days.',
      type: 'incident',
    },
    {
      title: 'OP Mainnet becomes Stage 1',
      url: 'https://x.com/Optimism/status/1800256837088145799',
      date: '2024-06-10T00:00:00Z',
      description:
        'OP Mainnet introduces fraud proofs and updates permissions.',
      type: 'general',
    },
    {
      title: 'OP Mainnet starts using blobs',
      url: 'https://twitter.com/Optimism/status/1768235284494450922',
      date: '2024-03-14T00:00:00Z',
      description: 'OP Mainnet starts publishing data to blobs.',
      type: 'general',
    },
    {
      title: 'Network Upgrade #5: Ecotone',
      url: 'https://vote.optimism.io/proposals/95119698597711750186734377984697814101707190887694311194110013874163880701970',
      date: '2024-03-14T00:00:00Z',
      description: 'Optimism adopts EIP-4844.',
      type: 'general',
    },
    {
      title: 'Fault Proof System is live on OP Goerli',
      url: 'https://blog.oplabs.co/op-stack-fault-proof-alpha/',
      date: '2023-10-03T00:00:00Z',
      description: 'Fraud Proof system is live on Goerli.',
      type: 'general',
    },
    {
      title: 'Mainnet migration to Bedrock',
      url: 'https://oplabs.notion.site/Bedrock-Mission-Control-EXTERNAL-fca344b1f799447cb1bcf3aae62157c5',
      date: '2023-06-06T00:00:00Z',
      description: 'OP Mainnet, since Jun 2023 is running Bedrock.',
      type: 'general',
    },
    {
      title: 'OP Stack Introduced',
      url: 'https://optimism.mirror.xyz/fLk5UGjZDiXFuvQh6R_HscMQuuY9ABYNF7PI76-qJYs',
      date: '2022-10-17T00:00:00Z',
      description:
        'OP Stack, modular, open-sourced blueprint on how to build scalable blockchains.',
      type: 'general',
    },
    {
      title: 'Mainnet for everyone',
      description:
        'Whitelist got removed, there are no restrictions on who can transact with the network.',
      url: 'https://medium.com/ethereum-optimism/all-gas-no-brakes-8b0f32afd466',
      date: '2021-12-16T00:00:00Z',
      type: 'general',
    },
    {
      title: 'OP token airdrop',
      url: 'https://optimism.mirror.xyz/qvd0WfuLKnePm1Gxb9dpGchPf5uDz5NSMEFdgirDS4c',
      date: '2022-05-31T00:00:00Z',
      description: 'The first round of OP token airdrop.',
      type: 'general',
    },
    {
      title: 'Optimism removes OVM fraud proofs',
      url: 'https://twitter.com/optimismfnd/status/1458953238867165192?s=21&t=cQ0NPREYt-u1rP7OiPFKUg',
      date: '2021-11-12T00:00:00Z',
      description:
        'Network upgrade to OVM 2.0 and removal of fraud-proof system.',
      type: 'incident',
    },
    {
      title: 'Mainnet Soft Launch',
      url: 'https://medium.com/ethereum-optimism/mainnet-soft-launch-7cacc0143cd5',
      date: '2021-01-16T00:00:00Z',
      description:
        'Only selected contracts like Synthetix and Uniswap are available.',
      type: 'general',
    },
    {
      title: 'Community Launch',
      url: 'https://medium.com/ethereum-optimism/community-launch-7c9a2a9d3e84',
      date: '2021-08-19T00:00:00Z',
      description: 'All smart contracts allowed after prior approval.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'The Optimistic Vision',
      url: 'https://www.optimism.io/vision',
      thumbnail: NUGGETS.THUMBNAILS.OPTIMISM_VISION,
    },
  ],
}
