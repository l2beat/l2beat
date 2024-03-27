import { ContractParameters } from '@l2beat/discovery-types'
import {
  assert,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  addSentimentToDataAvailability,
  ChainConfig,
  CONTRACTS,
  DataAvailabilityBridge,
  DataAvailabilityLayer,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  KnowledgeNugget,
  makeBridgeCompatible,
  Milestone,
  RISK_VIEW,
  ScalingProjectContract,
  ScalingProjectEscrow,
  ScalingProjectPermission,
  ScalingProjectRiskViewEntry,
  ScalingProjectStateDerivation,
  ScalingProjectTechnology,
  ScalingProjectTechnologyChoice,
  SEQUENCER_NO_MECHANISM,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getStage } from '../common/stages/getStage'
import {
  Layer2,
  Layer2Display,
  Layer2TransactionApi,
  Layer2TxConfig,
} from '../types'

export interface DAProvider {
  name: DataAvailabilityLayer
  fallback?: DataAvailabilityLayer
  riskView: ScalingProjectRiskViewEntry
  technology: ScalingProjectTechnologyChoice
  bridge: DataAvailabilityBridge
}

export interface PolygonCDKStackConfig {
  daProvider?: DAProvider
  discovery: ProjectDiscovery
  display: Omit<Layer2Display, 'provider' | 'category' | 'dataAvailabilityMode'>
  rpcUrl?: string
  transactionApi?: Layer2TransactionApi
  chainConfig?: ChainConfig
  stateDerivation?: ScalingProjectStateDerivation
  nonTemplatePermissions?: ScalingProjectPermission[]
  nonTemplateContracts?: ScalingProjectContract[]
  nonTemplateEscrows: ScalingProjectEscrow[]
  nonTemplateTechnology?: Partial<ScalingProjectTechnology>
  nonTemplateTrackedTxs?: Layer2TxConfig[]
  milestones: Milestone[]
  knowledgeNuggets: KnowledgeNugget[]
  isForcedBatchDisallowed: boolean
  rollupManagerContract: ContractParameters
  rollupModuleContract: ContractParameters
  rollupVerifierContract: ContractParameters
}

export function polygonCDKStack(templateVars: PolygonCDKStackConfig): Layer2 {
  const daProvider = templateVars.daProvider
  const shared = new ProjectDiscovery('shared-polygon-cdk')

  const upgradeDelay = shared.getContractValue<number>(
    'Timelock',
    'getMinDelay',
  )
  const upgradeDelayString = formatSeconds(upgradeDelay)
  const trustedAggregatorTimeout = shared.getContractValue<number>(
    templateVars.rollupManagerContract.name,
    'trustedAggregatorTimeout',
  )
  const trustedAggregatorTimeoutString = formatSeconds(trustedAggregatorTimeout)
  const pendingStateTimeout = shared.getContractValue<number>(
    templateVars.rollupManagerContract.name,
    'pendingStateTimeout',
  )
  const pendingStateTimeoutString = formatSeconds(pendingStateTimeout)

  const _HALT_AGGREGATION_TIMEOUT = formatSeconds(
    shared.getContractValue<number>(
      templateVars.rollupManagerContract.name,
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
      0,
    ),
    description: `Even though there is a ${upgradeDelayString} Timelock for upgrades, forced transactions are disabled. Even if they were to be enabled, user withdrawals can be censored up to ${formatSeconds(
      trustedAggregatorTimeout + pendingStateTimeout + forceBatchTimeout,
    )}.`,
    warning: {
      value: 'The Security Council can remove the delay on upgrades.',
      sentiment: 'bad',
    },
  } as const

  const upgradeability = {
    upgradableBy: ['AdminMultisig'],
    upgradeDelay: exitWindowRisk.value,
    upgradeConsiderations: exitWindowRisk.description,
  }

  assert(
    templateVars.rollupManagerContract.address ===
      EthereumAddress('0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2'),
    'Polygon rollup manager address does not match with the one in the shared Polygon CDK discovery. Tracked transactions would be misconfigured, bailing.',
  )
  const bridge = shared.getContract('Bridge')

  return {
    type: 'layer2',
    id: ProjectId(templateVars.discovery.projectName),
    display: {
      ...templateVars.display,
      category:
        templateVars.daProvider !== undefined ? 'Validium' : 'ZK Rollup',
      provider: 'Polygon',
      tvlWarning: templateVars.display.tvlWarning ?? {
        content:
          'The TVL is currently shared among all projects using the shared Polygon CDK contracts.',
        sentiment: 'warning',
      },
      finality: templateVars.display.finality ?? {
        finalizationPeriod: 0,
      },
    },
    config: {
      escrows: [
        shared.getEscrowDetails({
          address: bridge.address,
          tokens: '*',
        }),
        ...templateVars.nonTemplateEscrows,
      ],
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
                  sinceTimestampInclusive: new UnixTime(1679653163),
                  untilTimestampExclusive: new UnixTime(1707824735),
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
                  sinceTimestampInclusive: new UnixTime(1679653163),
                  untilTimestampExclusive: new UnixTime(1707822059),
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
                  sinceTimestampInclusive: new UnixTime(1679653163),
                  untilTimestampExclusive: new UnixTime(1707822059),
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
                  sinceTimestampInclusive: new UnixTime(1707822059),
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
                  sinceTimestampInclusive: new UnixTime(1707822059),
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
        templateVars.daProvider !== undefined ? undefined : 'coming soon',
    },
    chainConfig: templateVars.chainConfig,
    dataAvailability:
      daProvider !== undefined
        ? addSentimentToDataAvailability({
            layers: daProvider.fallback
              ? [daProvider.name, daProvider.fallback]
              : [daProvider.name],
            bridge: daProvider.bridge,
            mode: 'Transactions data',
          })
        : addSentimentToDataAvailability({
            layers: ['Ethereum (calldata)'],
            bridge: { type: 'Enshrined' },
            mode: 'Transactions data',
          }),
    riskView: makeBridgeCompatible({
      stateValidation: {
        ...RISK_VIEW.STATE_ZKP_SN,
        sources: [
          {
            contract: templateVars.rollupManagerContract.name,
            references: [
              `https://etherscan.io/address/${safeGetImplementation(templateVars.rollupManagerContract)}`,
            ],
          },
        ],
      },
      dataAvailability: {
        ...riskViewDA(daProvider),
        sources: [
          {
            contract: templateVars.rollupModuleContract.name,
            references: [],
          },
        ],
      },
      exitWindow: exitWindowRisk,
      // this will change once the isForcedBatchDisallowed is set to false inside Polygon ZkEvm contract (if they either lower timeouts or increase the timelock delay)
      sequencerFailure: {
        ...SEQUENCER_NO_MECHANISM(templateVars.isForcedBatchDisallowed),
        sources: [
          {
            contract: templateVars.rollupModuleContract.name,
            references: [],
          },
        ],
      },
      proposerFailure: {
        ...RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK,
        description:
          RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK.description +
          ` There is a ${trustedAggregatorTimeoutString} delay for proving and a ${pendingStateTimeoutString} delay for finalizing state proven in this way. These delays can only be lowered except during the emergency state.`,
        sources: [
          {
            contract: templateVars.rollupManagerContract.name,
            references: [
              `https://etherscan.io/address/${safeGetImplementation(templateVars.rollupManagerContract)}`,
              `https://etherscan.io/address/${safeGetImplementation(templateVars.rollupManagerContract)}`,
            ],
          },
        ],
      },
      destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
      validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    }),
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
        references: [
          {
            text: 'PolygonRollupManager.sol - Etherscan source code, _verifyAndRewardBatches function',
            href: `https://etherscan.io/address/${safeGetImplementation(templateVars.rollupManagerContract)}`,
          },
        ],
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
        references: [],
      },
      forceTransactions: templateVars.nonTemplateTechnology
        ?.forceTransactions ?? {
        ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
        description:
          'The mechanism for allowing users to submit their own transactions is currently disabled.',
      },
      exitMechanisms: templateVars.nonTemplateTechnology?.exitMechanisms ?? [
        {
          ...EXITS.REGULAR('zk', 'merkle proof'),
          references: [
            {
              text: 'PolygonZkEvmBridgeV2.sol - Etherscan source code, claimAsset function',
              href: `https://etherscan.io/address/${safeGetImplementation(bridge)}`,
            },
          ],
        },
      ],
    },
    stateDerivation: templateVars.stateDerivation,
    permissions: [
      ...templateVars.discovery.getMultisigPermission(
        'AdminMultisig',
        `Admin of the ${templateVars.rollupModuleContract.name} rollup, can set core system parameters like timeouts, sequencer and aggregator as well as deactivate emergency state. They can also upgrade the ${templateVars.rollupModuleContract.name} contracts, but are restricted by a ${formatSeconds(upgradeDelay)} delay unless rollup is put in the Emergency State.`,
      ),
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
          templateVars.rollupManagerContract.name,
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
        `Admin of the Polygon Rollup Manager contract, can set core system parameters like timeouts and aggregator as well as deactivate emergency state.`,
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
          },
        ),
        templateVars.discovery.getContractDetails(
          templateVars.rollupVerifierContract.name,
          {
            description:
              'An autogenerated contract that verifies ZK proofs in the PolygonRollupManager system.',
          },
        ),
        shared.getContractDetails(templateVars.rollupManagerContract.name, {
          description: `It defines the rules of the system including core system parameters, permissioned actors as well as emergency procedures. The emergency state can be activated either by the Security Council, by proving a soundness error or by presenting a sequenced batch that has not been aggregated before a ${_HALT_AGGREGATION_TIMEOUT} timeout. This contract receives L2 state roots as well as ZK proofs.`,
          ...upgradeability,
        }),
        shared.getContractDetails('Bridge', {
          description:
            'The escrow contract for user funds. It is mirrored on the L2 side and can be used to transfer both ERC20 assets and arbitrary messages. To transfer funds a user initiated transaction on both sides is required.',
          ...upgradeability,
        }),
        shared.getContractDetails('GlobalExitRootV2', {
          description:
            'Synchronizes deposit and withdraw merkle trees across L1 and the L2s. The global root from this contract is injected into the L2 contracts.',
          ...upgradeability,
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
            return `Contract upgrades have to go through a ${upgradeDelayString} timelock unless the Emergency State is activated. It can also add rollup types that can be used to upgrade verifier contracts of existing systems. It is controlled by the AdminMultisig.`
          })(),
        ),
      ],
      references: [
        {
          text: 'State injections - stateRoot and exitRoot are part of the validity proof input.',
          href: `https://etherscan.io/address/${safeGetImplementation(templateVars.rollupManagerContract)}`,
        },
      ],
      risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(upgradeDelayString)],
    },
    upgradesAndGovernance: `
    All main contracts and the verifier are upgradable by the ${shared.getMultisigStats('AdminMultisig')} \`AdminMultisig\` through a timelock that owns \`ProxyAdmin\`. Addresses of trusted sequencer, aggregator and operational parameters (like fees) on the \`PolygonRollupManager\` can be instantly set by the \`AdminMultisig\`. Escrow contracts are upgradable by the \`EscrowsAdmin\` ${shared.getMultisigStats('EscrowsAdmin')} multisig.

        \`PolygonZkEVMTimelock\` is a modified version of TimelockController that disables delay in case of a manually enabled or triggered emergency state in the \`PolygonRollupManager\`. It otherwise has a ${upgradeDelayString} delay. 

        The process to upgrade the \`PolygonRollupManager\`-implementation and / or the verifier has two steps: 1) A newRollupType-transaction is added by the \`AdminMultisig\` to the timelock, which in turn can call the \`addNewRollupType()\` function in the \`PolygonRollupManager\`. In a non-emergency state, this allows potential reviews of the new rollup type while it sits in the timelock. 2) After the delay period, the rollup implementation can be upgraded to the new rollup type by the \`AdminMultisig\` calling the \`updateRollup()\`-function in the \`PolygonRollupManager\` directly.

        The critical roles in the \`PolygonRollupManager\` can be changed through the timelock, while the trusted Aggregator role can be granted by the \`AdminMultisig\` directly.

        The ${shared.getMultisigStats('SecurityCouncil')} \`SecurityCouncil\` multisig can manually enable the emergency state in the \`PolygonRollupManager\`.`,
    milestones: templateVars.milestones,
    knowledgeNuggets: templateVars.knowledgeNuggets,
  }
}

function riskViewDA(DA: DAProvider | undefined): ScalingProjectRiskViewEntry {
  return DA === undefined
    ? {
        ...RISK_VIEW.DATA_ON_CHAIN,
        description:
          RISK_VIEW.DATA_ON_CHAIN.description +
          ' Unlike most ZK rollups transactions are posted instead of state diffs.',
      }
    : DA.riskView
}

function technologyDA(
  DA: DAProvider | undefined,
): ScalingProjectTechnologyChoice {
  if (DA !== undefined) {
    return DA.technology
  }

  return TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA
}

function safeGetImplementation(contract: ContractParameters): string {
  const implementation = contract.implementations?.[0]
  if (!implementation) {
    throw new Error(`No implementation found for ${contract.name}`)
  }
  return implementation.toString()
}
