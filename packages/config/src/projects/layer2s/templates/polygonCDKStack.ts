import type { ContractParameters } from '@l2beat/discovery-types'
import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  type DaProjectTableValue,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  RISK_VIEW,
  SEQUENCER_NO_MECHANISM,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../../common'
import { formatExecutionDelay } from '../../../common/formatDelays'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import type {
  ChainConfig,
  CustomDa,
  KnowledgeNugget,
  Layer2,
  Layer2Display,
  Layer2TxConfig,
  Milestone,
  ProjectContract,
  ProjectEscrow,
  ProjectPermissions,
  ProjectTechnologyChoice,
  ReasonForBeingInOther,
  ScalingProjectCapability,
  ScalingProjectPurpose,
  ScalingProjectStateDerivation,
  ScalingProjectStateValidation,
  ScalingProjectTechnology,
  TableReadyValue,
  TransactionApiConfig,
} from '../../../types'
import { Badge, type BadgeId, badges } from '../../badges'
import { EXPLORER_URLS } from '../../chains/explorerUrls'
import { getStage } from '../common/stages/getStage'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from './generateDiscoveryDrivenSections'
import { explorerReferences, mergeBadges, safeGetImplementation } from './utils'

export interface DAProvider {
  layer: DaProjectTableValue
  riskView: TableReadyValue
  technology: ProjectTechnologyChoice
  bridge: TableReadyValue
}

export interface PolygonCDKStackConfig {
  addedAt: UnixTime
  capability?: ScalingProjectCapability
  daProvider?: DAProvider
  customDa?: CustomDa
  discovery: ProjectDiscovery
  display: Omit<Layer2Display, 'provider' | 'category' | 'purposes'>
  rpcUrl?: string
  transactionApi?: TransactionApiConfig
  chainConfig?: ChainConfig
  stateDerivation?: ScalingProjectStateDerivation
  nonTemplatePermissions?: Record<string, ProjectPermissions>
  nonTemplateContracts?: ProjectContract[]
  nonTemplateEscrows: ProjectEscrow[]
  nonTemplateTechnology?: Partial<ScalingProjectTechnology>
  nonTemplateTrackedTxs?: Layer2TxConfig[]
  milestones: Milestone[]
  knowledgeNuggets: KnowledgeNugget[]
  isForcedBatchDisallowed: boolean
  rollupModuleContract: ContractParameters
  rollupVerifierContract: ContractParameters
  upgradesAndGovernance?: string
  stateValidation?: ScalingProjectStateValidation
  associatedTokens?: string[]
  additionalBadges?: BadgeId[]
  additionalPurposes?: ScalingProjectPurpose[]
  overridingPurposes?: ScalingProjectPurpose[]
  gasTokens?: string[]
  isArchived?: boolean
  reasonsForBeingOther?: ReasonForBeingInOther[]
  architectureImage?: string
}

export function polygonCDKStack(templateVars: PolygonCDKStackConfig): Layer2 {
  const explorerUrl = EXPLORER_URLS['ethereum']
  const daProvider = templateVars.daProvider
  const shared = new ProjectDiscovery('shared-polygon-cdk')
  const rollupManagerContract = shared.getContract('PolygonRollupManager')
  if (daProvider !== undefined) {
    assert(
      templateVars.additionalBadges?.find((b) => badges[b].type === 'DA') !==
        undefined,
      'DA badge is required for external DA',
    )
  }

  const upgradeDelay = shared.getContractValue<number>(
    'PolygonZkEVMTimelock',
    'getMinDelay',
  )
  const upgradeDelayString = formatSeconds(upgradeDelay)
  const emergencyActivatedCount = shared.getContractValue<number>(
    'PolygonRollupManager',
    'emergencyStateCount',
  )

  const exitWindowRisk = {
    value: 'None',
    description: `Even though there is a ${upgradeDelayString} Timelock for upgrades, forced transactions are disabled.`,
    sentiment: 'bad',
    orderHint: -1, // worse than forced tx available but instantly upgradable
    warning: {
      value: 'The Security Council can remove the delay on upgrades.',
      sentiment: 'bad',
    },
  } as const

  assert(
    rollupManagerContract.address ===
      EthereumAddress('0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2'),
    'Polygon rollup manager address does not match with the one in the shared Polygon CDK discovery. Tracked transactions would be misconfigured, bailing.',
  )
  const bridge = shared.getContract('PolygonZkEVMBridgeV2')

  const finalizationPeriod =
    templateVars.display.finality?.finalizationPeriod ?? 0

  return {
    type: 'layer2',
    addedAt: templateVars.addedAt,
    id: ProjectId(templateVars.discovery.projectName),
    capability: templateVars.capability ?? 'universal',
    isArchived: templateVars.isArchived,
    display: {
      ...templateVars.display,
      upgradesAndGovernanceImage: 'polygoncdk',
      purposes: templateVars.overridingPurposes ?? [
        'Universal',
        ...(templateVars.additionalPurposes ?? []),
      ],
      category:
        templateVars.daProvider !== undefined ? 'Validium' : 'ZK Rollup',
      architectureImage:
        (templateVars.architectureImage ??
        templateVars.daProvider !== undefined)
          ? 'polygon-cdk-validium'
          : 'polygon-cdk-rollup',
      stack: 'Polygon',
      tvlWarning: templateVars.display.tvlWarning,
      finality: templateVars.display.finality ?? {
        finalizationPeriod,
        warnings: {
          timeToInclusion: {
            sentiment: 'neutral',
            value: 'Uniform block distribution is assumed for calculations.',
          },
        },
      },
    },
    config: {
      associatedTokens: templateVars.associatedTokens,
      gasTokens: templateVars.gasTokens,
      escrows: templateVars.nonTemplateEscrows,
      transactionApi:
        templateVars.transactionApi ??
        (templateVars.rpcUrl !== undefined
          ? {
              type: 'rpc',
              startBlock: 1,
              defaultUrl: templateVars.rpcUrl,
              defaultCallsPerMinute: 500,
            }
          : undefined),
      trackedTxs:
        templateVars.daProvider !== undefined
          ? undefined
          : [
              ...(templateVars.nonTemplateTrackedTxs ?? []),
              {
                uses: [
                  { type: 'liveness', subtype: 'batchSubmissions' },
                  { type: 'l2costs', subtype: 'batchSubmissions' },
                ],
                query: {
                  formula: 'functionCall',
                  address: EthereumAddress(
                    '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
                  ),
                  selector: '0x5e9145c9',
                  functionSignature:
                    'function sequenceBatches((bytes,bytes32,uint64,uint64)[] batches,address l2Coinbase)',
                  sinceTimestamp: new UnixTime(1679653163),
                  untilTimestamp: new UnixTime(1707824735),
                },
              },
              {
                uses: [
                  {
                    type: 'liveness',
                    subtype: 'stateUpdates',
                  },
                  {
                    type: 'l2costs',
                    subtype: 'stateUpdates',
                  },
                ],
                query: {
                  formula: 'functionCall',
                  address: EthereumAddress(
                    '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
                  ),
                  selector: '0x2b0006fa',
                  functionSignature:
                    'function verifyBatchesTrustedAggregator(uint64 pendingStateNum,uint64 initNumBatch,uint64 finalNewBatch,bytes32 newLocalExitRoot,bytes32 newStateRoot,bytes32[24] proof)',
                  sinceTimestamp: new UnixTime(1679653163),
                  untilTimestamp: new UnixTime(1707822059),
                },
              },
              {
                uses: [
                  {
                    type: 'liveness',
                    subtype: 'stateUpdates',
                  },
                  {
                    type: 'l2costs',
                    subtype: 'stateUpdates',
                  },
                ],
                query: {
                  formula: 'functionCall',
                  address: EthereumAddress(
                    '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
                  ),
                  selector: '0x621dd411',
                  functionSignature:
                    'function verifyBatches(uint64 pendingStateNum,uint64 initNumBatch,uint64 finalNewBatch,bytes32 newLocalExitRoot,bytes32 newStateRoot,bytes32[24] calldata proof) ',
                  sinceTimestamp: new UnixTime(1679653163),
                  untilTimestamp: new UnixTime(1707822059),
                },
              },
              {
                uses: [
                  {
                    type: 'liveness',
                    subtype: 'stateUpdates',
                  },
                  {
                    type: 'l2costs',
                    subtype: 'stateUpdates',
                  },
                ],
                query: {
                  formula: 'functionCall',
                  address: EthereumAddress(
                    '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
                  ),
                  selector: '0x1489ed10',
                  functionSignature:
                    'function verifyBatchesTrustedAggregator(uint32,uint64,uint64,uint64,bytes32,bytes32,address,bytes32[24])',
                  sinceTimestamp: new UnixTime(1707822059),
                },
              },
              {
                uses: [
                  {
                    type: 'liveness',
                    subtype: 'stateUpdates',
                  },
                  {
                    type: 'l2costs',
                    subtype: 'stateUpdates',
                  },
                ],
                query: {
                  formula: 'functionCall',
                  address: EthereumAddress(
                    '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
                  ),
                  selector: '0x87c20c01',
                  functionSignature:
                    'function verifyBatches(uint32,uint64,uint64,uint64,bytes32,bytes32,address,bytes32[24])',
                  sinceTimestamp: new UnixTime(1707822059),
                },
              },
            ],
      liveness: {
        duplicateData: {
          from: 'stateUpdates',
          to: 'proofSubmissions',
        },
      },
      finality:
        templateVars.daProvider !== undefined
          ? undefined
          : {
              type: 'PolygonZkEvm',
              minTimestamp: new UnixTime(1679653163),
              lag: 0,
              stateUpdate: 'disabled',
            },
    },
    chainConfig: templateVars.chainConfig,
    dataAvailability: {
      layer: daProvider?.layer ?? DA_LAYERS.ETH_CALLDATA,
      bridge: daProvider?.bridge ?? DA_BRIDGES.ENSHRINED,
      mode: DA_MODES.TRANSACTION_DATA,
    },
    riskView: {
      stateValidation: {
        ...RISK_VIEW.STATE_ZKP_ST_SN_WRAP,
        secondLine: formatExecutionDelay(finalizationPeriod),
      },
      dataAvailability: riskViewDA(daProvider),
      exitWindow: exitWindowRisk,
      // this will change once the isForcedBatchDisallowed is set to false inside Polygon ZkEvm contract (if they either lower timeouts or increase the timelock delay)
      sequencerFailure: SEQUENCER_NO_MECHANISM(
        templateVars.isForcedBatchDisallowed,
      ),
      proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
    },
    stage:
      daProvider !== undefined
        ? { stage: 'NotApplicable' }
        : getStage(
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
                fraudProofSystemAtLeast5Outsiders: null,
                usersHave7DaysToExit: false,
                usersCanExitWithoutCooperation: false,
                securityCouncilProperlySetUp: {
                  satisfied: false,
                  message: 'Security Council members are not publicly known.',
                  mode: 'replace',
                },
              },
              stage2: {
                proofSystemOverriddenOnlyInCaseOfABug: false,
                fraudProofSystemIsPermissionless: null,
                delayWith30DExitWindow: false,
              },
            },
            {
              rollupNodeLink: 'https://github.com/0xPolygonHermez/zkevm-node',
            },
          ),
    technology: {
      newCryptography: templateVars.nonTemplateTechnology?.newCryptography,
      stateCorrectness: templateVars.nonTemplateTechnology
        ?.stateCorrectness ?? {
        ...STATE_CORRECTNESS.VALIDITY_PROOFS,
        references: explorerReferences(explorerUrl, [
          {
            title:
              'PolygonRollupManager.sol - source code, _verifyAndRewardBatches function',
            address: safeGetImplementation(rollupManagerContract),
          },
        ]),
      },
      dataAvailability:
        templateVars.nonTemplateTechnology?.dataAvailability ??
        technologyDA(daProvider),
      operator: templateVars.nonTemplateTechnology?.operator ?? {
        name: 'The system has a centralized sequencer',
        description:
          'Only a trusted sequencer is allowed to submit transaction batches. A mechanism for users to submit their own batches is currently disabled.',
        risks: [
          FRONTRUNNING_RISK,
          {
            category: 'Funds can be frozen if',
            text: 'the sequencer refuses to include an exit transaction.',
            isCritical: true,
          },
        ],
        references: explorerReferences(explorerUrl, [
          {
            title: `${templateVars.rollupModuleContract.name}.sol - source code, onlyTrustedSequencer modifier`,
            address: safeGetImplementation(templateVars.rollupModuleContract),
          },
        ]),
      },
      forceTransactions: templateVars.nonTemplateTechnology
        ?.forceTransactions ?? {
        ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
        description:
          'The mechanism for allowing users to submit their own transactions is currently disabled.',
        references: explorerReferences(explorerUrl, [
          {
            title: `${templateVars.rollupModuleContract.name}.sol - source code, forceBatchAddress address`,
            address: safeGetImplementation(templateVars.rollupModuleContract),
          },
        ]),
      },
      exitMechanisms: templateVars.nonTemplateTechnology?.exitMechanisms ?? [
        {
          ...EXITS.REGULAR_MESSAGING('zk'),
          references: explorerReferences(explorerUrl, [
            {
              title:
                'PolygonZkEvmBridgeV2.sol - source code, claimAsset function',
              address: safeGetImplementation(bridge),
            },
          ]),
        },
      ],
      sequencing: templateVars.nonTemplateTechnology?.sequencing,
    },
    stateDerivation: templateVars.stateDerivation,
    stateValidation: templateVars.stateValidation,
    permissions: generateDiscoveryDrivenPermissions([templateVars.discovery]),
    contracts: {
      addresses: generateDiscoveryDrivenContracts([templateVars.discovery]),
      risks: [
        CONTRACTS.UPGRADE_WITH_DELAY_RISK_WITH_EXCEPTION(
          upgradeDelayString,
          'PolygonSecurityCouncil',
        ),
      ],
    },
    upgradesAndGovernance:
      templateVars.upgradesAndGovernance ??
      `
    The regular upgrade process for all system contracts (shared and L2-specific) starts at the PolygonAdminMultisig. For the shared contracts, they schedule a transaction that targets the ProxyAdmin via the Timelock, wait for ${upgradeDelayString} and then execute the upgrade. An upgrade of the Layer 2 specific rollup- or validium contract requires first adding a new rollupType through the Timelock and the RollupManager (defining the new implementation and verifier contracts). Now that the rollupType is created, either the local admin or the PolygonAdminMultisig can immediately upgrade the local system contracts to it.


    The PolygonSecurityCouncil can expedite the upgrade process by declaring an emergency state. This state pauses both the shared bridge and the PolygonRollupManager and allows for instant upgrades through the timelock. Accordingly, instant upgrades for all system contracts are possible with the cooperation of the SecurityCouncil. The emergency state has been activated ${emergencyActivatedCount} time(s) since inception.


    Furthermore, the PolygonAdminMultisig is permissioned to manage the shared trusted aggregator (proposer and prover) for all participating Layer 2s, deactivate the emergency state, obsolete rolupTypes and manage operational parameters and fees in the PolygonRollupManager directly. The local admin of a specific Layer 2 can manage their chain by choosing the trusted sequencer, manage forced batches and set the data availability config. Creating new Layer 2s (of existing rollupType) is outsourced to the PolygonCreateRollupMultisig but can also be done by the PolygonAdminMultisig. Custom non-shared bridge escrows have their custom upgrade admins listed in the permissions section.`,
    milestones: templateVars.milestones,
    knowledgeNuggets: templateVars.knowledgeNuggets,
    badges: mergeBadges(
      [
        Badge.Stack.PolygonCDK,
        Badge.VM.EVM,
        Badge.DA.EthereumCalldata,
        Badge.Infra.AggLayer,
      ],
      templateVars.additionalBadges ?? [],
    ),
    customDa: templateVars.customDa,
    reasonsForBeingOther: templateVars.reasonsForBeingOther,
  }
}

function riskViewDA(DA: DAProvider | undefined): TableReadyValue {
  return DA === undefined
    ? {
        ...RISK_VIEW.DATA_ON_CHAIN,
        description:
          RISK_VIEW.DATA_ON_CHAIN.description +
          ' Unlike most ZK rollups transactions are posted instead of state diffs.',
      }
    : DA.riskView
}

function technologyDA(DA: DAProvider | undefined): ProjectTechnologyChoice {
  if (DA !== undefined) {
    return DA.technology
  }

  return TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA
}
