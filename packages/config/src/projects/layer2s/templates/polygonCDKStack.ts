import type { ContractParameters } from '@l2beat/discovery-types'
import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'

import { ethereum } from '../../../chains/ethereum'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  type DataAvailabilityLayer,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  RISK_VIEW,
  SEQUENCER_NO_MECHANISM,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
} from '../../../common'
import { formatDelay, formatExecutionDelay } from '../../../common/formatDelays'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import type {
  Layer2,
  Layer2Display,
  Layer2TxConfig,
  Milestone,
  ProjectEscrow,
  ProjectTechnologyChoice,
  ReasonForBeingInOther,
  ScalingProjectCapability,
  ScalingProjectContract,
  ScalingProjectPermission,
  ScalingProjectPurpose,
  ScalingProjectStateDerivation,
  ScalingProjectStateValidation,
  ScalingProjectTechnology,
  TableReadyValue,
  TransactionApiConfig,
} from '../../../types'
import type { ChainConfig, KnowledgeNugget } from '../../../types'
import type { DacDaLayer } from '../../../types'
import { Badge, type BadgeId, badges } from '../../badges'
import { getStage } from '../common/stages/getStage'
import { explorerReferences, mergeBadges, safeGetImplementation } from './utils'

export interface DAProvider {
  layer: DataAvailabilityLayer
  fallback?: DataAvailabilityLayer
  riskView: TableReadyValue
  technology: ProjectTechnologyChoice
  bridge: TableReadyValue
}

export interface PolygonCDKStackConfig {
  addedAt: UnixTime
  capability?: ScalingProjectCapability
  daProvider?: DAProvider
  dataAvailabilitySolution?: DacDaLayer
  discovery: ProjectDiscovery
  display: Omit<Layer2Display, 'provider' | 'category' | 'purposes'>
  rpcUrl?: string
  transactionApi?: TransactionApiConfig
  chainConfig?: ChainConfig
  stateDerivation?: ScalingProjectStateDerivation
  nonTemplatePermissions?: ScalingProjectPermission[]
  nonTemplateContracts?: ScalingProjectContract[]
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
  gasTokens?: string[]
  isArchived?: boolean
  reasonsForBeingOther?: ReasonForBeingInOther[]
}

export function polygonCDKStack(templateVars: PolygonCDKStackConfig): Layer2 {
  const explorerUrl = ethereum.explorerUrl
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
    'Timelock',
    'getMinDelay',
  )
  const upgradeDelayString = formatSeconds(upgradeDelay)
  const trustedAggregatorTimeout = shared.getContractValue<number>(
    rollupManagerContract.name,
    'trustedAggregatorTimeout',
  )
  const trustedAggregatorTimeoutString = formatSeconds(trustedAggregatorTimeout)
  const pendingStateTimeout = shared.getContractValue<number>(
    rollupManagerContract.name,
    'pendingStateTimeout',
  )
  const pendingStateTimeoutString = formatSeconds(pendingStateTimeout)

  const _HALT_AGGREGATION_TIMEOUT = formatSeconds(
    shared.getContractValue<number>(
      rollupManagerContract.name,
      '_HALT_AGGREGATION_TIMEOUT',
    ),
  )

  const forceBatchTimeout = templateVars.discovery.getContractValue<number>(
    templateVars.rollupModuleContract.name,
    'forceBatchTimeout',
  )

  const exitWindowRisk = {
    ...RISK_VIEW.EXIT_WINDOW(
      upgradeDelay,
      trustedAggregatorTimeout + pendingStateTimeout + forceBatchTimeout,
      { upgradeDelay2: 0 },
    ),
    description: `Even though there is a ${upgradeDelayString} Timelock for upgrades, forced transactions are disabled. Even if they were to be enabled, user withdrawals can be censored up to ${formatSeconds(
      trustedAggregatorTimeout + pendingStateTimeout + forceBatchTimeout,
    )}.`,
    warning: {
      value: 'The Security Council can remove the delay on upgrades.',
      sentiment: 'bad',
    },
  } as const

  const sharedUpgradeability = {
    upgradableBy: ['RollupManagerAdminMultisig'],
    upgradeDelay: exitWindowRisk.value,
    upgradeConsiderations: exitWindowRisk.description,
  }

  assert(
    rollupManagerContract.address ===
      EthereumAddress('0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2'),
    'Polygon rollup manager address does not match with the one in the shared Polygon CDK discovery. Tracked transactions would be misconfigured, bailing.',
  )
  const bridge = shared.getContract('Bridge')

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
      purposes: ['Universal', ...(templateVars.additionalPurposes ?? [])],
      category:
        templateVars.daProvider !== undefined ? 'Validium' : 'ZK Rollup',
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
    dataAvailability:
      daProvider !== undefined
        ? addSentimentToDataAvailability({
            layers: daProvider.fallback
              ? [daProvider.layer, daProvider.fallback]
              : [daProvider.layer],
            bridge: daProvider.bridge,
            mode: DA_MODES.TRANSACTION_DATA,
          })
        : addSentimentToDataAvailability({
            layers: [DA_LAYERS.ETH_CALLDATA],
            bridge: DA_BRIDGES.ENSHRINED,
            mode: DA_MODES.TRANSACTION_DATA,
          }),
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
      proposerFailure: {
        ...RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK,
        description:
          RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK.description +
          ` There is a ${trustedAggregatorTimeoutString} delay for proving and a ${pendingStateTimeoutString} delay for finalizing state proven in this way. These delays can only be lowered except during the emergency state.`,
        secondLine: formatDelay(trustedAggregatorTimeout + pendingStateTimeout),
      },
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
                stateVerificationOnL1: true,
                fraudProofSystemAtLeast5Outsiders: null,
                usersHave7DaysToExit: false,
                usersCanExitWithoutCooperation: false,
                securityCouncilProperlySetUp: [
                  false,
                  'Security Council members are not publicly known.',
                ],
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
          ...EXITS.REGULAR('zk', 'merkle proof'),
          references: explorerReferences(explorerUrl, [
            {
              title:
                'PolygonZkEvmBridgeV2.sol - source code, claimAsset function',
              address: safeGetImplementation(bridge),
            },
          ]),
        },
      ],
    },
    stateDerivation: templateVars.stateDerivation,
    stateValidation: templateVars.stateValidation,
    permissions: [
      {
        name: 'Sequencer',
        accounts: [
          templateVars.discovery.getPermissionedAccount(
            templateVars.rollupModuleContract.name,
            'trustedSequencer',
          ),
        ],
        description:
          'Its sole purpose and ability is to submit transaction batches. In case they are unavailable users cannot rely on the force batch mechanism because it is currently disabled.',
      },
      {
        name: 'Proposer (Trusted Aggregator)',
        accounts: shared.getAccessControlRolePermission(
          rollupManagerContract.name,
          'TRUSTED_AGGREGATOR',
        ),
        description: `The trusted proposer (called Aggregator) provides ZK proofs for all the supported systems. In case they are unavailable a mechanism for users to submit proofs on their own exists, but is behind a ${trustedAggregatorTimeoutString} delay for proving and a ${pendingStateTimeoutString} delay for finalizing state proven in this way. These delays can only be lowered except during the emergency state.`,
      },
      ...shared.getMultisigPermission(
        'SecurityCouncil',
        'The Security Council is a multisig that can be used to trigger the emergency state which pauses bridge functionality, restricts advancing system state and removes the upgradeability delay.',
      ),
      {
        name: 'Forced Batcher',
        accounts: [
          templateVars.discovery.getPermissionedAccount(
            templateVars.rollupModuleContract.name,
            'forceBatchAddress',
          ),
        ],
        description:
          'Sole account allowed to submit forced transactions. If this address is the zero address, anyone can submit forced transactions.',
      },
      ...shared.getMultisigPermission(
        'RollupManagerAdminMultisig',
        `Admin of the PolygonRollupManager contract, can set core system parameters like timeouts and aggregator as well as deactivate emergency state. They can also upgrade the ${
          templateVars.rollupModuleContract.name
        } contracts, but are restricted by a ${formatSeconds(
          upgradeDelay,
        )} delay unless rollup is put in the Emergency State.`,
      ),
      ...(templateVars.nonTemplatePermissions ?? []),
    ],
    contracts: {
      addresses: [
        ...(templateVars.nonTemplateContracts ?? []),
        templateVars.discovery.getContractDetails(
          templateVars.rollupModuleContract.name,
          {
            description: `The main contract of the ${templateVars.display.name}. Contains sequenced transaction batch hashes and forced transaction logic.`,
            ...sharedUpgradeability,
          },
        ),
        templateVars.discovery.getContractDetails(
          templateVars.rollupVerifierContract.name,
          {
            description:
              'An autogenerated contract that verifies ZK proofs in the PolygonRollupManager system.',
          },
        ),
        shared.getContractDetails(rollupManagerContract.name, {
          description: `It defines the rules of the system including core system parameters, permissioned actors as well as emergency procedures. The emergency state can be activated either by the Security Council, by proving a soundness error or by presenting a sequenced batch that has not been aggregated before a ${_HALT_AGGREGATION_TIMEOUT} timeout. This contract receives L2 state roots as well as ZK proofs.`,
          ...sharedUpgradeability,
        }),
        shared.getContractDetails('Bridge', {
          description:
            'The escrow contract for user funds. It is mirrored on the L2 side and can be used to transfer both ERC20 assets and arbitrary messages. To transfer funds a user initiated transaction on both sides is required.',
          ...sharedUpgradeability,
        }),
        shared.getContractDetails('GlobalExitRootV2', {
          description:
            'Synchronizes deposit and withdraw merkle trees across L1 and the L2s. The global root from this contract is injected into the L2 contracts.',
          ...sharedUpgradeability,
        }),
        shared.getContractDetails(
          'Timelock',
          (() => {
            const timelockAdmin = shared.getAccessControlField(
              'Timelock',
              'TIMELOCK_ADMIN_ROLE',
            ).members[1]
            const timelockProposer = shared.getAccessControlField(
              'Timelock',
              'PROPOSER_ROLE',
            ).members[0]
            const timelockExecutor = shared.getAccessControlField(
              'Timelock',
              'EXECUTOR_ROLE',
            ).members[0]
            const timelockCanceller = shared.getAccessControlField(
              'Timelock',
              'CANCELLER_ROLE',
            ).members[0]
            assert(
              timelockAdmin === timelockProposer &&
                timelockProposer === timelockExecutor &&
                timelockExecutor === timelockCanceller,
              'Timelock roles have changed, update Timelock description.',
            )
            return `Contract upgrades have to go through a ${upgradeDelayString} timelock unless the Emergency State is activated. It can also add rollup types that can be used to upgrade verifier contracts of existing systems. It is controlled by the ProxyAdminOwner.`
          })(),
        ),
      ],
      references: explorerReferences(explorerUrl, [
        {
          title:
            'State injections - stateRoot and exitRoot are part of the validity proof input.',
          address: safeGetImplementation(rollupManagerContract),
        },
      ]),
      risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(upgradeDelayString)],
    },
    upgradesAndGovernance: templateVars.upgradesAndGovernance,
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
    dataAvailabilitySolution: templateVars.dataAvailabilitySolution,
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
