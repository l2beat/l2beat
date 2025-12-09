import {
  assert,
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
  DaUpgradeabilityRisk,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  SEQUENCER_NO_MECHANISM,
  STATE_VALIDATION,
} from '../common'
import { BADGES } from '../common/badges'
import { EXPLORER_URLS } from '../common/explorerUrls'
import { formatDelay } from '../common/formatDelays'
import { ZK_PROGRAM_HASHES } from '../common/zkProgramHashes'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import type {
  Layer2TxConfig,
  ProjectScalingDisplay,
  ProjectScalingTechnology,
  ScalingProject,
} from '../internalTypes'
import type {
  Badge,
  ChainConfig,
  DacInfo,
  DaTechnology,
  Milestone,
  ProjectActivityConfig,
  ProjectContract,
  ProjectCustomDa,
  ProjectDaTrackingConfig,
  ProjectEscrow,
  ProjectPermissions,
  ProjectReviewStatus,
  ProjectRisk,
  ProjectScalingCapability,
  ProjectScalingProofSystem,
  ProjectScalingPurpose,
  ProjectScalingScopeOfAssessment,
  ProjectScalingStateDerivation,
  ProjectScalingStateValidation,
  ProjectTechnologyChoice,
  ReasonForBeingInOther,
  TableReadyValue,
} from '../types'
import { getActivityConfig } from './activity'
import { DAC } from './dac-template'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from './generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from './getDiscoveryInfo'
import {
  explorerReferences,
  mergeBadges,
  mergePermissions,
  safeGetImplementation,
} from './utils'

export interface DAProvider {
  layer: DaProjectTableValue
  riskView: TableReadyValue
  bridge: TableReadyValue
}

type AgglayerVariant = 'validium' | 'pessimistic' | 'opstack_closed'

interface AgglayerBaseConfig {
  variant?: AgglayerVariant
  addedAt: UnixTime
  reviewStatus?: ProjectReviewStatus
  capability?: ProjectScalingCapability
  discovery: ProjectDiscovery
  display: Omit<ProjectScalingDisplay, 'provider' | 'category' | 'purposes'>
  activityConfig?: ProjectActivityConfig
  chainConfig?: ChainConfig
  stateDerivation?: ProjectScalingStateDerivation
  nonTemplateProofSystem?: ProjectScalingProofSystem
  nonTemplatePermissions?: Record<string, ProjectPermissions>
  nonTemplateContracts?: ProjectContract[]
  nonTemplateEscrows: ProjectEscrow[]
  nonTemplateTechnology?: Partial<ProjectScalingTechnology>
  nonTemplateTrackedTxs?: Layer2TxConfig[]
  milestones: Milestone[]
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
  usesEthereumBlobs?: boolean
  celestiaDa?: {
    namespace: string
    sinceBlock: number
  }
  availDa?: {
    appIds: string[]
    sinceBlock: number
  }
  nonTemplateDaTracking?: ProjectDaTrackingConfig[]
}

interface AgglayerValidiumConfig extends AgglayerBaseConfig {
  variant: 'validium'
  daProvider?: DAProvider
  customDa?: ProjectCustomDa
}

interface AgglayerPessimisticConfig extends AgglayerBaseConfig {
  variant: 'pessimistic'
  customDa?: ProjectCustomDa
}

interface AgglayerOpstackClosedConfig extends AgglayerBaseConfig {
  variant: 'opstack_closed'
  customDa?: ProjectCustomDa
}

type AgglayerConfigInput =
  | AgglayerValidiumConfig
  | AgglayerPessimisticConfig
  | AgglayerOpstackClosedConfig
  | (AgglayerBaseConfig & {
      variant?: undefined
      daProvider?: DAProvider
      customDa?: ProjectCustomDa
    })

type AgglayerConfig =
  | AgglayerValidiumConfig
  | AgglayerPessimisticConfig
  | AgglayerOpstackClosedConfig

interface SharedContext {
  variant: AgglayerVariant
  explorerUrl: string
  sharedDiscovery: ProjectDiscovery
  manager: ReturnType<ProjectDiscovery['getContract']>
  bridge: ReturnType<ProjectDiscovery['getContract']>
  rollupModule: ReturnType<ProjectDiscovery['getContract']>
  upgradeDelaySeconds: number
  upgradeDelayString: string
  emergencyActivatedCount: number
  isForcedBatchDisallowed: boolean
  exitWindowRisk: ScalingProject['riskView']['exitWindow']
  discoveries: ProjectDiscovery[]
  finalizationPeriod: number
}

interface VariantSections {
  dataAvailability: ScalingProject['dataAvailability']
  riskView: ScalingProject['riskView']
  technology?: ProjectScalingTechnology
  stateDerivation?: ProjectScalingStateDerivation
  stateValidation?: ProjectScalingStateValidation
  proofSystem?: ProjectScalingProofSystem
  contractsRisks: ProjectRisk[]
  customDa?: ProjectCustomDa
  badges: Badge[]
  reasonsForBeingOther?: ReasonForBeingInOther[]
  zkProgramHashes?: ReturnType<typeof ZK_PROGRAM_HASHES>[]
  architectureImage?: string
}

export function agglayerDAC(template: { dac: DacInfo }): ProjectCustomDa {
  const technology: DaTechnology = {
    description: `
## Architecture
![polygoncdk architecture](/images/da-layer-technology/polygoncdk/architecture.png#center)

Polygon CDK validiums utilize a data availability solution that relies on a Data Availability Committee (DAC) to ensure data integrity and manage off-chain transaction data. 
This architecture comprises the following components:
- **Operator**: A trusted entity that collects transactions, computes hash values for the transaction batch, and then requests and collects signatures from Committee members.
- **Data Availability Committee (DAC)**: A group of nodes responsible for validating batch data against the hash values provided by the operator (sequencer), ensuring the data accurately represents the transactions.
- **PolygonCommittee Contract**: Contract responsible for managing the data committee members list.

Each DAC node independently validates the batch data, ensuring it matches the received hash values. 
Upon successful validation, DAC members store the hash values locally and generate signatures endorsing the batch's integrity. 
The sequencer collects these signatures and submits the transactions batch hash together with the aggregated signature on Ethereum.
The PolygonCommittee contract is used during batch sequencing to verify that the signature posted by the sequencer was signed off by the DAC members stored in the contract.

## DA Bridge Architecture
![polygoncdk bridge architecture](/images/da-bridge-technology/polygoncdk/architectureL2.png#center)

The DA commitments are posted to the destination chain through the sequencer inbox, using the inbox as a DA bridge.
The DA commitment consists of a data availability message provided as transaction input, made up of a byte array containing the signatures and all the addresses of the committee in ascending order.
The sequencer distributes the data and collects signatures from Committee members offchain. Only the DA message is posted by the sequencer to the destination chain inbox (the DA bridge).
A separate contract, the PolygonCommittee contract, is used to manage the committee members list and verify the signatures before accepting the DA commitment.
    `,
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'a malicious committee signs a data availability attestation for an unavailable transaction batch.',
      },
      {
        category: 'Funds can be lost if',
        text: 'the bridge contract or its dependencies receive a malicious code upgrade. There is no delay on code upgrades.',
      },
    ],
    references: [
      {
        title: 'Polygon CDK Validium Documentation',
        url: 'https://docs.polygon.technology/cdk/architecture/cdk-validium/#data-availability-committee-dac',
      },
    ],
  }

  return DAC({
    ...template,
    technology,
    risks: {
      upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(0),
    },
  })
}

export function agglayer(templateInput: AgglayerConfigInput): ScalingProject {
  const config = normalizeConfig(templateInput)
  const context = buildSharedContext(config)

  const variantSections = (() => {
    switch (config.variant) {
      case 'validium':
        return buildValidiumSections(config, context)
      case 'opstack_closed':
        return buildOpstackClosedSections(config, context)
      case 'pessimistic':
      default:
        return buildPessimisticSections(config, context)
    }
  })()

  const permissions = mergePermissions(
    generateDiscoveryDrivenPermissions([config.discovery]),
    config.nonTemplatePermissions ?? {},
  )

  const upgradesAndGovernance =
    config.upgradesAndGovernance ?? buildUpgradesAndGovernance(context)

  return {
    type: 'layer2',
    addedAt: config.addedAt,
    id: ProjectId(config.discovery.projectName),
    capability: config.capability ?? 'universal',
    reviewStatus: config.reviewStatus,
    archivedAt: config.archivedAt,
    ecosystemInfo: { id: ProjectId('agglayer') },
    display: {
      ...config.display,
      upgradesAndGovernanceImage: 'agglayer',
      purposes: config.overridingPurposes ?? [
        'Universal',
        ...(config.additionalPurposes ?? []),
      ],
      architectureImage: variantSections.architectureImage,
      stacks: ['Agglayer CDK'],
      tvsWarning: config.display.tvsWarning,
    },
    proofSystem: variantSections.proofSystem,
    config: {
      associatedTokens: config.associatedTokens,
      escrows: config.nonTemplateEscrows,
      activityConfig: getActivityConfig(
        config.activityConfig,
        config.chainConfig,
        {
          type: 'block',
          startBlock: 1,
        },
      ),
      daTracking: config.nonTemplateDaTracking,
      trackedTxs: config.nonTemplateTrackedTxs,
    },
    chainConfig: config.chainConfig && {
      ...config.chainConfig,
      gasTokens: config.chainConfig?.gasTokens ?? ['ETH'],
    },
    dataAvailability: variantSections.dataAvailability,
    riskView: variantSections.riskView,
    stage: { stage: 'NotApplicable' },
    technology: variantSections.technology,
    stateDerivation: variantSections.stateDerivation,
    stateValidation: variantSections.stateValidation,
    permissions,
    contracts: {
      addresses: generateDiscoveryDrivenContracts([config.discovery]),
      risks: variantSections.contractsRisks,
      ...(variantSections.zkProgramHashes?.length
        ? { zkProgramHashes: variantSections.zkProgramHashes }
        : {}),
    },
    upgradesAndGovernance,
    milestones: config.milestones,
    badges: mergeBadges([BADGES.Infra.Agglayer], variantSections.badges),
    customDa: variantSections.customDa,
    reasonsForBeingOther: variantSections.reasonsForBeingOther,
    scopeOfAssessment: config.scopeOfAssessment,
    discoveryInfo: getDiscoveryInfo(context.discoveries),
  }
}

function normalizeConfig(input: AgglayerConfigInput): AgglayerConfig {
  const variant = resolveVariant(input)

  if (variant === 'pessimistic' || variant === 'opstack_closed') {
    const hasDaProvider =
      'daProvider' in input && (input as AgglayerValidiumConfig).daProvider
    assert(
      !hasDaProvider,
      'Agglayer pessimistic and opstack_closed variants ignore DA providers; remove daProvider or set variant to validium.',
    )
  }

  return {
    ...input,
    variant,
  } as AgglayerConfig
}

function resolveVariant(input: AgglayerConfigInput): AgglayerVariant {
  if (input.variant) {
    return input.variant
  }

  if (input.discovery.hasContract('L1StandardBridge_neutered')) {
    return 'opstack_closed'
  }

  return input.discovery.hasContract('AggchainECDSAMultisig')
    ? 'pessimistic'
    : 'validium'
}

function buildSharedContext(config: AgglayerConfig): SharedContext {
  const explorerUrl = EXPLORER_URLS['ethereum']
  const sharedDiscovery = new ProjectDiscovery('shared-polygon-cdk')
  const rollupModule =
    config.variant === 'validium'
      ? config.discovery.getContract('Validium')
      : config.discovery.getContract('AggchainECDSAMultisig')

  const forcedBatchAddress = rollupModule.values?.forceBatchAddress
  assert(
    forcedBatchAddress !== undefined,
    'Agglayer template requires forceBatchAddress on Validium or AggchainECDSAMultisig.',
  )

  const upgradeDelaySeconds = sharedDiscovery.getContractValue<number>(
    'Timelock',
    'getMinDelay',
  )
  const upgradeDelayString = formatSeconds(upgradeDelaySeconds)
  const exitWindowRisk: ScalingProject['riskView']['exitWindow'] = {
    value: 'None',
    description: `Even though there is a ${upgradeDelayString} Timelock for upgrades, there are no forced transactions and thus no way to exit during operator censorship or downtime.`,
    sentiment: 'bad',
    orderHint: -1,
    warning: {
      value: 'The Security Council can remove the delay on upgrades.',
      sentiment: 'bad',
    },
  }

  return {
    variant: config.variant,
    explorerUrl,
    sharedDiscovery,
    rollupModule,
    bridge: config.discovery.getContract('AgglayerBridge'),
    manager: sharedDiscovery.getContract('AgglayerManager'),
    upgradeDelaySeconds,
    upgradeDelayString,
    emergencyActivatedCount: sharedDiscovery.getContractValue<number>(
      'AgglayerManager',
      'emergencyStateCount',
    ),
    isForcedBatchDisallowed:
      forcedBatchAddress !== '0x0000000000000000000000000000000000000000',
    exitWindowRisk,
    finalizationPeriod: 0,
    discoveries: [config.discovery, sharedDiscovery],
  }
}

function buildValidiumSections(
  config: AgglayerValidiumConfig,
  context: SharedContext,
): VariantSections {
  const dacInfo = getDacInfo(config.discovery)
  const provider = resolveValidiumDaProvider(config, context, dacInfo)

  const customDa =
    config.customDa ??
    (dacInfo !== undefined ? agglayerDAC({ dac: dacInfo }) : undefined)

  const proofSystem =
    config.nonTemplateProofSystem ??
    ({
      type: 'Validity',
      zkCatalogId: ProjectId('zkprover'),
    } satisfies ProjectScalingProofSystem)

  const dataAvailability = {
    layer: provider.layer,
    bridge: provider.bridge,
    mode: DA_MODES.TRANSACTION_DATA,
  }

  const riskView = {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_ST_SN_WRAP,
      executionDelay: context.finalizationPeriod,
    },
    dataAvailability: provider.riskView,
    exitWindow: context.exitWindowRisk,
    sequencerFailure: SEQUENCER_NO_MECHANISM(context.isForcedBatchDisallowed),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  }

  const technology: ProjectScalingTechnology = {
    dataAvailability: config.nonTemplateTechnology?.dataAvailability,
    operator:
      config.nonTemplateTechnology?.operator ??
      buildOperatorTechnology(context),
    forceTransactions:
      config.nonTemplateTechnology?.forceTransactions ??
      buildForceTransactions(context, 'validium'),
    exitMechanisms:
      config.nonTemplateTechnology?.exitMechanisms ??
      buildExitMechanisms(context),
    sequencing: config.nonTemplateTechnology?.sequencing,
    otherConsiderations:
      config.nonTemplateTechnology?.otherConsiderations ??
      buildSharedBridgeConsiderations(context),
  }

  const stateDerivation =
    config.stateDerivation ??
    ({
      nodeSoftware:
        'Node software can be found [here](https://github.com/0xPolygonHermez/zkevm-node) and [here](https://github.com/0xPolygonHermez/cdk-erigon). The cdk-erigon node is the more recent implementation.',
      compressionScheme: 'No compression scheme is used.',
      genesisState:
        'The genesis state, whose corresponding root is accessible as Batch 0 root in the `_legacyBatchNumToStateRoot` variable of AgglayerManager, is available [here](https://github.com/agglayer/agglayer-contracts/blob/0d0e69a6f299e273343461f6350343cf4b048269/deployment/genesis.json).',
      dataFormat:
        'The trusted sequencer batches transactions according to the specifications documented [here](https://docs.polygon.technology/zkEVM/architecture/protocol/transaction-life-cycle/transaction-batching/). Only /signed hashes of batches are posted to the Validium contract.',
    } satisfies ProjectScalingStateDerivation)

  const stateValidation =
    config.stateValidation ??
    ({
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
          references: explorerReferences(context.explorerUrl, [
            {
              title:
                'AgglayerManager.sol - source code, _verifyAndRewardBatches function',
              address: safeGetImplementation(context.manager),
            },
          ]),
        },
      ],
    } satisfies ProjectScalingStateValidation)

  const contractsRisks = [
    CONTRACTS.UPGRADE_WITH_DELAY_RISK_WITH_EXCEPTION(
      context.upgradeDelayString,
      'PolygonSecurityCouncil',
    ),
  ]

  const badges = mergeBadges(
    [BADGES.Stack.CDKErigon, BADGES.VM.EVM, BADGES.DA.DAC],
    config.additionalBadges ?? [],
  )

  return {
    dataAvailability,
    riskView,
    technology,
    stateDerivation,
    stateValidation,
    proofSystem,
    contractsRisks,
    customDa,
    badges,
    reasonsForBeingOther: config.reasonsForBeingOther,
    architectureImage: config.architectureImage ?? 'agglayer-validium',
  }
}

function buildPessimisticRiskView(
  context: SharedContext,
): ScalingProject['riskView'] {
  return {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      description:
        "Currently the system permits invalid state roots. 'Pessimistic' proofs only validate the bridge accounting.",
    },
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: SEQUENCER_NO_MECHANISM(context.isForcedBatchDisallowed),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  }
}

function buildPessimisticSections(
  config: AgglayerPessimisticConfig,
  context: SharedContext,
): VariantSections {
  const riskView = buildPessimisticRiskView(context)

  const dataAvailability = {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.NONE,
    mode: { value: 'None' as const },
  }

  const technology: ProjectScalingTechnology = {
    dataAvailability: config.nonTemplateTechnology?.dataAvailability ?? {
      name: 'Data is not stored on chain',
      description:
        'Transaction data is kept off-chain. Bridge accounting is protected by pessimistic proofs while L2 state transitions are not proven on Ethereum.',
      risks: [],
      references: [],
    },
    operator: config.nonTemplateTechnology?.operator,
    forceTransactions:
      config.nonTemplateTechnology?.forceTransactions ??
      FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
    exitMechanisms:
      config.nonTemplateTechnology?.exitMechanisms ??
      buildExitMechanisms(context),
    sequencing: config.nonTemplateTechnology?.sequencing,
    otherConsiderations:
      config.nonTemplateTechnology?.otherConsiderations ??
      buildSharedBridgeConsiderations(context),
  }

  const contractsRisks = [CONTRACTS.UPGRADE_NO_DELAY_RISK]
  const zkProgramHashes = getPessimisticVKeys(config.discovery).map((el) =>
    ZK_PROGRAM_HASHES(el),
  )

  const badges = mergeBadges(
    [BADGES.DA.CustomDA],
    config.additionalBadges ?? [],
  )

  return {
    dataAvailability,
    riskView,
    technology,
    stateDerivation: config.stateDerivation,
    stateValidation: config.stateValidation,
    proofSystem: config.nonTemplateProofSystem,
    contractsRisks,
    customDa: config.customDa,
    badges,
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
      REASON_FOR_BEING_OTHER.NO_PROOFS,
      ...(config.reasonsForBeingOther ?? []),
    ],
    zkProgramHashes,
    architectureImage: config.architectureImage ?? 'agglayer-pessimistic',
  }
}

function buildOpstackClosedSections(
  config: AgglayerOpstackClosedConfig,
  context: SharedContext,
): VariantSections {
  const baseRiskView = buildPessimisticRiskView(context)
  const riskView = {
    ...baseRiskView,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      ),
      secondLine: formatDelay(HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS),
    },
  }

  const usesBlobs = config.usesEthereumBlobs ?? false
  const dataAvailability = {
    layer: usesBlobs ? DA_LAYERS.ETH_BLOBS_OR_CALLDATA : DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
  }

  const technology: ProjectScalingTechnology = {
    dataAvailability: config.nonTemplateTechnology?.dataAvailability ?? {
      name: 'Data is posted on Ethereum',
      description:
        'Transaction data is posted to Ethereum L1 as compressed calldata or blobs through the OP Stack batch inbox.',
      risks: [],
      references: [],
    },
    operator: config.nonTemplateTechnology?.operator,
    forceTransactions:
      config.nonTemplateTechnology?.forceTransactions ??
      FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
    exitMechanisms:
      config.nonTemplateTechnology?.exitMechanisms ??
      buildExitMechanisms(context),
    sequencing: config.nonTemplateTechnology?.sequencing,
    otherConsiderations:
      config.nonTemplateTechnology?.otherConsiderations ??
      buildSharedBridgeConsiderations(context),
  }

  const contractsRisks = [CONTRACTS.UPGRADE_NO_DELAY_RISK]
  const zkProgramHashes = getPessimisticVKeys(config.discovery).map((el) =>
    ZK_PROGRAM_HASHES(el),
  )

  const badges = mergeBadges(
    [
      usesBlobs ? BADGES.DA.EthereumBlobs : BADGES.DA.EthereumCalldata,
      BADGES.VM.EVM,
    ],
    config.additionalBadges ?? [],
  )

  return {
    dataAvailability,
    riskView,
    technology,
    stateDerivation: config.stateDerivation,
    stateValidation: config.stateValidation,
    proofSystem: config.nonTemplateProofSystem,
    contractsRisks,
    customDa: config.customDa,
    badges,
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.NO_PROOFS,
      ...(config.reasonsForBeingOther ?? []),
    ],
    zkProgramHashes,
    architectureImage: config.architectureImage ?? 'agglayer-opstack_closed',
  }
}

function resolveValidiumDaProvider(
  config: AgglayerValidiumConfig,
  context: SharedContext,
  dacInfo?: DacInfo,
): DAProvider {
  if (config.daProvider !== undefined) {
    return config.daProvider
  }

  if (dacInfo !== undefined) {
    return buildDacProvider(dacInfo)
  }

  throw new Error(
    'Agglayer validium variant requires a daProvider or the PolygonDataCommittee contract in discovery.',
  )
}

function buildDacProvider(dac: DacInfo): DAProvider {
  return {
    layer: DA_LAYERS.DAC,
    bridge: DA_BRIDGES.DAC_MEMBERS({
      requiredSignatures: dac.requiredMembers,
      membersCount: dac.membersCount,
    }),
    riskView: RISK_VIEW.DATA_EXTERNAL_DAC({
      membersCount: dac.membersCount,
      requiredSignatures: dac.requiredMembers,
    }),
  }
}

function getDacInfo(discovery: ProjectDiscovery): DacInfo | undefined {
  if (!discovery.hasContract('PolygonDataCommittee')) {
    return
  }

  return {
    requiredMembers: discovery.getContractValue<number>(
      'PolygonDataCommittee',
      'requiredAmountOfSignatures',
    ),
    membersCount: discovery.getContractValue<number>(
      'PolygonDataCommittee',
      'getAmountOfMembers',
    ),
  }
}

function buildOperatorTechnology(
  context: SharedContext,
): ProjectTechnologyChoice {
  return {
    name: 'The system has a centralized sequencer',
    description:
      'Only a trusted sequencer is allowed to submit transaction batches.',
    risks: [
      FRONTRUNNING_RISK,
      {
        category: 'Funds can be frozen if',
        text: 'the sequencer refuses to include an exit transaction.',
        isCritical: true,
      },
    ],
    references: explorerReferences(context.explorerUrl, [
      {
        title: `${context.rollupModule.name}.sol - source code, onlyTrustedSequencer modifier`,
        address: safeGetImplementation(context.rollupModule),
      },
    ]),
  }
}

function buildForceTransactions(
  context: SharedContext,
  variant: AgglayerVariant,
): ProjectTechnologyChoice {
  return {
    ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
    references:
      variant === 'validium'
        ? [
            {
              title: `${context.rollupModule.name}.sol - source code, forceBatchAddress address`,
              url: `https://etherscan.io/address/${safeGetImplementation(context.rollupModule)}#code`,
            },
          ]
        : [],
  }
}

function buildExitMechanisms(
  context: SharedContext,
): ProjectTechnologyChoice[] {
  return [
    {
      ...EXITS.REGULAR_MESSAGING('zk'),
      references: explorerReferences(context.explorerUrl, [
        {
          title: 'AgglayerBridge.sol - source code, claimAsset function',
          address: safeGetImplementation(context.bridge),
        },
      ]),
    },
  ]
}

function buildSharedBridgeConsiderations(
  context: SharedContext,
): ProjectTechnologyChoice[] {
  return [
    {
      name: 'Shared bridge and Pessimistic Proofs',
      description:
        "Polygon Agglayer uses a shared bridge escrow for Rollups, Validiums and external chains that opt in to participate in interoperability. Each participating chain needs to provide zk proofs to access any assets in the shared bridge. In addition to the full execution proofs that are used for the state validation of Rollups and Validiums, accounting proofs over the bridges state (Polygon calls them 'Pessimistic Proofs') are used by external chains ('cdk-sovereign'). Using the SP1 zkVM by Succinct, projects without a full proof system on Ethereum are able to share the bridge with the zkEVM Agglayer projects.",
      risks: [
        {
          category: 'Funds can be lost if' as const,
          text: 'the accounting proof system for the bridge (pessimistic proofs, SP1) is implemented incorrectly.',
        },
        ...(context.variant === 'pessimistic' ||
        context.variant === 'opstack_closed'
          ? [
              {
                category: 'Funds can be stolen if' as const,
                text: 'the operator manipulates the L2 state, which is not validated on Ethereum.',
                isCritical: true,
              } as const,
            ]
          : []),
      ],
      references: [
        {
          title: 'Pessimistic Proof - Polygon Knowledge Layer',
          url: 'https://docs.polygon.technology/cdk/concepts/pessimistic-proofs',
        },
        {
          title:
            'Etherscan: AgglayerManager.sol - verifyPessimisticTrustedAggregator() function',
          url: `https://etherscan.io/address/${safeGetImplementation(context.manager)}#code#F1#L1300`,
        },
      ],
    },
  ]
}

function buildUpgradesAndGovernance(context: SharedContext): string {
  return `
The regular upgrade process for shared system contracts and L2-specific validium contracts starts at the PolygonAdminMultisig. For the shared contracts, they schedule a transaction that targets the ProxyAdmin via the Timelock, wait for ${context.upgradeDelayString} and then execute the upgrade. An upgrade of the Layer 2 specific validium contract requires first adding a new rollupType through the Timelock and the AgglayerManager (defining the new implementation and verifier contracts). Now that the rollupType is created, either the local admin or the PolygonAdminMultisig can immediately upgrade the local system contracts to it. Chains using pessimistic proofs often have completely sovereign upgrade paths from the ones described here, but the shared contracts still remain relevant to them because they use them as escrow.

The PolygonSecurityCouncil can expedite the upgrade process by declaring an emergency state. This state pauses both the shared bridge and the AgglayerManager and allows for instant upgrades through the timelock. Accordingly, instant upgrades for all system contracts are possible with the cooperation of the SecurityCouncil. The emergency state has been activated ${context.emergencyActivatedCount} time(s) since inception.

Furthermore, the PolygonAdminMultisig is permissioned to manage the shared trusted aggregator (proposer and prover) for all participating Layer 2s, deactivate the emergency state, obsolete rollupTypes and manage operational parameters and fees in the AgglayerManager directly. The local admin of a specific Aggchain can manage their chain by choosing the trusted sequencer, manage forced batches and set the data availability config. For sovereign chains using pessimistic proofs they can manage any proof logic that might be used on top of the minimal pessimistic one. Creating new Layer 2s (of existing rollupType) is outsourced to the PolygonCreateRollupMultisig but can also be done by the PolygonAdminMultisig. Custom non-shared bridge escrows have their custom upgrade admins listed in the permissions section.`
}

function getPessimisticVKeys(discovery: ProjectDiscovery): string[] {
  type ProgramHashDict = Record<string, Record<string, string>[]>
  if (!discovery.hasContract('AgglayerGateway')) {
    return []
  }
  const pessimisticVKeyDict = discovery.getContractValue<ProgramHashDict>(
    'AgglayerGateway',
    'routes',
  )

  return Object.values(pessimisticVKeyDict).flatMap((arr) =>
    arr.map((el) => el['pessimisticVKey']),
  )
}
