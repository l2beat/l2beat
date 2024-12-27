import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'

import {
  ContractParameters,
  get$Implementations,
} from '@l2beat/discovery-types'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  DERIVATION,
  EXITS,
  MILESTONES,
  NUGGETS,
  RISK_VIEW,
  addSentimentToDataAvailability,
} from '../../common'
import { subtractOneAfterBlockInclusive } from '../../common/assessCount'
import { ESCROW } from '../../common/escrow'
import { FORCE_TRANSACTIONS } from '../../common/forceTransactions'
import { formatChallengePeriod, formatDelay } from '../../common/formatDelays'
import { OPERATOR } from '../../common/operator'
import { TECHNOLOGY_DATA_AVAILABILITY } from '../../common/technologyDataAvailability'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../discovery/values/hardcoded'
import { Badge } from '../badges'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('optimism')
const l2Discovery = new ProjectDiscovery('optimism', 'optimism')

function safeGetImplementation(contract: ContractParameters): string {
  const implementation = get$Implementations(contract.values)[0]
  if (!implementation) {
    throw new Error(`No implementation found for ${contract.name}`)
  }
  return implementation.toString()
}

const l1Upgradeability = {
  upgradableBy: ['SuperchainProxyAdmin'],
  upgradeDelay: 'No delay',
}

const l2Upgradability = {
  upgradableBy: ['L2ProxyAdmin'],
  upgradeDelay: 'No delay',
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

const livenessInterval = discovery.getContractValue<string>(
  'LivenessModule',
  'livenessInterval',
)

const respectedGameType = discovery.getContractValue<number>(
  'OptimismPortal',
  'respectedGameType',
)

const gameTypes = ['FaultDisputeGame', 'PermissionedDisputeGame']

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
  createdAt: new UnixTime(1623153328), // 2021-06-08T11:55:28Z
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
    slug: 'optimism',
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
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
    activityDataSource: 'Blockchain RPC',
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
      assessCount: subtractOneAfterBlockInclusive(105235064),
    },
    finality: {
      type: 'OPStack-blob',
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
  dataAvailability: [
    addSentimentToDataAvailability({
      layers: [DA_LAYERS.ETH_BLOBS_OR_CALLDATA],
      bridge: DA_BRIDGES.ENSHRINED,
      mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
    }),
  ],
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_FP_INT,
      sources: [
        {
          contract: 'DisputeGameFactory',
          references: [
            'https://etherscan.io/address/0xc641a33cab81c559f2bd4b21ea34c290e2440c2b#code',
          ],
        },
      ],
      secondLine: formatChallengePeriod(maxClockDuration),
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: {
      value: 'None',
      description:
        'There is no exit window for users to exit in case of unwanted regular upgrades as they are initiated by the Security Council with instant upgrade power and without proper notice.',
      sentiment: 'bad',
      definingMetric: -FINALIZATION_PERIOD_SECONDS, // 0-7 days
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
          text: 'DisputeGameFactory.sol - Etherscan source code, create() function',
          href: 'https://etherscan.io/address/0xc641a33cab81c559f2bd4b21ea34c290e2440c2b#code',
        },
        {
          text: 'FaultDisputeGame.sol - Etherscan source code, attack() function',
          href: 'https://etherscan.io/address/0xA6f3DFdbf4855a43c529bc42EDE96797252879af#code',
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
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
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
            text: 'OP stack specification: Fault Dispute Game',
            href: 'https://specs.optimism.io/fault-proof/stage-one/fault-dispute-game.html#fault-dispute-game',
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
            text: 'Fraud Proof Wars: OPFP',
            href: 'https://medium.com/l2beat/fraud-proof-wars-b0cb4d0f452a',
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
  permissions: [
    {
      name: 'Sequencer',
      accounts: [discovery.formatPermissionedAccount(sequencerAddress)],
      description: 'Central actor allowed to submit transaction batches to L1.',
    },
    discovery.contractAsPermissioned(
      discovery.getContract('SuperchainProxyAdmin'),
      'Admin of OptimismPortal, L1StandardBridge, L1ERC721Bridge, OptimismMintableERC20Factory, SuperchainConfig, DelayedWETH, DisputeGameFactory, AnchorStateRegistry and SystemConfig contracts.',
    ),
    ...discovery.getMultisigPermission(
      'SuperchainProxyAdminOwner',
      'Owner of the SuperchainProxyAdmin. It can upgrade the bridge implementation potentially gaining access to all funds, and change any system component. It also controls the L2ProxyAdmin, meaning it can upgrade L2 system components.',
    ),
    ...discovery.getMultisigPermission(
      'GuardianMultisig',
      'Address allowed to pause withdrawals or blacklist dispute games in case of an emergency. It is controlled by the Security Council multisig, but a module allows the Foundation to act through it. The Security Council can disable the module if the Foundation acts maliciously.',
    ),
    ...discovery.getMultisigPermission(
      'OpFoundationUpgradeSafe',
      'Member of the SuperchainProxyAdminOwner.',
    ),
    ...discovery.getMultisigPermission(
      'SecurityCouncilMultisig',
      `Member of the SuperchainProxyAdminOwner. It implements a LivenessModule used to remove inactive (${livenessInterval}) members while making sure that the threshold remains above 75%. If the number of members falls below 8, the Foundation takes ownership of the Security Council.`,
      [
        {
          text: 'Security Council members - Optimism Collective forum',
          href: 'https://gov.optimism.io/t/security-council-vote-2-initial-member-ratification/7118',
        },
      ],
    ),
    ...discovery.getMultisigPermission(
      'OpFoundationOperationsSafe',
      'This address is the owner of the following contracts: SystemConfig.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContract('FeesCollector'),
      'Address collecting sequencer, base and L1 fees from L2.',
    ),
  ],
  nativePermissions: {
    optimism: [
      l2Discovery.contractAsPermissioned(
        l2Discovery.getContract('L2ProxyAdmin'),
        'Admin of L2CrossDomainMessenger, GasPriceOracle, L2StandardBridge, SequencerFeeVault, OptimismMintableERC20Factory, L1BlockNumber, L2ERC721Bridge, L1Block, L1ToL2MessagePasser, OptimismMintableERC721Factory, BaseFeeVault, L1FeeVault, SchemaRegistry and EAS contracts.',
      ),
      {
        name: 'L2ProxyAdminOwner',
        chain: 'optimism',
        description:
          'Owner of the L2ProxyAdmin. It can update the L2 bridge implementation potentially gaining access to all funds, and change any L2 system component. Assigned as the (aliased) L1 ProxyAdminOwner, meaning that upgrades has to be done through the L1 -> L2 bridge.',
        accounts: [l2Discovery.getPermissionedAccount('L2ProxyAdmin', 'owner')],
      },
      ...l2Discovery.getMultisigPermission(
        'MintManagerOwner',
        'Owner of the MintManager. It can change the OP token owner to a different MintManager and therefore change the inflation policy.',
      ),
    ],
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('OptimismPortal', {
        description: `The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals. The current game type is ${gameTypes[respectedGameType]}.`,
        ...l1Upgradeability,
      }),
      discovery.getContractDetails('L1CrossDomainMessenger', {
        description:
          'The L1CrossDomainMessenger (L1xDM) contract sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract’s replay function.',
        ...l1Upgradeability,
      }),
      discovery.getContractDetails('L1StandardBridge', {
        description:
          'The L1StandardBridge contract is the main entry point to deposit ERC20 tokens from L1 to L2. This contract can store any token.',
        ...l1Upgradeability,
      }),
      discovery.getContractDetails('L1ERC721Bridge', {
        description:
          'The L1ERC721Bridge contract is used to bridge ERC-721 tokens from L1 to L2.',
        ...l1Upgradeability,
      }),
      discovery.getContractDetails('SystemConfig', {
        description:
          'It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.',
        ...l1Upgradeability,
      }),
      discovery.getContractDetails('DisputeGameFactory', {
        description:
          'The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.',
        ...l1Upgradeability,
      }),
      discovery.getContractDetails(
        'FaultDisputeGame',
        'Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.',
      ),
      discovery.getContractDetails(
        'PermissionedDisputeGame',
        'Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.',
      ),
      discovery.getContractDetails('MIPS', {
        description:
          'The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.',
      }),
      discovery.getContractDetails('AnchorStateRegistry', {
        description:
          'Contains the latest confirmed state root that can be used as a starting point in a dispute game.',
        ...l1Upgradeability,
      }),
      discovery.getContractDetails('PreimageOracle', {
        description:
          'The PreimageOracle contract is used to load the required data from L1 for a dispute game.',
      }),
      discovery.getContractDetails('DelayedWETH_PermissionlessGames', {
        description:
          'Contract designed to hold the bonded ETH for each permissionless dispute game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds. It is owned by the SuperchainProxyAdminOwner multisig.',
        ...l1Upgradeability,
      }),
      discovery.getContractDetails('DelayedWETH_PermissionedGames', {
        description:
          'Contract designed to hold the bonded ETH for each permissioned dispute game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds. It is owned by the SuperchainProxyAdminOwner multisig.',
        ...l1Upgradeability,
      }),
      discovery.getContractDetails('SuperchainConfig', {
        description:
          'The SuperchainConfig contract is used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.',
        ...l1Upgradeability,
      }),
      discovery.getContractDetails('DeputyGuardianModule', {
        description:
          'The DeputyGuardianModule is a Gnosis Safe module that allows the OP Foundation to act through the GuardianMultisig, which is owned by the Security Council. It is used to pause withdrawals in case of an emergency, blacklist games, disable the proof system, and update the anchor state. The Security Council can disable the module if the Foundation acts maliciously.',
        ...l1Upgradeability,
      }),
      discovery.getContractDetails('LivenessModule', {
        description: `The LivenessModule is a Gnosis Safe nodule used to remove Security Council members that have been inactive for ${livenessInterval} while making sure that the threshold remains above 75%. If the number of members falls below 8, the OpFoundationUpgradeSafe takes ownership of the multisig.`,
        ...l1Upgradeability,
      }),
    ],
    nativeAddresses: {
      optimism: [
        l2Discovery.getContractDetails(
          'OPToken',
          'The OP token contract. It is owned by the MintManager and can inflate the token supply by 2% annually.',
        ),
        l2Discovery.getContractDetails(
          'MintManager',
          'Controls the OP inflation rate, which is currently hardcoded to 2% annually. It is controlled by the MintManagerOwner multisig, which can also change the OP token owner and therefore the inflation rate.',
        ),
        l2Discovery.getContractDetails('L2CrossDomainMessenger', {
          description:
            'The L2CrossDomainMessenger (L2xDM) contract sends messages from L2 to L1, and relays messages from L1 onto L2 with a system tx. In the event that a message sent from L2 to L1 is rejected for exceeding the L1 gas limit, it can be resubmitted via this contract’s replay function.',
          ...l2Upgradability,
        }),
        l2Discovery.getContractDetails('GasPriceOracle', {
          description:
            'Contracts that provide L1 and L2 gas price information, which is derived permissionlessly from the L1 chain.',
          ...l2Upgradability,
        }),
        l2Discovery.getContractDetails('L2StandardBridge', {
          description:
            'The L2StandardBridge contract is the main entry point to deposit or withdraw ERC20 tokens from L2 to L1. This contract can store any token.',
          ...l2Upgradability,
        }),
        l2Discovery.getContractDetails('OptimismMintableERC20Factory', {
          description:
            'Factory contract to create bridge compliant ERC20 IOU token representations of bridged L1 ERC20 tokens.',
          ...l2Upgradability,
        }),
        l2Discovery.getContractDetails('OptimismMintableERC721Factory', {
          description:
            'Factory contract to create bridge compliant ERC721 IOU token representations of bridged L1 ERC721 tokens.',
          ...l2Upgradability,
        }),
        l2Discovery.getContractDetails('L1BlockNumber', {
          description:
            'Simple contract that returns the latest L1 block number.',
          ...l2Upgradability,
        }),
        l2Discovery.getContractDetails('L2ERC721Bridge', {
          description:
            'The L2ERC721Bridge contract is the main entry point to deposit or withdraw ERC721 tokens from L2 to L1. This contract can store any token.',
          ...l2Upgradability,
        }),
        l2Discovery.getContractDetails('L1Block', {
          description:
            'Simple contract that returns information about the latest L1 block, which is derived permissionlessly from the L1 chain.',
          ...l2Upgradability,
        }),
        l2Discovery.getContractDetails('L2ToL1MessagePasser', {
          description:
            'Contract used internally by the L2CrossDomainMessenger to send messages to L1, including withdrawals. It can also be used directly as a low-level interface.',
          ...l2Upgradability,
        }),
        l2Discovery.getContractDetails('BaseFeeVault', {
          description:
            'Contract collecting base fees, which are withdrawable to the FeesCollector on L1.',
          ...l2Upgradability,
        }),
        l2Discovery.getContractDetails('L1FeeVault', {
          description:
            'Contract collecting L1 fees, which are withdrawable to the FeesCollector on L1.',
          ...l2Upgradability,
        }),
        l2Discovery.getContractDetails('SequencerFeeVault', {
          description:
            'Contract collecting sequencer fees, which are withdrawable to the FeesCollector on L1.',
          ...l2Upgradability,
        }),
        l2Discovery.getContractDetails('SchemaRegistry', {
          description:
            'Contracts to register schemas for the Ethereum Attestation Service (EAS).',
          ...l2Upgradability,
        }),
        l2Discovery.getContractDetails('EAS', {
          description:
            'Contract containing the main logic for the Ethereum Attestation Service (EAS).',
          ...l2Upgradability,
        }),
      ],
    },
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
      name: 'Fallback to permissioned proposals for 26 days.',
      link: 'https://x.com/Optimism/status/1824560759747256596',
      date: '2024-08-16T00:00:00Z',
      description:
        'OP Mainnet preventively disables the fraud proof system due to a bug for 26 days.',
      type: 'incident',
    },
    {
      name: 'OP Mainnet becomes Stage 1',
      link: 'https://x.com/Optimism/status/1800256837088145799',
      date: '2024-06-10T00:00:00Z',
      description:
        'OP Mainnet introduces fraud proofs and updates permissions.',
      type: 'general',
    },
    {
      name: 'OP Mainnet starts using blobs',
      link: 'https://twitter.com/Optimism/status/1768235284494450922',
      date: '2024-03-14T00:00:00Z',
      description: 'OP Mainnet starts publishing data to blobs.',
      type: 'general',
    },
    {
      name: 'Network Upgrade #5: Ecotone',
      link: 'https://vote.optimism.io/proposals/95119698597711750186734377984697814101707190887694311194110013874163880701970',
      date: '2024-03-14T00:00:00Z',
      description: 'Optimism adopts EIP-4844.',
      type: 'general',
    },
    {
      name: 'Fault Proof System is live on OP Goerli',
      link: 'https://blog.oplabs.co/op-stack-fault-proof-alpha/',
      date: '2023-10-03T00:00:00Z',
      description: 'Fraud Proof system is live on Goerli.',
      type: 'general',
    },
    {
      name: 'Mainnet migration to Bedrock',
      link: 'https://oplabs.notion.site/Bedrock-Mission-Control-EXTERNAL-fca344b1f799447cb1bcf3aae62157c5',
      date: '2023-06-06T00:00:00Z',
      description: 'OP Mainnet, since Jun 2023 is running Bedrock.',
      type: 'general',
    },
    {
      name: 'OP Stack Introduced',
      link: 'https://optimism.mirror.xyz/fLk5UGjZDiXFuvQh6R_HscMQuuY9ABYNF7PI76-qJYs',
      date: '2022-10-17T00:00:00Z',
      description:
        'OP Stack, modular, open-sourced blueprint on how to build scalable blockchains.',
      type: 'general',
    },
    {
      ...MILESTONES.MAINNET_OPEN,
      link: 'https://medium.com/ethereum-optimism/all-gas-no-brakes-8b0f32afd466',
      date: '2021-12-16T00:00:00Z',
      description:
        'Whitelist got removed, there are no restrictions on who can transact with the network.',
      type: 'general',
    },
    {
      name: 'OP token airdrop',
      link: 'https://optimism.mirror.xyz/qvd0WfuLKnePm1Gxb9dpGchPf5uDz5NSMEFdgirDS4c',
      date: '2022-05-31T00:00:00Z',
      description: 'The first round of OP token airdrop.',
      type: 'general',
    },
    {
      name: 'Optimism removes OVM fraud proofs',
      link: 'https://twitter.com/optimismfnd/status/1458953238867165192?s=21&t=cQ0NPREYt-u1rP7OiPFKUg',
      date: '2021-11-12T00:00:00Z',
      description:
        'Network upgrade to OVM 2.0 and removal of fraud-proof system.',
      type: 'incident',
    },
    {
      name: 'Mainnet Soft Launch',
      link: 'https://medium.com/ethereum-optimism/mainnet-soft-launch-7cacc0143cd5',
      date: '2021-01-16T00:00:00Z',
      description:
        'Only selected contracts like Synthetix and Uniswap are available.',
      type: 'general',
    },
    {
      name: 'Community Launch',
      link: 'https://medium.com/ethereum-optimism/community-launch-7c9a2a9d3e84',
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
