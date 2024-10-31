import { EthereumAddress, UnixTime, ProjectId, formatSeconds } from '@l2beat/shared-pure'
import { HARDCODED } from '../../discovery/values/hardcoded'
import { BigNumber } from 'ethers'
import { addSentimentToDataAvailability, DERIVATION, OPERATOR, RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { Layer2 } from './types'
import {
  ContractParameters,
  get$Implementations,
} from '@l2beat/discovery-types'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common'
import { subtractOneAfterBlockInclusive } from '../../common/assessCount'
import { getStage } from './common/stages/getStage'


const discovery = new ProjectDiscovery('base')

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

export const base: Layer2 = {
  type: 'layer2',
  id: ProjectId('base'),
  createdAt: new UnixTime(1679651674), // 2023-03-24T09:54:34Z
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
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
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
      ],
      rollupCodes: 'https://rollup.codes/base',
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
    escrows: [
      discovery.getEscrowDetails({
        // OptimismPortal
        address: EthereumAddress(''),
        tokens: ['ETH'],
      }),
      discovery.getEscrowDetails({
        // L1StandardBridge
        address: EthereumAddress(''),
        tokens: '*',
        excludedTokens: ['rsETH']
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(''),
        tokens: ['wstETH'],
        description:
          'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      defaultUrl: 'https://developer-access-mainnet.base.org',
      startBlock: 1,
      assessCount: subtractOneAfterBlockInclusive(1),
    },
    finality: {
      type: 'OPStack-blob',
      minTimestamp: new UnixTime(1710375515),
      genesisTimestamp: new UnixTime(1686789347),
      l2BlockTimeSeconds: 2,
      lag: 0,
      stateUpdate: 'disabled',
    },
  },
  trackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmission' },
        { type: 'l2costs', subtype: 'batchSubmission' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress(''),
        selector: '',
        functionSignature: '',
        sinceTimestamp: new UnixTime(),
      }
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {}, // before proofs
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {}, // after proofs
    },
  ],
  dataAvailability: addSentimentToDataAvailability({
    layers: ['Ethereum (blobs or calldata)'],
    bridge: { type: 'Enshrined' },
    mode: 'Transaction data (compressed)'
  }),
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_FP_INT,
      sources: [
        {
          contract: 'DisputeGameFactory',
          references: [''] // TODO: add references
        }
      ],
      secondLine: `${formatSeconds(maxClockDuration)} challenge period`,
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, FINALIZATION_PERIOD_SECONDS), // different than op mainnet!
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      )
    },
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_ROOTS,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
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
        { // see optimism.ts
        },
        {
        },
      ],
    },
    dataAvailability: {},
    operator: OPERATOR.CENTRALIZED_SEQUENCER,
    forceTransactions: {},
    exitMechanisms: [],
    otherConsiderations: [],
  },
  stateDerivation: DERIVATION.OPSTACK('BASE'),
  stateValidation: {
    // see optimism.ts
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
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: false,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: true,
        delayWith30DExitWindow: false,
      }
    },
    {
      rollupNodeLink: '' // TODO: add link
    }
  ),
  isNodeAvailable: true,
  milestones: [
    {
      name: 'Chain stall',
      link: 'https://status.base.org/incidents/n3q0q4z24b7h',
      date: '2023-09-05T00:00:00Z',
      description:
        'Due to an RPC issue, the sequencer stops producing blocks for ~30 minutes.',
      type: 'incident',
    },
    {
      name: 'Base starts using blobs',
      link: 'https://twitter.com/Optimism/status/1768235284494450922',
      date: '2024-03-14T00:00:00Z',
      description: 'Base starts publishing data to blobs.',
      type: 'general',
    },
    {
      name: 'Base Mainnet Launch',
      link: 'https://base.mirror.xyz/hwNwqXHVoLlO8s4DZppog4DfGvM34tigaDjOWuEJQfY',
      date: '2023-07-13T00:00:00.00Z',
      description: 'Base is live on mainnet.',
      type: 'general',
    },
  ],
  nonTemplateExcludedTokens: ['SolvBTC', 'SolvBTC.BBN', 'rsETH'],
  nonTemplateEscrows: [
  ],
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
  usesBlobs: true,
})
