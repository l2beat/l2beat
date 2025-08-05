import type { EntryParameters } from '@l2beat/discovery'
import {
  assert,
  ChainSpecificAddress,
  formatSeconds,
  ProjectId,
  type UnixTime,
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
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { BADGES } from '../common/badges'
import { EXPLORER_URLS } from '../common/explorerUrls'
import { formatExecutionDelay } from '../common/formatDelays'
import { getStage } from '../common/stages/getStage'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type {
  Layer2TxConfig,
  ProjectScalingDisplay,
  ProjectScalingTechnology,
  ScalingProject,
} from '../internalTypes'
import type {
  Badge,
  ChainConfig,
  Milestone,
  ProjectActivityConfig,
  ProjectContract,
  ProjectCustomDa,
  ProjectDaTrackingConfig,
  ProjectEscrow,
  ProjectPermissions,
  ProjectScalingCapability,
  ProjectScalingPurpose,
  ProjectScalingScopeOfAssessment,
  ProjectScalingStateDerivation,
  ProjectScalingStateValidation,
  ProjectTechnologyChoice,
  ReasonForBeingInOther,
  TableReadyValue,
} from '../types'
import { getActivityConfig } from './activity'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from './generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from './getDiscoveryInfo'
import { explorerReferences, mergeBadges, safeGetImplementation } from './utils'

export interface DAProvider {
  layer: DaProjectTableValue
  riskView: TableReadyValue
  technology: ProjectTechnologyChoice
  bridge: TableReadyValue
}

export interface PolygonCDKStackConfig {
  addedAt: UnixTime
  capability?: ProjectScalingCapability
  daProvider?: DAProvider
  customDa?: ProjectCustomDa
  discovery: ProjectDiscovery
  display: Omit<ProjectScalingDisplay, 'provider' | 'category' | 'purposes'>
  activityConfig?: ProjectActivityConfig
  chainConfig?: ChainConfig
  stateDerivation?: ProjectScalingStateDerivation
  nonTemplatePermissions?: Record<string, ProjectPermissions>
  nonTemplateContracts?: ProjectContract[]
  nonTemplateEscrows: ProjectEscrow[]
  nonTemplateTechnology?: Partial<ProjectScalingTechnology>
  nonTemplateTrackedTxs?: Layer2TxConfig[]
  milestones: Milestone[]
  isForcedBatchDisallowed: boolean
  rollupModuleContract: EntryParameters
  rollupVerifierContract: EntryParameters
  upgradesAndGovernance?: string
  stateValidation?: ProjectScalingStateValidation
  associatedTokens?: string[]
  additionalBadges?: Badge[]
  additionalPurposes?: ProjectScalingPurpose[]
  overridingPurposes?: ProjectScalingPurpose[]
  archivedAt?: UnixTime
  reasonsForBeingOther?: ReasonForBeingInOther[]
  architectureImage?: string
  scopeOfAssessment?: ProjectScalingScopeOfAssessment
  /** Set to true if projects posts blobs to Ethereum */
  usesEthereumBlobs?: boolean
  /** Configure to enable DA metrics tracking for chain using Celestia DA */
  celestiaDa?: {
    namespace: string
    /* IMPORTANT: Block number on Celestia Network */
    sinceBlock: number
  }
  /** Configure to enable DA metrics tracking for chain using Avail DA */
  availDa?: {
    appId: string
    /* IMPORTANT: Block number on Avail Network */
    sinceBlock: number
  }
  /** Configure to enable custom DA tracking e.g. project that switched DA */
  nonTemplateDaTracking?: ProjectDaTrackingConfig[]
}

export function polygonCDKStack(
  templateVars: PolygonCDKStackConfig,
): ScalingProject {
  const explorerUrl = EXPLORER_URLS['ethereum']
  const daProvider = templateVars.daProvider
  const shared = new ProjectDiscovery('shared-polygon-cdk')
  const rollupManagerContract = shared.getContract('PolygonRollupManager')
  if (daProvider !== undefined) {
    assert(
      templateVars.additionalBadges?.find((b) => b.type === 'DA') !== undefined,
      'DA badge is required for external DA',
    )
  }

  const upgradeDelay = shared.getContractValue<number>(
    'Timelock',
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
      ChainSpecificAddress('eth:0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2'),
    'Polygon rollup manager address does not match with the one in the shared Polygon CDK discovery. Tracked transactions would be misconfigured, bailing.',
  )
  const bridge = shared.getContract('PolygonSharedBridge')

  const finalizationPeriod = 0

  const discoveries = [templateVars.discovery, shared]
  return {
    type: 'layer2',
    addedAt: templateVars.addedAt,
    id: ProjectId(templateVars.discovery.projectName),
    capability: templateVars.capability ?? 'universal',
    archivedAt: templateVars.archivedAt,
    ecosystemInfo: {
      id: ProjectId('agglayer'),
    },
    display: {
      ...templateVars.display,
      upgradesAndGovernanceImage: 'polygoncdk',
      purposes: templateVars.overridingPurposes ?? [
        'Universal',
        ...(templateVars.additionalPurposes ?? []),
      ],
      category: templateVars.reasonsForBeingOther
        ? 'Other'
        : templateVars.daProvider !== undefined
          ? 'Validium'
          : 'ZK Rollup',
      architectureImage:
        (templateVars.architectureImage ??
        templateVars.daProvider !== undefined)
          ? 'polygon-cdk-validium'
          : 'polygon-cdk-rollup',
      stacks: ['Agglayer CDK'],
      tvsWarning: templateVars.display.tvsWarning,
    },
    config: {
      associatedTokens: templateVars.associatedTokens,
      escrows: templateVars.nonTemplateEscrows,
      activityConfig: getActivityConfig(
        templateVars.activityConfig,
        templateVars.chainConfig,
        {
          type: 'block',
          startBlock: 1,
        },
      ),
      trackedTxs: templateVars.nonTemplateTrackedTxs, // only polygonzkevm defined for now due to shared trackedTxs
      liveness: {
        duplicateData: {
          from: 'stateUpdates',
          to: 'proofSubmissions',
        },
      },
      daTracking: getDaTracking(templateVars),
    },
    chainConfig: templateVars.chainConfig && {
      ...templateVars.chainConfig,
      gasTokens: templateVars.chainConfig?.gasTokens ?? ['ETH'],
    },
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
                stateVerificationOnL1: true,
                fraudProofSystemAtLeast5Outsiders: null,
              },
              stage1: {
                principle: false,
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
      dataAvailability:
        (templateVars.nonTemplateTechnology?.dataAvailability ??
        templateVars.daProvider !== undefined)
          ? technologyDA(daProvider)
          : {
              ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
              references: [
                {
                  title:
                    'PolygonZkEVM.sol - Etherscan source code, sequenceBatches() function',
                  url: `https://etherscan.io/address/${safeGetImplementation(templateVars.rollupModuleContract)}#code`,
                },
              ],
            },
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
                'PolygonSharedBridge.sol - source code, claimAsset function',
              address: safeGetImplementation(bridge),
            },
          ]),
        },
      ],
      sequencing: templateVars.nonTemplateTechnology?.sequencing,
      otherConsiderations: [
        {
          name: 'Shared bridge and Pessimistic Proofs',
          description:
            "Polygon Agglayer uses a shared bridge escrow for Rollups, Validiums and external chains that opt in to participate in interoperability. Each participating chain needs to provide zk proofs to access any assets in the shared bridge. In addition to the full execution proofs that are used for the state validation of Rollups and Validiums, accounting proofs over the bridges state (Polygon calls them 'Pessimistic Proofs') are used by external chains ('cdk-sovereign'). Using the SP1 zkVM by Succinct, projects without a full proof system on Ethereum are able to share the bridge with the zkEVM Agglayer projects.",
          risks: [
            {
              category: 'Funds can be lost if',
              text: 'the accounting proof system for the bridge (pessimistic proofs, SP1) is implemented incorrectly.',
            },
          ],
          references: [
            {
              title: 'Pessimistic Proof - Polygon Knowledge Layer',
              url: 'https://docs.polygon.technology/learn/agglayer/pessimistic_proof',
            },
            {
              title:
                'Etherscan: PolygonRollupManager.sol - verifyPessimisticTrustedAggregator() function',
              url: 'https://etherscan.io/address/0x42B9fF0644741e3353162678596e7D6aA6a13240#code#F1#L1280',
            },
          ],
        },
      ],
    },
    stateDerivation: templateVars.stateDerivation ?? {
      nodeSoftware:
        'Node software can be found [here](https://github.com/0xPolygonHermez/zkevm-node) and [here](https://github.com/0xPolygonHermez/cdk-erigon). The cdk-erigon node is the more recent implementation.',
      compressionScheme: 'No compression scheme is used.',
      genesisState:
        'The genesis state, whose corresponding root is accessible as Batch 0 root in the [`_legacyBatchNumToStateRoot`](https://evm.storage/eth/19489007/0x5132a183e9f3cb7c848b0aac5ae0c4f0491b7ab2/_legacyBatchNumToStateRoot#map) variable of PolygonRollupManager, is available [here](https://github.com/0xPolygonHermez/zkevm-contracts/blob/0d0e69a6f299e273343461f6350343cf4b048269/deployment/genesis.json).',
      dataFormat:
        'The trusted sequencer batches transactions according to the specifications documented [here](https://docs.polygon.technology/zkEVM/architecture/protocol/transaction-life-cycle/transaction-batching/).',
    },
    stateValidation: templateVars.stateValidation ?? {
      description:
        'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
      categories: [
        {
          title: 'Prover Architecture',
          description:
            'Polygon zkEVM proof system PIL-STARK can be found [here](https://github.com/0xPolygonHermez/pil-stark).',
        },
        {
          title: 'ZK Circuits',
          description:
            'Polygon zkEVM circuits are built from PIL (polynomial identity language) and are designed to replicate the behavior of the EVM. The source code can be found [here](https://github.com/0xPolygonHermez/zkevm-rom).',
          risks: [
            {
              category: 'Funds can be lost if',
              text: 'the proof system is implemented incorrectly.',
            },
          ],
        },
        {
          title: 'Verification Keys Generation',
          description:
            'SNARK verification keys can be generated and checked against the Ethereum verifier contract using [this guide](https://github.com/0xPolygonHermez/zkevm-contracts/blob/main/verifyMainnetDeployment/verifyMainnetProofVerifier.md). The system requires a trusted setup.',
        },
        {
          title: 'Pessimistic Proofs',
          description:
            'The pessimistic proofs that are used to prove correct accounting in the Agglayer shared bridge are using the [SP1 zkVM by Succinct](https://github.com/succinctlabs/sp1).',
        },
        {
          ...STATE_VALIDATION.VALIDITY_PROOFS,
          references: explorerReferences(explorerUrl, [
            {
              title:
                'PolygonRollupManager.sol - source code, _verifyAndRewardBatches function',
              address: safeGetImplementation(rollupManagerContract),
            },
          ]),
        },
      ],
    },
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
    badges: mergeBadges(
      [
        BADGES.Stack.CDKErigon,
        BADGES.VM.EVM,
        BADGES.DA.EthereumCalldata,
        BADGES.Infra.Agglayer,
      ],
      templateVars.additionalBadges ?? [],
    ),
    customDa: templateVars.customDa,
    reasonsForBeingOther: templateVars.reasonsForBeingOther,
    scopeOfAssessment: templateVars.scopeOfAssessment,
    discoveryInfo: getDiscoveryInfo(discoveries),
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

function getDaTracking(
  templateVars: PolygonCDKStackConfig,
): ProjectDaTrackingConfig[] | undefined {
  if (templateVars.nonTemplateDaTracking) {
    return templateVars.nonTemplateDaTracking
  }

  if (templateVars.usesEthereumBlobs) {
    const polygonContract = templateVars.discovery.getContract('PolygonZkEVM')
    const sequencer =
      templateVars.discovery.getContractValue<ChainSpecificAddress>(
        'PolygonZkEVM',
        'trustedSequencer',
      )

    return [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: polygonContract.sinceBlock ?? 0,
        inbox: ChainSpecificAddress.address(polygonContract.address),
        sequencers: [ChainSpecificAddress.address(sequencer)],
      },
    ]
  }

  if (templateVars.celestiaDa) {
    return [
      {
        type: 'celestia',
        daLayer: ProjectId('celestia'),
        // TODO: update to value from discovery
        sinceBlock: templateVars.celestiaDa.sinceBlock,
        namespace: templateVars.celestiaDa.namespace,
      },
    ]
  }

  if (templateVars.availDa) {
    return [
      {
        type: 'avail',
        daLayer: ProjectId('avail'),
        // TODO: update to value from discovery
        sinceBlock: templateVars.availDa.sinceBlock,
        appId: templateVars.availDa.appId,
      },
    ]
  }

  return undefined
}
