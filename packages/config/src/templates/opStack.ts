import type { EntryParameters } from '@l2beat/discovery'
import {
  assert,
  ChainSpecificAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  type DaProjectTableValue,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  pickWorseRisk,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
  stackExitWindowRisk,
  sumRisk,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { BADGES } from '../common/badges'
import { EXPLORER_URLS } from '../common/explorerUrls'
import { formatDelay } from '../common/formatDelays'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from '../common/liveness'
import { PROGRAM_HASHES } from '../common/programHashes'

import { getAltDaStage } from '../common/stages/getAltDaStage'

import { getRollupStage } from '../common/stages/getRollupStage'
import type { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import type {
  Layer2TxConfig,
  ProjectScalingDisplay,
  ProjectScalingRiskView,
  ProjectScalingTechnology,
  ScalingProject,
} from '../internalTypes'
import type {
  Badge,
  ChainConfig,
  InteropConfig,
  Milestone,
  ProjectActivityConfig,
  ProjectCustomDa,
  ProjectDaTrackingConfig,
  ProjectEcosystemInfo,
  ProjectEscrow,
  ProjectLivenessInfo,
  ProjectReviewStatus,
  ProjectRisk,
  ProjectScalingCapability,
  ProjectScalingContractsProgramHash,
  ProjectScalingDa,
  ProjectScalingProofSystem,
  ProjectScalingPurpose,
  ProjectScalingScopeOfAssessment,
  ProjectScalingStage,
  ProjectScalingStateDerivation,
  ProjectScalingStateValidation,
  ProjectTechnologyChoice,
  ProjectUpgradeableActor,
  ProjectUpgradesAndGovernance,
  ReasonForBeingInOther,
  TableReadyValue,
} from '../types'
import { readMarkdown } from '../utils/readMarkdown'
import { getActivityConfig } from './activity'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from './generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from './getDiscoveryInfo'
import {
  asArray,
  explorerReferences,
  mergeBadges,
  safeGetImplementation,
} from './utils'

export function CELESTIA_DA_PROVIDER(
  fallback?: DaProjectTableValue,
): DAProvider {
  return {
    layer: DA_LAYERS.CELESTIA,
    riskView: RISK_VIEW.DATA_CELESTIA(false),
    technology: TECHNOLOGY_DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(
      false,
      fallback?.value,
    ),
    bridge: DA_BRIDGES.NONE,
    badge: BADGES.DA.Celestia,
    fallback,
  }
}

export function EIGENDA_DA_PROVIDER(
  isUsingDACertVerifier: boolean,
  fallback?: DaProjectTableValue,
): (templateVars: OpStackConfigCommon) => DAProvider {
  return (templateVars: OpStackConfigCommon) => {
    const opStackDA = templateVars.discovery.getContractValue<{
      isUsingEigenDA: string | boolean
    }>('SystemConfig', 'opStackDA')

    const eigenDAConfig = opStackDA.isUsingEigenDA
    const eigenDACertVersion =
      typeof eigenDAConfig === 'string' ? eigenDAConfig : 'v1'

    const bridge =
      isUsingDACertVerifier &&
      (eigenDACertVersion === 'v2' || eigenDACertVersion === 'v3')
        ? {
            value: 'DACert Verifier',
            sentiment: 'warning' as const,
            description: `EigenDA ${eigenDACertVersion.toUpperCase()} certificates are verified by the proof system through the DACert Verifier contract, which validates certificates against operator signatures and stake thresholds.`,
            projectId: ProjectId('eigenda-v2'),
          }
        : DA_BRIDGES.NONE

    return {
      layer: DA_LAYERS.EIGEN_DA,
      riskView: RISK_VIEW.DATA_EIGENDA(
        isUsingDACertVerifier,
        eigenDACertVersion,
      ),
      technology: TECHNOLOGY_DATA_AVAILABILITY.EIGENDA_OFF_CHAIN(
        isUsingDACertVerifier,
        eigenDACertVersion,
        fallback?.value,
      ),
      bridge,
      badge: isUsingDACertVerifier
        ? BADGES.DA.EigenDAVerifier
        : BADGES.DA.EigenDA,
      fallback,
    }
  }
}

export const PRIVATE_DA_PROVIDER: DAProvider = {
  layer: DA_LAYERS.NONE,
  riskView: RISK_VIEW.DATA_EXTERNAL,
  technology: TECHNOLOGY_DATA_AVAILABILITY.GENERIC_OFF_CHAIN,
  bridge: DA_BRIDGES.NONE,
  badge: BADGES.DA.CustomDA,
}

export function DACHALLENGES_DA_PROVIDER(
  daChallengeWindow: string,
  daResolveWindow: string,
  nodeSourceLink?: string,
  daLayer: DaProjectTableValue = DA_LAYERS.NONE,
  fallback?: DaProjectTableValue,
): DAProvider {
  return {
    layer: daLayer,
    riskView: RISK_VIEW.DATA_EXTERNAL_CHALLENGES,
    technology: TECHNOLOGY_DATA_AVAILABILITY.DACHALLENGES_OFF_CHAIN(
      daChallengeWindow,
      daResolveWindow,
      nodeSourceLink,
      fallback?.value,
    ),
    bridge: DA_BRIDGES.NONE_WITH_DA_CHALLENGES,
    badge: BADGES.DA.CustomDA,
    fallback,
  }
}

interface DAProvider {
  layer: DaProjectTableValue
  riskView: TableReadyValue
  technology: ProjectTechnologyChoice
  bridge: TableReadyValue
  badge: Badge
  fallback?: DaProjectTableValue
}

const CLOSED_CHALLENGER_STATE_ROOT_RISK: ProjectRisk = {
  category: 'Funds can be stolen if',
  text: 'no whitelisted challenger disputes an invalid state root before the challenge window expires.',
  isCritical: true,
}

interface OpStackConfigCommon {
  capability?: ProjectScalingCapability
  architectureImage?: string
  stateValidationImage?: string
  archivedAt?: UnixTime
  addedAt: UnixTime
  daProvider?: DAProvider | ((templateVars: OpStackConfigCommon) => DAProvider)
  customDa?: ProjectCustomDa
  discovery: ProjectDiscovery
  additionalDiscoveries?: { [chain: string]: ProjectDiscovery }
  upgradeability?: {
    upgradableBy?: ProjectUpgradeableActor[]
  }
  l1StandardBridgeEscrow?: ChainSpecificAddress
  l1StandardBridgeTokens?: string[]
  l1StandardBridgePremintedTokens?: string[]
  optimismPortalPremintedTokens?: string[]
  activityConfig?: ProjectActivityConfig
  genesisTimestamp: UnixTime
  l2OutputOracle?: EntryParameters
  disputeGameFactory?: EntryParameters
  portal?: EntryParameters
  stateDerivation?: ProjectScalingStateDerivation
  stateValidation?: ProjectScalingStateValidation
  additionalStateValidationReferences?: { title: string; url: string }[]
  kailuaVanguardAppliesToAllProposals?: boolean
  milestones?: Milestone[]
  ecosystemInfo?: ProjectEcosystemInfo
  nonTemplateProofSystem?: ProjectScalingProofSystem
  nonTemplateEscrows?: ProjectEscrow[]
  nonTemplateExcludedTokens?: string[]
  nonTemplateOptimismPortalEscrowTokens?: string[]
  nonTemplateTrackedTxs?: Layer2TxConfig[]
  nonTemplateTechnology?: Partial<ProjectScalingTechnology>
  nonTemplateContractRisks?: ProjectRisk
  nonTemplateProgramHashes?: ProjectScalingContractsProgramHash[]
  nonTemplateZkVerifiers?: ChainSpecificAddress[]
  associatedTokens?: string[]
  isNodeAvailable?: boolean | 'UnderReview'
  nodeSourceLink?: string
  chainConfig?: ChainConfig
  hasProperSecurityCouncil?: boolean
  reviewStatus?: ProjectReviewStatus
  stage?: ProjectScalingStage
  additionalBadges?: Badge[]
  additionalPurposes?: ProjectScalingPurpose[]
  overridingPurposes?: ProjectScalingPurpose[]
  nonTemplateRiskView?: Partial<ProjectScalingRiskView>
  usingAltVm?: boolean
  reasonsForBeingOther?: ReasonForBeingInOther[]
  hasSuperchainScUpgrades?: boolean
  display: Omit<ProjectScalingDisplay, 'provider' | 'category' | 'purposes'>
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
    appIds: string[]
    /* IMPORTANT: Block number on Avail Network */
    sinceBlock: number
  }
  /** Configure to enable custom DA tracking e.g. project that switched DA */
  nonTemplateDaTracking?: ProjectDaTrackingConfig[]
  scopeOfAssessment?: ProjectScalingScopeOfAssessment
  /**
   * Overrides the onchain check for superchain ecosystem
   * Its needed cuz some project are using custom superchain config
   * but still are a part of superchain config due to offchain agreements
   */
  isPartOfSuperchain?: boolean
  // For Stage 1 requirement. In theory could also be determined from discovery and zk catalog
  zkVerifierContractsReproducible?: boolean
  // altDA stage inputs (used when the project is a Validium/Optimium)
  daAttestedByIndependentParty?: boolean
  daVerifierSecureOnL1?: boolean
  daVerifier7DayExitWindow?: boolean
  daVerifier30DayExitWindow?: boolean
  daCommitteeDecentralized?: boolean
  /** Override for the static economic-security check derived from the DA layer. */
  daMechanismEconomicSecurity?: boolean
  daVerifierLink?: string
  proverSourceLink?: string
  securityCouncilReference?: string
  stage1PrincipleDescription?: string
  /** Manual altDA Stage 1 principle verdict (no automation). */
  stage1Principle?: boolean | 'UnderReview'
}

export interface OpStackConfigL2 extends OpStackConfigCommon {
  upgradesAndGovernance?: ProjectUpgradesAndGovernance
  interopConfig?: InteropConfig
  display: Omit<ProjectScalingDisplay, 'provider' | 'category' | 'purposes'>
}

export interface OpStackConfigL3 extends OpStackConfigCommon {
  stackedRiskView?: ProjectScalingRiskView
  hostChain: string
}

function opStackCommon(
  type: ScalingProject['type'],
  templateVars: OpStackConfigCommon,
  explorerUrl: string | undefined,
  hostChainDA?: DAProvider,
): Omit<ScalingProject, 'type' | 'display'> & {
  display: Pick<
    ProjectScalingDisplay,
    | 'stateValidationImage'
    | 'architectureImage'
    | 'purposes'
    | 'stacks'
    | 'warning'
  >
} {
  const optimismPortalTokens = [
    'ETH',
    ...(templateVars.nonTemplateOptimismPortalEscrowTokens ?? []),
  ]

  const daProvider = getDAProvider(templateVars, {
    hostChainDA,
    projectType: type,
  })

  const automaticBadges = templateVars.usingAltVm
    ? [BADGES.Stack.OPStack, daProvider.badge]
    : [BADGES.Stack.OPStack, BADGES.VM.EVM, daProvider.badge]

  const portal = getOptimismPortal(templateVars)
  const l1StandardBridgeEscrow =
    templateVars.l1StandardBridgeEscrow ??
    templateVars.discovery.getContract('L1StandardBridge').address
  const upgradeability = templateVars.upgradeability ?? {
    upgradableBy: [{ name: 'ProxyAdmin', delay: 'no' }],
  }

  const fraudProofType = getFraudProofType(templateVars)

  // archi images defined locally in the project.ts take precedence over this one
  const architectureImage = [
    'opstack',
    postsToEthereum(templateVars) ? 'rollup' : 'optimium',
  ]
  const partOfSuperchainOnchain = isPartOfSuperchainOnchain(templateVars)

  if (hasSuperchainConfig(templateVars)) {
    architectureImage.push('superchain')
  }

  if (templateVars.isPartOfSuperchain || partOfSuperchainOnchain) {
    automaticBadges.push(BADGES.Infra.Superchain)
  }
  if (fraudProofType !== 'None') {
    architectureImage.push('opfp')
  }
  if (fraudProofType === 'Permissionless') {
    architectureImage.push('permissionless')
  }
  if (fraudProofType === 'Kailua') {
    architectureImage.push('kailua')
  }
  if (fraudProofType === 'OpSuccinct' || fraudProofType === 'OpSuccinctFDP') {
    architectureImage.push('opsuccinct')
  }
  if (fraudProofType === 'AggregateProof') {
    architectureImage.push('aggverifier')
  }
  if (fraudProofType === 'Permissioned' && isPreU16(templateVars)) {
    architectureImage.push('preu16')
  }

  const nativeContractRisks: ProjectRisk[] = [
    templateVars.nonTemplateContractRisks ??
      (templateVars.hasSuperchainScUpgrades
        ? ({
            category: 'Funds can be stolen if',
            text: 'a contract receives a malicious code upgrade. Both regular and emergency upgrades must be approved by both the Security Council and the Foundation. There is no delay on regular upgrades.',
          } satisfies ProjectRisk)
        : CONTRACTS.UPGRADE_NO_DELAY_RISK),
  ]

  const allDiscoveries = [
    templateVars.discovery,
    ...Object.values(templateVars.additionalDiscoveries ?? {}),
  ]

  const hasNoProofs = templateVars.reasonsForBeingOther?.some(
    (e) => e.label === REASON_FOR_BEING_OTHER.NO_PROOFS.label,
  )

  return {
    archivedAt: templateVars.archivedAt,
    id: ProjectId(templateVars.discovery.projectName),
    addedAt: templateVars.addedAt,
    capability: templateVars.capability ?? 'universal',
    reviewStatus: templateVars.reviewStatus,
    display: {
      purposes: templateVars.overridingPurposes ?? [
        'Universal',
        ...(templateVars.additionalPurposes ?? []),
      ],
      architectureImage:
        templateVars.architectureImage ?? architectureImage.join('-'),
      stateValidationImage:
        templateVars.stateValidationImage ??
        (fraudProofType === 'Permissionless'
          ? 'opfp'
          : fraudProofType === 'Kailua'
            ? 'kailua'
            : fraudProofType === 'OpSuccinct'
              ? 'opsuccinct'
              : undefined),
      stacks: ['OP Stack'],
      warning:
        templateVars.display.warning === undefined && fraudProofType === 'None'
          ? 'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.'
          : templateVars.display.warning,
    },
    chainConfig: templateVars.chainConfig && {
      ...templateVars.chainConfig,
      gasTokens: templateVars.chainConfig?.gasTokens ?? ['ETH'],
    },
    proofSystem:
      templateVars.nonTemplateProofSystem ??
      (hasNoProofs
        ? undefined
        : fraudProofType === 'OpSuccinct'
          ? {
              type: 'Validity',
              name: 'SP1',
            }
          : fraudProofType === 'OpSuccinctFDP'
            ? {
                type: 'Optimistic',
                name: 'OP Succinct Lite',
                zkCatalogId: ProjectId('sp1hypercube'),
                challengeProtocol: 'Single-step',
              }
            : fraudProofType === 'AggregateProof'
              ? {
                  type: 'Optimistic',
                  name: 'SP1',
                  zkCatalogId: ProjectId('sp1hypercube'),
                  challengeProtocol: 'Single-step',
                }
              : {
                  type: 'Optimistic',
                  name: 'OPFP',
                  challengeProtocol: 'Interactive',
                }),
    config: {
      associatedTokens: templateVars.associatedTokens,
      activityConfig: getActivityConfig(
        templateVars.activityConfig,
        templateVars.chainConfig,
        {
          type: 'block',
          startBlock: 1,
          adjustCount: { type: 'SubtractOne' },
        },
      ),
      escrows: [
        migratedToLockbox(templateVars)
          ? templateVars.discovery.getEscrowDetails({
              includeInTotal: type === 'layer2',
              address: templateVars.discovery.getContract('ETHLockbox').address,
              tokens: optimismPortalTokens,
              premintedTokens: templateVars.optimismPortalPremintedTokens,
              description: `Main escrow for users depositing ${optimismPortalTokens.join(
                ', ',
              )}.`,
              ...upgradeability,
            })
          : templateVars.discovery.getEscrowDetails({
              includeInTotal: type === 'layer2',
              address: portal.address,
              tokens: optimismPortalTokens,
              premintedTokens: templateVars.optimismPortalPremintedTokens,
              description: `Main entry point for users depositing ${optimismPortalTokens.join(
                ', ',
              )}.`,
              ...upgradeability,
            }),
        templateVars.discovery.getEscrowDetails({
          includeInTotal: type === 'layer2',
          address: l1StandardBridgeEscrow,
          tokens: templateVars.l1StandardBridgeTokens ?? '*',
          premintedTokens: templateVars.l1StandardBridgePremintedTokens,
          excludedTokens: templateVars.nonTemplateExcludedTokens,
          description:
            'Main entry point for users depositing ERC20 token that do not require custom gateway.',
          ...upgradeability,
        }),
        ...(templateVars.nonTemplateEscrows ?? []),
      ],
      daTracking: getDaTracking(templateVars),
    },
    ecosystemInfo: templateVars.ecosystemInfo,
    technology: getTechnology(templateVars, explorerUrl, daProvider),
    permissions: generateDiscoveryDrivenPermissions(allDiscoveries),
    contracts: {
      addresses: generateDiscoveryDrivenContracts(allDiscoveries),
      risks: nativeContractRisks,
      programHashes:
        templateVars.nonTemplateProgramHashes ?? getProgramHashes(templateVars),
      zkVerifiers:
        templateVars.nonTemplateZkVerifiers ??
        getOPStackVerifiers(templateVars.discovery),
    },
    milestones: templateVars.milestones ?? [],
    badges: mergeBadges(automaticBadges, templateVars.additionalBadges ?? []),
    customDa: templateVars.customDa,
    reasonsForBeingOther: templateVars.reasonsForBeingOther,
    stateDerivation: templateVars.stateDerivation,
    stateValidation: getStateValidation(templateVars, explorerUrl),
    riskView: getRiskView(templateVars, daProvider),
    stage: templateVars.stage ?? computedStage(templateVars),
    dataAvailability: extractDA(daProvider),
    scopeOfAssessment: templateVars.scopeOfAssessment,
    discoveryInfo: getDiscoveryInfo(allDiscoveries),
  }
}

function getDaTracking(
  templateVars: OpStackConfigCommon,
): ProjectDaTrackingConfig[] | undefined {
  // Return non-template tracking if it exists
  if (templateVars.nonTemplateDaTracking) {
    return templateVars.nonTemplateDaTracking
  }

  const discov = templateVars.discovery

  const usesBlobs =
    templateVars.usesEthereumBlobs ??
    discov.getContractValue<{ isSequencerSendingBlobTx: boolean }>(
      'SystemConfig',
      'opStackDA',
    ).isSequencerSendingBlobTx

  if (usesBlobs) {
    const sequencerInbox = discov.getContractValue<ChainSpecificAddress>(
      'SystemConfig',
      'sequencerInbox',
    )

    const inboxStartBlock =
      discov.getContractValueOrUndefined<number>(
        'SystemConfig',
        'startBlock',
      ) ?? 0

    const sequencer = discov.getContractValue<ChainSpecificAddress>(
      'SystemConfig',
      'batcherHash',
    )

    return [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: inboxStartBlock,
        inbox: ChainSpecificAddress.address(sequencerInbox),
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
        appIds: templateVars.availDa.appIds,
      },
    ]
  }

  return undefined
}

export function opStackL2(templateVars: OpStackConfigL2): ScalingProject {
  const common = opStackCommon(
    'layer2',
    templateVars,
    EXPLORER_URLS['ethereum'],
  )

  return {
    type: 'layer2',
    ...common,
    display: {
      ...common.display,
      ...templateVars.display,
      liveness: getLiveness(templateVars),
    },
    config: {
      ...common.config,
      trackedTxs: getTrackedTxs(templateVars),
    },
    interopConfig: templateVars.interopConfig
      ? {
          description:
            'The canonical or trust-minimized bridge: Each OP stack chain uses the state validation mechanism of the underlying chain for its canonical bridge.',
          ...templateVars.interopConfig,
        }
      : undefined,
    upgradesAndGovernance: templateVars.upgradesAndGovernance,
  }
}

export function opStackL3(templateVars: OpStackConfigL3): ScalingProject {
  const layer2s = require('../processing/layer2s').layer2s as ScalingProject[]
  const hostChain = templateVars.hostChain
  const baseChain = layer2s.find((l2) => l2.id === hostChain)
  assert(baseChain, `Could not find base chain ${hostChain} in layer2s`)

  const hostChainDA = hostChainDAProvider(baseChain)
  const common = opStackCommon(
    'layer3',
    templateVars,
    baseChain.chainConfig?.explorerUrl,
    hostChainDA,
  )

  const stackedRisk = {
    stateValidation: pickWorseRisk(
      common.riskView.stateValidation,
      baseChain.riskView.stateValidation,
    ),
    dataAvailability: pickWorseRisk(
      common.riskView.dataAvailability,
      baseChain.riskView.dataAvailability,
    ),
    exitWindow: stackExitWindowRisk(
      common.riskView.exitWindow,
      baseChain.riskView.exitWindow,
    ),
    sequencerFailure: sumRisk(
      common.riskView.sequencerFailure,
      baseChain.riskView.sequencerFailure,
      RISK_VIEW.SEQUENCER_SELF_SEQUENCE,
    ),
    proposerFailure: sumRisk(
      common.riskView.proposerFailure,
      baseChain.riskView.proposerFailure,
      RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED,
    ),
  }

  return {
    type: 'layer3',
    ...common,
    hostChain: ProjectId(hostChain),
    display: { ...common.display, ...templateVars.display },
    stackedRiskView: templateVars.stackedRiskView ?? stackedRisk,
  }
}

// A real absolute prestate is exactly 32 non-zero bytes. V2 game implementations
// return all-zero (the value lives in clone immutable args), the AnchorStateRegistry
// *FromGame fields resolve to the zero address until a game is anchored, and
// unresolved handler reads come back as non-hex strings; all must be rejected.
function isRealPrestate(value: string | undefined): value is string {
  return (
    value !== undefined &&
    /^0x(?!0+$)[0-9a-f]{64}$/i.test(value) &&
    // v7 (Karst) game args carry a 0xdead0…0 sentinel in the prestate slot when
    // the prestate is not baked into the clone args; it is not a real prestate.
    !/^0xdead0*$/i.test(value)
  )
}

// The factory's gameArgs[1] is the implementation-args blob it appends to every
// permissioned game clone; the absolute prestate is its first 32 bytes. The blob
// is empty ("0x") on chains whose games keep the prestate in the implementation.
function prestateFromGameArgs(
  gameArgs: string | undefined,
): string | undefined {
  return gameArgs?.startsWith('0x') ? gameArgs.slice(0, 66) : undefined
}

function getProgramHashes(
  templateVars: OpStackConfigCommon,
): ProjectScalingContractsProgramHash[] {
  const fraudProofType = getFraudProofType(templateVars)

  switch (fraudProofType) {
    case 'None':
      return []
    case 'Permissioned':
    case 'Permissionless': {
      // When CANNON_KONA (respectedGameType 8, Karst) is the respected game, the
      // active prestate lives only in the factory's type-8 game args (gameArgs[8]);
      // impls return zero. Read only that - falling back to the op-program / anchor
      // candidates would surface the inactive type-0 program as if it were live.
      const portal = getOptimismPortal(templateVars)
      const respectedGameType =
        templateVars.discovery.getContractValueOrUndefined<number>(
          portal.name ?? portal.address,
          'respectedGameType',
        )
      if (respectedGameType === 8) {
        const konaPrestate = templateVars.discovery.hasContract(
          'DisputeGameFactory',
        )
          ? prestateFromGameArgs(
              templateVars.discovery.getContractValueOrUndefined<string>(
                'DisputeGameFactory',
                'game8Args',
              ),
            )
          : undefined
        return isRealPrestate(konaPrestate)
          ? [PROGRAM_HASHES(konaPrestate)]
          : []
      }
      // V2 dispute games store the prestate in clone immutable args, so the
      // implementation returns zero. Try the implementation, then the anchored
      // game clone, then the factory's configured game args (gameArgs[1], which
      // it bakes into every permissioned game). The anchor stays empty until a
      // game resolves. Zero / zero-address / empty forms are skipped.
      const prestateCandidates = [
        templateVars.discovery.getContractValueOrUndefined<string>(
          'PermissionedDisputeGame',
          'absolutePrestate',
        ),
        templateVars.discovery.hasContract('AnchorStateRegistry')
          ? templateVars.discovery.getContractValueOrUndefined<string>(
              'AnchorStateRegistry',
              'absolutePrestateFromGame',
            )
          : undefined,
        templateVars.discovery.hasContract('DisputeGameFactory')
          ? prestateFromGameArgs(
              templateVars.discovery.getContractValueOrUndefined<string>(
                'DisputeGameFactory',
                'permissionedGameArgs',
              ),
            )
          : undefined,
      ]
      const prestate = prestateCandidates.find(isRealPrestate)
      return prestate ? [PROGRAM_HASHES(prestate)] : []
    }
    case 'Kailua': {
      const kailuaProgramHash = templateVars.discovery.getContractValue<string>(
        'KailuaTreasury',
        'FPVM_IMAGE_ID',
      )
      const setBuilderProgramHash = templateVars.discovery.getContractValue<
        string[]
      >('RiscZeroSetVerifier', 'imageInfo')[0]
      return [
        PROGRAM_HASHES(kailuaProgramHash),
        PROGRAM_HASHES(setBuilderProgramHash),
      ]
    }
    case 'KailuaSoon': {
      const kailuaProgramHash = templateVars.discovery.getContractValue<string>(
        'KailuaTreasury',
        'FPVM_IMAGE_ID',
      )
      return [PROGRAM_HASHES(kailuaProgramHash)]
    }
    case 'OpSuccinct': {
      const opSuccinctProgramHashes = [
        templateVars.discovery.getContractValue<string>(
          'OPSuccinctL2OutputOracle',
          'aggregationVkey',
        ),
        templateVars.discovery.getContractValue<string>(
          'OPSuccinctL2OutputOracle',
          'rangeVkeyCommitment',
        ),
      ]

      return opSuccinctProgramHashes.map((el) => PROGRAM_HASHES(el))
    }
    case 'OpSuccinctFDP': {
      const opSuccinctProgramHashes = [
        templateVars.discovery.getContractValue<string>(
          'OPSuccinctFaultDisputeGame',
          'aggregationVkey',
        ),
        templateVars.discovery.getContractValue<string>(
          'OPSuccinctFaultDisputeGame',
          'rangeVkeyCommitment',
        ),
      ]

      return opSuccinctProgramHashes.map((el) => PROGRAM_HASHES(el))
    }
    case 'AggregateProof': {
      const rangeHash =
        templateVars.discovery.getContractValueOrUndefined<string>(
          'AggregateVerifier',
          'ZK_RANGE_HASH',
        )
      const aggregateHash =
        templateVars.discovery.getContractValueOrUndefined<string>(
          'AggregateVerifier',
          'ZK_AGGREGATE_HASH',
        )
      const teeImageHash =
        templateVars.discovery.getContractValueOrUndefined<string>(
          'AggregateVerifier',
          'TEE_IMAGE_HASH',
        )
      // RISC Zero guest that verifies AWS Nitro attestations for TEE signer registration.
      const teeAttestationProgram = templateVars.discovery.hasContract(
        'NitroEnclaveVerifier',
      )
        ? templateVars.discovery.getContractValueOrUndefined<{
            verifierId: string
          }>('NitroEnclaveVerifier', 'zkConfigRiscZero')?.verifierId
        : undefined
      const hashes: string[] = []
      if (rangeHash) hashes.push(rangeHash)
      if (aggregateHash) hashes.push(aggregateHash)
      if (teeImageHash) hashes.push(teeImageHash)
      if (teeAttestationProgram) hashes.push(teeAttestationProgram)
      return hashes.map((h) => PROGRAM_HASHES(h))
    }
  }
}

function programHashesReproducible(
  templateVars: OpStackConfigCommon,
): boolean | null {
  const programHashes =
    templateVars.nonTemplateProgramHashes ?? getProgramHashes(templateVars)
  if (programHashes.length === 0) return null
  if (programHashes.some((h) => h.verificationStatus === 'unsuccessful'))
    return false
  if (programHashes.every((h) => h.verificationStatus === 'successful'))
    return true
  return null
}

function getStateValidation(
  templateVars: OpStackConfigCommon,
  explorerUrl: string | undefined,
): ProjectScalingStateValidation | undefined {
  if (templateVars.stateValidation !== undefined) {
    return templateVars.stateValidation
  }

  const fraudProofType = getFraudProofType(templateVars)
  const additionalRefs = templateVars.additionalStateValidationReferences ?? []
  switch (fraudProofType) {
    case 'None': {
      const l2OutputOracle =
        templateVars.l2OutputOracle ??
        templateVars.discovery.getContract('L2OutputOracle')
      return {
        categories: [
          {
            title: 'No state validation',
            description:
              'OP Stack projects can use the OP fault proof system, already being deployed on some. This project though is not using fault proofs yet and is relying on the honesty of the permissioned Proposer and Challengers to ensure state correctness. The smart contract system permits invalid state roots.',
            risks: [
              {
                category: 'Funds can be stolen if',
                text: 'an invalid state root is submitted to the system.',
                isCritical: true,
              },
            ],
            references: explorerReferences(explorerUrl, [
              {
                title:
                  'L2OutputOracle.sol - source code, deleteL2Outputs function',
                address: safeGetImplementation(l2OutputOracle),
              },
            ]),
          },
        ],
      }
    }
    case 'Permissioned': {
      const maxClockDuration = templateVars.discovery.getContractValue<number>(
        'PermissionedDisputeGame',
        'maxClockDuration',
      )

      const permissionedDisputeGameBonds = getPermissionedGameBond(templateVars)

      const permissionedGameClockExtension =
        templateVars.discovery.getContractValue<number>(
          'PermissionedDisputeGame',
          'clockExtension',
        )

      const permissionedGameMaxDepth =
        templateVars.discovery.getContractValue<number>(
          'PermissionedDisputeGame',
          'maxGameDepth',
        )

      const permissionedGameSplitDepth =
        templateVars.discovery.getContractValue<number>(
          'PermissionedDisputeGame',
          'splitDepth',
        )

      const oracleChallengePeriod = getOracleChallengePeriod(templateVars)

      return describeOPFP({
        disputeGameBonds: permissionedDisputeGameBonds,
        maxClockDuration: maxClockDuration,
        gameMaxDepth: permissionedGameMaxDepth,
        gameSplitDepth: permissionedGameSplitDepth,
        gameClockExtension: permissionedGameClockExtension,
        oracleChallengePeriod: oracleChallengePeriod,
        isPermissionless: false,
      })
    }
    case 'Permissionless': {
      const faultDisputeGame = getFaultDisputeGameName(templateVars)

      const permissionlessDisputeGameBonds =
        getPermissionlessGameBond(templateVars)

      const maxClockDuration = templateVars.discovery.getContractValue<number>(
        faultDisputeGame,
        'maxClockDuration',
      )

      const permissionlessGameMaxDepth =
        templateVars.discovery.getContractValue<number>(
          faultDisputeGame,
          'maxGameDepth',
        )

      const permissionlessGameSplitDepth =
        templateVars.discovery.getContractValue<number>(
          faultDisputeGame,
          'splitDepth',
        )

      const permissionlessGameClockExtension =
        templateVars.discovery.getContractValue<number>(
          faultDisputeGame,
          'clockExtension',
        )

      const oracleChallengePeriod = getOracleChallengePeriod(templateVars)

      return describeOPFP({
        disputeGameBonds: permissionlessDisputeGameBonds,
        maxClockDuration: maxClockDuration,
        gameMaxDepth: permissionlessGameMaxDepth,
        gameSplitDepth: permissionlessGameSplitDepth,
        gameClockExtension: permissionlessGameClockExtension,
        oracleChallengePeriod: oracleChallengePeriod,
        isPermissionless: true,
      })
    }
    case 'Kailua': {
      const kailuaBond = templateVars.discovery.getContractValue<number>(
        'KailuaTreasury',
        'participationBond',
      )
      const proposalOutputCount =
        templateVars.discovery.getContractValue<number>(
          'KailuaTreasury',
          'PROPOSAL_OUTPUT_COUNT',
        )
      const outputBlockSpan = templateVars.discovery.getContractValue<number>(
        'KailuaTreasury',
        'OUTPUT_BLOCK_SPAN',
      )
      const vanguardAdvantage = templateVars.discovery.getContractValue<number>(
        'KailuaTreasury',
        'vanguardAdvantage',
      )
      const disputeGameFinalityDelaySeconds =
        templateVars.discovery.getContractValue<number>(
          'OptimismPortal2',
          'disputeGameFinalityDelaySeconds',
        )
      const maxClockDuration = templateVars.discovery.getContractValue<number>(
        'KailuaGame',
        'MAX_CLOCK_DURATION',
      )
      const vanguardDescription =
        vanguardAdvantage === 0
          ? 'The **Vanguard** is configured with `vanguardAdvantage = 0`, so this advantage is currently disabled (not active) and child proposals are permissionless immediately.'
          : templateVars.kailuaVanguardAppliesToAllProposals
            ? `The **Vanguard** is the only address that can submit any proposal (first child or conflicting sibling) on a parent state root during the \`vanguardAdvantage\` window of ${formatSeconds(vanguardAdvantage)}. Faulty Vanguard proposals can be flagged via ZK fault proofs (\`proveOutputFault\`) but cannot be replaced by an honest sibling, so the chain stalls at that tournament until the Vanguard submits a correct state root.`
            : `The **Vanguard** is a privileged actor who can always make the first child proposal on a parent state root. They can, in the worst case, delay each tournament for up to ${formatSeconds(vanguardAdvantage)} by not making this first proposal. Sibling proposals made after the Vanguard's initial one or after the ${formatSeconds(vanguardAdvantage)} vanguardAdvantage in each tournament are permissionless.`
      return {
        categories: [
          {
            title: 'State root proposals',
            description: readMarkdown(
              'templates/opStack/kailuaStateRootProposals.md',
              {
                kailuaBond: formatEther(kailuaBond),
                proposalOutputCount,
                outputBlockSpan,
                maxClockDuration: formatSeconds(maxClockDuration),
                vanguardDescription,
              },
            ),
            references: [
              {
                title: 'Sequencing - Kailua Docs',
                url: 'https://boundless-xyz.github.io/kailua/design.html#sequencing',
              },
              {
                title: 'Vanguard - Kailua Docs',
                url: 'https://boundless-xyz.github.io/kailua/parameters.html#vanguard-advantage',
              },
            ],
            risks:
              vanguardAdvantage > 604800 // 7d, arbitrary threshold
                ? [
                    {
                      category: 'Funds can be frozen if',
                      text: `the vanguard exploits their vanguard advantage (${formatSeconds(vanguardAdvantage)}), halting the chain until they propose.`,
                    },
                  ]
                : [],
          },
          {
            title: 'Challenges',
            description: readMarkdown('templates/opStack/kailuaChallenges.md', {
              challengeIntro: templateVars.kailuaVanguardAppliesToAllProposals
                ? readMarkdown(
                    'templates/opStack/kailuaChallengeIntroVanguard.md',
                    { maxClockDuration: formatSeconds(maxClockDuration) },
                  )
                : readMarkdown(
                    'templates/opStack/kailuaChallengeIntroDefault.md',
                    { maxClockDuration: formatSeconds(maxClockDuration) },
                  ),
              maxClockDuration: formatSeconds(maxClockDuration),
              proposalOutputCount,
              disputeGameFinalityDelaySeconds: formatSeconds(
                disputeGameFinalityDelaySeconds,
              ),
            }),
            references: [
              {
                url: 'https://boundless-xyz.github.io/kailua/operate.html',
                title: 'How to run a challenger - Boundless Docs',
              },
              {
                url: 'https://boundless-xyz.github.io/kailua/dispute.html',
                title: 'Disputes - Kailua Book',
              },
            ],
          },
          {
            title: 'Validity proofs',
            description: readMarkdown(
              'templates/opStack/kailuaValidityProofs.md',
              { proposalOutputCount },
            ),
            references: [
              {
                url: 'https://boundless-xyz.github.io/kailua/introduction.html',
                title: 'Kailua Proof System - Boundless Docs',
              },
              {
                url: 'https://github.com/risc0/risc0-ethereum/blob/main/contracts/version-management-design.md',
                title: 'Verifier upgrade and deprecation - Kailua Docs',
              },
            ],
            risks: [
              {
                category: 'Funds can be stolen if',
                text: 'the validity proof cryptography is broken or implemented incorrectly.',
              },
              {
                category: 'Funds can be stolen if',
                text: 'no challenger checks the published state.',
              },
              {
                category: 'Funds can be stolen if',
                text: 'the proposer routes proof verification through a malicious or faulty verifier by specifying an unsafe route selector.',
              },
              {
                category: 'Funds can be frozen if',
                text: 'a verifier needed for a given proof is paused by its permissioned owner.',
              },
            ],
          },
        ],
      }
    }
    case 'KailuaSoon': {
      const kailuaBond = templateVars.discovery.getContractValue<number>(
        'KailuaTreasury',
        'participationBond',
      )
      const proposalOutputCount =
        templateVars.discovery.getContractValue<number>(
          'KailuaTreasury',
          'PROPOSAL_OUTPUT_COUNT',
        )
      const outputBlockSpan = templateVars.discovery.getContractValue<number>(
        'KailuaTreasury',
        'OUTPUT_BLOCK_SPAN',
      )
      const disputeGameFinalityDelaySeconds =
        templateVars.discovery.getContractValue<number>(
          'OptimismPortal2',
          'disputeGameFinalityDelaySeconds',
        )
      const maxClockDuration = templateVars.discovery.getContractValue<number>(
        'KailuaGame',
        'MAX_CLOCK_DURATION',
      )
      return {
        categories: [
          {
            title: 'State root proposals',
            description: readMarkdown(
              'templates/opStack/kailuaSoonStateRootProposals.md',
              {
                kailuaBond: formatEther(kailuaBond),
                proposalOutputCount,
                outputBlockSpan,
                maxClockDuration: formatSeconds(maxClockDuration),
              },
            ),
            references: [
              {
                title: "'Sequencing' - Kailua Docs",
                url: 'https://boundless-xyz.github.io/kailua/design.html#sequencing',
              },
            ],
          },
          {
            title: 'Challenges',
            description: readMarkdown(
              'templates/opStack/kailuaSoonChallenges.md',
              {
                maxClockDuration: formatSeconds(maxClockDuration),
                proposalOutputCount,
                disputeGameFinalityDelaySeconds: formatSeconds(
                  disputeGameFinalityDelaySeconds,
                ),
              },
            ),
            references: [
              {
                url: 'https://boundless-xyz.github.io/kailua/dispute.html',
                title: 'Disputes - Kailua Book',
              },
            ],
          },
          {
            title: 'Validity proofs',
            description: readMarkdown(
              'templates/opStack/kailuaValidityProofs.md',
              { proposalOutputCount },
            ),
            references: [
              {
                url: 'https://github.com/soonlabs/kailua-soon',
                title: 'SOON Kailua - GitHub',
              },
              {
                url: 'https://risczero.com/blog/kailua-how-it-works',
                title: 'Risc0 Kailua Docs',
              },
              {
                url: 'https://github.com/risc0/risc0-ethereum/blob/main/contracts/version-management-design.md',
                title: 'Verifier upgrade and deprecation - Kailua Docs',
              },
            ],
            risks: [
              {
                category: 'Funds can be stolen if',
                text: 'the validity proof cryptography is broken or implemented incorrectly.',
              },
              {
                category: 'Funds can be stolen if',
                text: 'no challenger checks the published state.',
              },
              {
                category: 'Funds can be stolen if',
                text: 'the proposer routes proof verification through a malicious or faulty verifier by specifying an unsafe route selector.',
              },
              {
                category: 'Funds can be frozen if',
                text: 'a verifier needed for a given proof is paused by its permissioned owner.',
              },
            ],
          },
        ],
      }
    }
    case 'OpSuccinct': {
      const hasGateway =
        templateVars.discovery.hasContract('SP1VerifierGateway')
      return {
        categories: [
          {
            title: 'Validity proofs',
            description: readMarkdown(
              'templates/opStack/opSuccinctValidityProofs.md',
            ),
            references: [
              {
                url: 'https://succinctlabs.github.io/op-succinct/architecture.html',
                title: 'Op-Succinct architecture',
              },
            ],
            risks: hasGateway
              ? [
                  {
                    category: 'Funds can be stolen if',
                    text: 'in non-optimistic mode, the validity proof cryptography is broken or implemented incorrectly.',
                  },
                  {
                    category: 'Funds can be stolen if',
                    text: 'optimistic mode is enabled and no challenger checks the published state.',
                  },
                  {
                    category: 'Funds can be stolen if',
                    text: 'the proposer routes proof verification through a malicious or faulty verifier by specifying an unsafe route id.',
                  },
                  {
                    category: 'Funds can be frozen if',
                    text: 'the permissioned proposer fails to publish state roots to the L1.',
                  },
                  {
                    category: 'Funds can be frozen if',
                    text: 'in non-optimistic mode, the SP1VerifierGateway is unable to route proof verification to a valid verifier.',
                  },
                ]
              : [
                  {
                    category: 'Funds can be stolen if',
                    text: 'in non-optimistic mode, the validity proof cryptography is broken or implemented incorrectly.',
                  },
                  {
                    category: 'Funds can be stolen if',
                    text: 'optimistic mode is enabled and no challenger checks the published state.',
                  },
                  {
                    category: 'Funds can be frozen if',
                    text: 'the permissioned proposer fails to publish state roots to the L1.',
                  },
                ],
          },
        ],
      }
    }
    case 'OpSuccinctFDP': {
      const maxChallengeDuration =
        templateVars.discovery.getContractValue<number>(
          'OPSuccinctFaultDisputeGame',
          'maxChallengeDuration',
        )
      const maxProveDuration = templateVars.discovery.getContractValue<number>(
        'OPSuccinctFaultDisputeGame',
        'maxProveDuration',
      )
      const proposerBond = templateVars.discovery.getContractValue<number>(
        'DisputeGameFactory',
        'initBondGame42',
      )
      const challengerBond = templateVars.discovery.getContractValue<number>(
        'OPSuccinctFaultDisputeGame',
        'challengerBond',
      )
      return {
        categories: [
          {
            title: 'Fraud proofs',
            description: readMarkdown(
              'templates/opStack/opSuccinctLiteFraudProofs.md',
              {
                proposerBond: formatEther(proposerBond),
                maxChallengeDuration: formatSeconds(maxChallengeDuration),
                challengerBond: formatEther(challengerBond),
                maxProveDuration: formatSeconds(maxProveDuration),
              },
            ),
            references: [
              {
                url: 'https://succinctlabs.github.io/op-succinct/fault_proofs/fault_proof_architecture.html',
                title: 'OP Succinct Lite architecture',
              },
              ...additionalRefs,
            ],
            risks: [
              {
                category: 'Funds can be stolen if',
                text: 'the validity proof cryptography is broken or implemented incorrectly.',
              },
              CLOSED_CHALLENGER_STATE_ROOT_RISK,
              {
                category: 'Funds can be stolen if',
                text: 'the proposer routes proof verification through a malicious or faulty verifier.',
              },
              {
                category: 'Funds can be frozen if',
                text: 'the permissioned proposer fails to publish state roots to the L1.',
              },
            ],
          },
        ],
      }
    }
    case 'AggregateProof': {
      const slowFinalization =
        templateVars.discovery.getContractValueOrUndefined<number>(
          'AggregateVerifier',
          'SLOW_FINALIZATION_DELAY',
        )
      const fastFinalization =
        templateVars.discovery.getContractValueOrUndefined<number>(
          'AggregateVerifier',
          'FAST_FINALIZATION_DELAY',
        )
      const blockInterval =
        templateVars.discovery.getContractValueOrUndefined<number>(
          'AggregateVerifier',
          'BLOCK_INTERVAL',
        )
      const intermediateBlockInterval =
        templateVars.discovery.getContractValueOrUndefined<number>(
          'AggregateVerifier',
          'INTERMEDIATE_BLOCK_INTERVAL',
        )
      const initBond =
        templateVars.discovery.getContractValueOrUndefined<number>(
          'DisputeGameFactory',
          'initBondGame621',
        )
      return {
        categories: [
          {
            title: 'State root proposals',
            description: readMarkdown(
              'templates/opStack/aggregateProofStateRootProposals.md',
              {
                bondNote:
                  initBond !== undefined
                    ? `, posting a bond of ${formatEther(initBond)} ETH`
                    : '',
                blockInterval: blockInterval ?? 'N',
                intermediateBlockInterval: intermediateBlockInterval ?? 'N',
                slowFinalization:
                  slowFinalization !== undefined
                    ? formatSeconds(slowFinalization)
                    : 'the slow finalization delay',
                fastFinalization:
                  fastFinalization !== undefined
                    ? formatSeconds(fastFinalization)
                    : 'the fast finalization delay',
              },
            ),
            references: additionalRefs,
          },
          {
            title: 'Challenges',
            description: readMarkdown(
              'templates/opStack/aggregateProofChallenges.md',
            ),
            references: [],
          },
        ],
      }
    }
  }
}

function describeOPFP({
  disputeGameBonds,
  maxClockDuration,
  gameMaxDepth,
  gameSplitDepth,
  gameClockExtension,
  oracleChallengePeriod,
  isPermissionless,
}: {
  disputeGameBonds: number
  maxClockDuration: number
  gameMaxDepth: number
  gameSplitDepth: number
  gameClockExtension: number
  oracleChallengePeriod: number
  isPermissionless: boolean
}): ProjectScalingStateValidation {
  const exponentialBondsFactor = 1.09493 // hardcoded, from https://specs.optimism.io/fault-proof/stage-one/bond-incentives.html?highlight=1.09493#bond-scaling

  const gameMaxClockExtension =
    gameClockExtension * 2 + // at SPLIT_DEPTH - 1
    oracleChallengePeriod + // at MAX_GAME_DEPTH - 1
    gameClockExtension * (gameMaxDepth - 3) // the rest, excluding also the last depth

  const permissionlessGameFullCost = (() => {
    let cost = 0
    const scaleFactor = 100000
    for (let i = 0; i <= gameMaxDepth; i++) {
      cost += (disputeGameBonds / scaleFactor) * exponentialBondsFactor ** i
    }
    return BigInt(cost) * BigInt(scaleFactor)
  })()

  return {
    description: readMarkdown('templates/opStack/opfpDescription.md', {
      proposers: isPermissionless
        ? 'anyone who has sufficient funds'
        : 'permissioned operators only',
    }),
    categories: [
      {
        title: 'State root proposals',
        description: readMarkdown(
          'templates/opStack/opfpStateRootProposals.md',
          { disputeGameBonds: formatEther(disputeGameBonds) },
        ),
        references: [
          {
            title: 'OP stack specification: Fault Dispute Game',
            url: 'https://specs.optimism.io/fault-proof/stage-one/fault-dispute-game.html#fault-dispute-game',
          },
        ],
        risks: isPermissionless ? [] : [CLOSED_CHALLENGER_STATE_ROOT_RISK],
      },
      {
        title: 'Challenges',
        description: readMarkdown('templates/opStack/opfpChallenges.md', {
          exponentialBondsFactor,
          gameMaxDepth,
          fullGameCost: Number.parseFloat(
            formatEther(permissionlessGameFullCost),
          ).toFixed(2),
          maxClockDuration: formatSeconds(maxClockDuration),
          gameClockExtension: formatSeconds(gameClockExtension),
          doubleGameClockExtension: formatSeconds(gameClockExtension * 2),
          gameSplitDepth,
          oracleChallengePeriod: formatSeconds(oracleChallengePeriod),
          gameMaxClockExtension: formatSeconds(gameMaxClockExtension),
        }),
        references: [
          {
            title: 'Fraud Proof Wars: OPFP',
            url: 'https://medium.com/l2beat/fraud-proof-wars-b0cb4d0f452a',
          },
        ],
      },
    ],
  }
}

function getRiskView(
  templateVars: OpStackConfigCommon,
  daProvider: DAProvider | undefined,
): ProjectScalingRiskView {
  return {
    stateValidation:
      templateVars.nonTemplateRiskView?.stateValidation ??
      getRiskViewStateValidation(templateVars),
    exitWindow:
      templateVars.nonTemplateRiskView?.exitWindow ??
      getRiskViewExitWindow(templateVars),
    proposerFailure:
      templateVars.nonTemplateRiskView?.proposerFailure ??
      getRiskViewProposerFailure(templateVars),
    dataAvailability: templateVars.nonTemplateRiskView?.dataAvailability ?? {
      ...(daProvider === undefined
        ? RISK_VIEW.DATA_ON_CHAIN
        : daProvider.riskView),
    },
    sequencerFailure: templateVars.nonTemplateRiskView?.sequencerFailure ?? {
      // the value is inside the node config, but we have no reference to it
      // so we assume it to be the same value as in other op stack chains
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      ),
      secondLine: formatDelay(HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS),
    },
  }
}

function getRiskViewStateValidation(
  templateVars: OpStackConfigCommon,
): ProjectScalingRiskView['stateValidation'] {
  const fraudProofType = getFraudProofType(templateVars)
  switch (fraudProofType) {
    case 'None': {
      return {
        ...RISK_VIEW.STATE_NONE,
        challengeDelay: getChallengePeriod(templateVars),
      }
    }
    case 'Permissioned': {
      return {
        ...RISK_VIEW.STATE_FP_INT(
          getChallengePeriod(templateVars),
          getExecutionDelay(templateVars),
        ),
        description:
          RISK_VIEW.STATE_FP_INT().description +
          ' Only one entity is currently allowed to propose and submit challenges, as only permissioned games are currently allowed.',
        sentiment: 'bad',
        initialBond: {
          value: formatEther(getPermissionedGameBond(templateVars)),
        },
        permissioned: true,
        defenderAdvantage: 'not-applicable',
      }
    }
    case 'Permissionless': {
      return {
        ...RISK_VIEW.STATE_FP_INT(
          getChallengePeriod(templateVars),
          getExecutionDelay(templateVars),
        ),
        initialBond: {
          value: formatEther(getPermissionlessGameBond(templateVars)),
        },
        permissioned: false,
        // OPFP: bonds scale by `exponentialBondsFactor` (1.09493) per depth,
        // so the resource ratio is exactly that factor — slightly favors the
        // attacker.
        defenderAdvantage: { multiplier: 1 / 1.09493, shape: 'linear' },
      }
    }
    case 'Kailua':
    case 'KailuaSoon': {
      return {
        ...RISK_VIEW.STATE_FP_HYBRID_ZK,
        executionDelay: getExecutionDelay(templateVars),
        challengeDelay: getChallengePeriod(templateVars),
        initialBond: {
          value: formatEther(
            templateVars.discovery.getContractValue<number>(
              'KailuaTreasury',
              'participationBond',
            ),
          ),
        },
        permissioned: false,
        defenderAdvantage: 'not-assessed',
      }
    }
    case 'OpSuccinct': {
      return {
        ...RISK_VIEW.STATE_ZKP_ST_SN_WRAP,
        executionDelay: getFinalizationPeriod(templateVars),
      }
    }
    case 'OpSuccinctFDP': {
      const challengers =
        templateVars.discovery.getContractValueOrUndefined<string[]>(
          'AccessManager',
          'challengers',
        ) ?? []
      return {
        ...RISK_VIEW.STATE_FP_1R_ZK,
        sentiment: 'warning', // whitelist for challengers!
        description:
          RISK_VIEW.STATE_FP_1R_ZK.description +
          (challengers.length >= 5
            ? ' The system currently operates with at least 5 whitelisted challengers external to the team.'
            : ` The system currently operates with a closed set of ${challengers.length} whitelisted challenger${challengers.length === 1 ? '' : 's'}.`),
        executionDelay: getExecutionDelay(templateVars),
        challengeDelay: getChallengePeriod(templateVars),
        initialBond: {
          value: formatEther(
            templateVars.discovery.getContractValue<number>(
              'DisputeGameFactory',
              'initBondGame42',
            ),
          ),
        },
        permissioned: true,
        defenderAdvantage: 'not-applicable',
      }
    }
    case 'AggregateProof': {
      // AggregateVerifier game: optimistic finalization with ZK proof as the
      // dispute mechanism. Classification matches Kailua. Project should layer
      // in TEE-arm specifics via nonTemplateRiskView.stateValidation.
      return {
        ...RISK_VIEW.STATE_FP_HYBRID_ZK,
        executionDelay: getExecutionDelay(templateVars),
        challengeDelay: getChallengePeriod(templateVars),
        initialBond: {
          value: formatEther(
            templateVars.discovery.getContractValue<number>(
              'DisputeGameFactory',
              'initBondGame621',
            ),
          ),
        },
        permissioned: false,
        defenderAdvantage: 'not-assessed',
      }
    }
  }
}

function getRiskViewExitWindow(
  templateVars: OpStackConfigCommon,
): TableReadyValue {
  const finalizationPeriod = getFinalizationPeriod(templateVars)
  if (templateVars.hasSuperchainScUpgrades) {
    return {
      value: 'None',
      description:
        'There is no exit window for users to exit in case of unwanted upgrades as they are initiated by the Security Council with instant upgrade power and without proper notice.',
      sentiment: 'bad',
      orderHint: -finalizationPeriod,
    }
  }
  return RISK_VIEW.EXIT_WINDOW(0, finalizationPeriod)
}

function getRiskViewProposerFailure(
  templateVars: OpStackConfigCommon,
): TableReadyValue {
  const fraudProofType = getFraudProofType(templateVars)
  switch (fraudProofType) {
    case 'None':
      return RISK_VIEW.PROPOSER_CANNOT_WITHDRAW
    case 'Permissioned':
      return RISK_VIEW.PROPOSER_CANNOT_WITHDRAW
    case 'Permissionless':
      return RISK_VIEW.PROPOSER_SELF_PROPOSE_ROOTS
    case 'Kailua': {
      const vanguardAdvantage = templateVars.discovery.getContractValue<number>(
        'KailuaTreasury',
        'vanguardAdvantage',
      )
      const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60
      if (vanguardAdvantage > ONE_YEAR_IN_SECONDS) {
        return RISK_VIEW.PROPOSER_CANNOT_WITHDRAW
      }
      if (vanguardAdvantage === 0) {
        return {
          ...RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED_ZK(
            vanguardAdvantage,
          ),
          description:
            'The primary whitelisted proposer currently has no optimistic advantage (`vanguardAdvantage = 0`), so this privilege is disabled (not active). Anyone can leverage the source available zk prover to prove a fault or a conflicting valid proposal to win against the privileged proposer and/or supply a bond and make a counter proposal immediately.',
        }
      }
      return RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED_ZK(
        vanguardAdvantage,
      )
    }
    case 'KailuaSoon':
      return RISK_VIEW.PROPOSER_SELF_PROPOSE_ROOTS
    case 'OpSuccinct':
    case 'OpSuccinctFDP':
      return RISK_VIEW.PROPOSER_CANNOT_WITHDRAW
    case 'AggregateProof':
      // AggregateVerifier ZK arm is permissionless at the contract level
      // (anyone with a valid SP1 proof can submit). The TEE arm is allowlisted,
      // but proposer-failure is about the open path, which exists here.
      return RISK_VIEW.PROPOSER_SELF_PROPOSE_ROOTS
  }
}

function computedStage(templateVars: OpStackConfigCommon): ProjectScalingStage {
  if (templateVars.isNodeAvailable === undefined) {
    return { stage: 'NotApplicable' }
  }

  const fraudProofType = getFraudProofType(templateVars)
  const fraudProofMapping: Record<FraudProofType, boolean | null> = {
    None: null,
    Permissioned: false,
    Permissionless: true,
    Kailua: true,
    KailuaSoon: true,
    OpSuccinct: null,
    OpSuccinctFDP: null,
    AggregateProof: true,
  }

  if (postsToEthereum(templateVars)) {
    return getRollupStage(
      {
        stage0: {
          callsItselfRollup: true,
          stateRootsPostedToL1: true,
          dataAvailabilityOnL1: true,
          rollupNodeSourceAvailable: templateVars.isNodeAvailable,
          stateVerificationOnL1: fraudProofType !== 'None',
          fraudProofSystemAtLeast5Outsiders: fraudProofMapping[fraudProofType],
        },
        stage1: {
          principle:
            fraudProofType === 'Permissionless' &&
            (templateVars.hasProperSecurityCouncil ?? false),
          usersHave7DaysToExit:
            fraudProofType === 'Permissionless' &&
            (templateVars.hasProperSecurityCouncil ?? false),
          usersCanExitWithoutCooperation:
            fraudProofType === 'Permissionless' ||
            fraudProofType === 'Kailua' ||
            fraudProofType === 'KailuaSoon',
          securityCouncilProperlySetUp:
            templateVars.hasProperSecurityCouncil ?? null,
          noRedTrustedSetups:
            fraudProofType === 'Kailua' || fraudProofType === 'KailuaSoon'
              ? true
              : null,
          programHashesReproducible: programHashesReproducible(templateVars),
          proverSourcePublished:
            fraudProofType === 'Kailua' ||
            fraudProofType === 'KailuaSoon' ||
            fraudProofType === 'OpSuccinct' ||
            fraudProofType === 'OpSuccinctFDP'
              ? true
              : null,
          verifierContractsReproducible:
            templateVars.zkVerifierContractsReproducible ?? null,
        },
        stage2: {
          proofSystemOverriddenOnlyInCaseOfABug:
            fraudProofType === 'None' ? null : false,
          fraudProofSystemIsPermissionless: fraudProofMapping[fraudProofType],
          delayWith30DExitWindow: false,
        },
      },
      {
        rollupNodeLink:
          templateVars.isNodeAvailable === true
            ? (templateVars.nodeSourceLink ??
              'https://github.com/ethereum-optimism/optimism/tree/develop/op-node')
            : '',
      },
    )
  }

  return getAltDaStage(
    {
      stage0: {
        callsItselfValidiumOrOptimium: true,
        stateRootsPostedToL1: true,
        stateVerificationOnL1: fraudProofType !== 'None',
        daAttestedByIndependentParty:
          templateVars.daAttestedByIndependentParty ?? null,
        nodeSourceAvailable: templateVars.isNodeAvailable,
        fraudProofSystemAtLeast5Outsiders: fraudProofMapping[fraudProofType],
      },
      stage1: {
        principle: templateVars.stage1Principle ?? null,
        usersCanExitWithoutCooperation:
          fraudProofType === 'Permissionless' ||
          fraudProofType === 'Kailua' ||
          fraudProofType === 'KailuaSoon',
        usersHave7DaysToExit:
          fraudProofType === 'Permissionless' &&
          (templateVars.hasProperSecurityCouncil ?? false),
        securityCouncilProperlySetUp:
          templateVars.hasProperSecurityCouncil ?? null,
        daVerifierSecureOnL1: templateVars.daVerifierSecureOnL1 ?? null,
        daVerifier7DayExitWindow: templateVars.daVerifier7DayExitWindow ?? null,
        daCommitteeDecentralized: templateVars.daCommitteeDecentralized ?? null,
        noRedTrustedSetups:
          fraudProofType === 'Kailua' || fraudProofType === 'KailuaSoon'
            ? true
            : null,
        proverSourcePublished: templateVars.proverSourceLink ? true : null,
        verifierContractsReproducible:
          templateVars.zkVerifierContractsReproducible ?? null,
        programHashesReproducible: programHashesReproducible(templateVars),
      },
      stage2: {
        fraudProofSystemIsPermissionless: fraudProofMapping[fraudProofType],
        delayWith30DExitWindow: false,
        proofSystemOverriddenOnlyInCaseOfABug:
          fraudProofType === 'None' ? null : false,
        daVerifier30DayExitWindow:
          templateVars.daVerifier30DayExitWindow ?? null,
        daMechanismEconomicSecurity:
          templateVars.daMechanismEconomicSecurity ?? null,
      },
    },
    {
      nodeSourceLink:
        templateVars.isNodeAvailable === true
          ? (templateVars.nodeSourceLink ??
            'https://github.com/ethereum-optimism/optimism/tree/develop/op-node')
          : templateVars.nodeSourceLink,
      proverSourceLink: templateVars.proverSourceLink,
      securityCouncilReference: templateVars.securityCouncilReference,
      stage1PrincipleDescription: templateVars.stage1PrincipleDescription,
      daVerifierLink: templateVars.daVerifierLink,
    },
  )
}

function getTechnology(
  templateVars: OpStackConfigCommon,
  explorerUrl: string | undefined,
  daProvider: DAProvider | undefined,
): ProjectScalingTechnology {
  const sequencerInbox = ChainSpecificAddress.address(
    ChainSpecificAddress(
      templateVars.discovery.getContractValue('SystemConfig', 'sequencerInbox'),
    ),
  )

  const portal = getOptimismPortal(templateVars)

  const usesBlobs =
    templateVars.usesEthereumBlobs ??
    templateVars.discovery.getContractValue<{
      isSequencerSendingBlobTx: boolean
    }>('SystemConfig', 'opStackDA').isSequencerSendingBlobTx

  return {
    dataAvailability: templateVars.nonTemplateTechnology?.dataAvailability ?? {
      ...technologyDA(daProvider, usesBlobs),
      references: [
        ...technologyDA(daProvider, usesBlobs).references,
        {
          title: 'Derivation: Batch submission - OP Mainnet specs',
          url: 'https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/derivation.md#batch-submission',
        },
        ...explorerReferences(explorerUrl, [
          { title: 'BatchInbox - address', address: sequencerInbox },
          {
            title: `${portal.name}.sol - source code, depositTransaction function`,
            address: safeGetImplementation(portal),
          },
        ]),
      ],
    },
    operator: getTechnologyOperator(templateVars, explorerUrl),
    forceTransactions: templateVars.nonTemplateTechnology
      ?.forceTransactions ?? {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
      references: [
        {
          title: 'Sequencing Window - OP Mainnet Specs',
          url: 'https://github.com/ethereum-optimism/optimism/blob/51eeb76efeb32b3df3e978f311188aa29f5e3e94/specs/glossary.md#sequencing-window',
        },
        ...explorerReferences(explorerUrl, [
          {
            title: `${portal.name}.sol - source code, depositTransaction function`,
            address: safeGetImplementation(portal),
          },
        ]),
      ],
    },
    exitMechanisms: getTechnologyExitMechanism(templateVars, explorerUrl),
    otherConsiderations: templateVars.nonTemplateTechnology
      ?.otherConsiderations ?? [
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
    sequencing: templateVars.nonTemplateTechnology?.sequencing,
  }
}

function getTechnologyOperator(
  templateVars: OpStackConfigCommon,
  explorerUrl: string | undefined,
): ProjectTechnologyChoice | undefined {
  if (templateVars.nonTemplateTechnology?.operator !== undefined) {
    return templateVars.nonTemplateTechnology.operator
  }

  const fraudProofType = getFraudProofType(templateVars)
  switch (fraudProofType) {
    case 'None': {
      const l2OutputOracle =
        templateVars.l2OutputOracle ??
        templateVars.discovery.getContract('L2OutputOracle')

      return {
        ...OPERATOR.CENTRALIZED_OPERATOR,
        references: explorerReferences(explorerUrl, [
          {
            title: 'L2OutputOracle.sol - source code, CHALLENGER address',
            address: safeGetImplementation(l2OutputOracle),
          },
          {
            title: 'L2OutputOracle.sol - source code, PROPOSER address',
            address: safeGetImplementation(l2OutputOracle),
          },
        ]),
      }
    }
    case 'Permissioned':
    case 'Permissionless':
    case 'Kailua':
    case 'KailuaSoon':
    case 'OpSuccinct':
    case 'OpSuccinctFDP':
      return OPERATOR.CENTRALIZED_OPERATOR
  }
}

function getTechnologyExitMechanism(
  templateVars: OpStackConfigCommon,
  explorerUrl: string | undefined,
): ProjectTechnologyChoice[] {
  if (templateVars.nonTemplateTechnology?.exitMechanisms !== undefined) {
    return templateVars.nonTemplateTechnology.exitMechanisms
  }

  const result: ProjectTechnologyChoice[] = []

  const portal = getOptimismPortal(templateVars)
  const fraudProofType = getFraudProofType(templateVars)
  switch (fraudProofType) {
    case 'None': {
      const l2OutputOracle =
        templateVars.l2OutputOracle ??
        templateVars.discovery.getContract('L2OutputOracle')

      result.push({
        ...EXITS.REGULAR_MESSAGING(
          'optimistic',
          getFinalizationPeriod(templateVars),
        ),
        references: explorerReferences(explorerUrl, [
          {
            title: `${portal.name}.sol - source code, proveWithdrawalTransaction function`,
            address: safeGetImplementation(portal),
          },
          {
            title: `${portal.name}.sol - source code, finalizeWithdrawalTransaction function`,
            address: safeGetImplementation(portal),
          },
          {
            title: 'L2OutputOracle.sol - source code, PROPOSER check',
            address: safeGetImplementation(l2OutputOracle),
          },
        ]),
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      })
      break
    }
    case 'Permissioned':
    case 'Permissionless': {
      const disputeGameFinalityDelaySeconds =
        templateVars.discovery.getContractValue<number>(
          portal.name ?? portal.address,
          'disputeGameFinalityDelaySeconds',
        )

      const proofMaturityDelaySeconds =
        templateVars.discovery.getContractValue<number>(
          portal.name ?? portal.address,
          'proofMaturityDelaySeconds',
        )

      const disputeGameName =
        fraudProofType === 'Permissionless'
          ? getFaultDisputeGameName(templateVars)
          : 'PermissionedDisputeGame'

      const maxClockDuration = templateVars.discovery.getContractValue<number>(
        disputeGameName,
        'maxClockDuration',
      )

      result.push({
        name: 'Regular exits',
        description: readMarkdown('templates/opStack/regularExits.md', {
          disputeGameFinalityDelaySeconds: formatSeconds(
            disputeGameFinalityDelaySeconds,
          ),
          proofMaturityDelaySeconds: formatSeconds(proofMaturityDelaySeconds),
          challengePeriod: formatSeconds(maxClockDuration),
        }),
        risks: [],
        references: [
          {
            title: `${portal.name}.sol - Etherscan source code, proveWithdrawalTransaction function`,
            url: `https://etherscan.io/address/${safeGetImplementation(
              portal,
            )}#code`,
          },
          {
            title: `${portal.name}.sol - Etherscan source code, finalizeWithdrawalTransaction function`,
            url: `https://etherscan.io/address/${safeGetImplementation(
              portal,
            )}#code`,
          },
        ],
      })
      break
    }
    case 'Kailua':
    case 'KailuaSoon': {
      const disputeGameFinalityDelaySeconds =
        templateVars.discovery.getContractValue<number>(
          portal.name ?? portal.address,
          'disputeGameFinalityDelaySeconds',
        )

      const proofMaturityDelaySeconds =
        templateVars.discovery.getContractValue<number>(
          portal.name ?? portal.address,
          'proofMaturityDelaySeconds',
        )

      const disputeGameName = 'KailuaGame'

      const maxClockDuration = templateVars.discovery.getContractValue<number>(
        disputeGameName,
        'MAX_CLOCK_DURATION',
      )

      result.push({
        name: 'Regular exits',
        description: readMarkdown('templates/opStack/regularExits.md', {
          disputeGameFinalityDelaySeconds: formatSeconds(
            disputeGameFinalityDelaySeconds,
          ),
          proofMaturityDelaySeconds: formatSeconds(proofMaturityDelaySeconds),
          challengePeriod: formatSeconds(maxClockDuration),
        }),
        risks: [],
        references: [
          {
            title: `${portal.name}.sol - Etherscan source code, proveWithdrawalTransaction function`,
            url: `https://etherscan.io/address/${safeGetImplementation(
              portal,
            )}#code`,
          },
          {
            title: `${portal.name}.sol - Etherscan source code, finalizeWithdrawalTransaction function`,
            url: `https://etherscan.io/address/${safeGetImplementation(
              portal,
            )}#code`,
          },
        ],
      })
      break
    }
    case 'OpSuccinct': {
      result.push({
        ...EXITS.REGULAR_MESSAGING('zk', getFinalizationPeriod(templateVars)),
        references: explorerReferences(explorerUrl, [
          {
            title: `${portal.name}.sol - source code, proveWithdrawalTransaction function`,
            address: safeGetImplementation(portal),
          },
          {
            title: `${portal.name}.sol - source code, finalizeWithdrawalTransaction function`,
            address: safeGetImplementation(portal),
          },
        ]),
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      })
      break
    }
    case 'OpSuccinctFDP': {
      const disputeGameFinalityDelaySeconds =
        templateVars.discovery.getContractValue<number>(
          portal.name ?? portal.address,
          'disputeGameFinalityDelaySeconds',
        )

      const proofMaturityDelaySeconds =
        templateVars.discovery.getContractValue<number>(
          portal.name ?? portal.address,
          'proofMaturityDelaySeconds',
        )

      const maxChallengeDuration =
        templateVars.discovery.getContractValue<number>(
          'OPSuccinctFaultDisputeGame',
          'maxChallengeDuration',
        )

      result.push({
        name: 'Regular exits',
        description: readMarkdown('templates/opStack/regularExits.md', {
          disputeGameFinalityDelaySeconds: formatSeconds(
            disputeGameFinalityDelaySeconds,
          ),
          proofMaturityDelaySeconds: formatSeconds(proofMaturityDelaySeconds),
          challengePeriod: formatSeconds(maxChallengeDuration),
        }),
        risks: [],
        references: [
          {
            title: `${portal.name}.sol - Etherscan source code, proveWithdrawalTransaction function`,
            url: `https://etherscan.io/address/${safeGetImplementation(
              portal,
            )}#code`,
          },
          {
            title: `${portal.name}.sol - Etherscan source code, finalizeWithdrawalTransaction function`,
            url: `https://etherscan.io/address/${safeGetImplementation(
              portal,
            )}#code`,
          },
        ],
      })
      break
    }
  }

  result.push({
    ...EXITS.FORCED_MESSAGING('all-messages'),
    references: [
      {
        title: 'Forced withdrawal from an OP Stack blockchain',
        url: 'https://docs.optimism.io/stack/transactions/forced-transaction',
      },
    ],
  })

  return result
}

function extractDA(daProvider: DAProvider): ProjectScalingDa {
  return {
    layer: daProvider.layer,
    bridge: daProvider.bridge,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
  }
}

function technologyDA(
  DA: DAProvider | undefined,
  usesBlobs: boolean | undefined,
): ProjectTechnologyChoice {
  if (DA !== undefined) {
    return DA.technology
  }

  if (usesBlobs) {
    return TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA
  }

  return TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA
}

function getDAProvider(
  templateVars: OpStackConfigCommon,
  options?: {
    hostChainDA?: DAProvider
    projectType?: ScalingProject['type']
  },
): DAProvider {
  const hostChainDA = options?.hostChainDA
  const projectType = options?.projectType ?? 'layer2'
  const postsToCelestia =
    templateVars.usesEthereumBlobs ??
    templateVars.discovery.getContractValue<{
      isUsingCelestia: boolean
    }>('SystemConfig', 'opStackDA').isUsingCelestia

  let daProvider: DAProvider | undefined
  if (typeof templateVars.daProvider === 'function') {
    daProvider = templateVars.daProvider(templateVars)
  } else {
    daProvider =
      templateVars.daProvider ??
      (postsToCelestia ? CELESTIA_DA_PROVIDER() : undefined)
  }

  if (daProvider === undefined) {
    assert(
      templateVars.isNodeAvailable !== undefined,
      'isNodeAvailable must be defined if no DA provider is defined',
    )
  }

  if (daProvider === undefined) {
    const usesBlobs =
      templateVars.usesEthereumBlobs ??
      templateVars.discovery.getContractValue<{
        isSequencerSendingBlobTx: boolean
      }>('SystemConfig', 'opStackDA').isSequencerSendingBlobTx

    return {
      layer:
        hostChainDA?.layer ??
        (usesBlobs ? DA_LAYERS.ETH_BLOBS_OR_CALLDATA : DA_LAYERS.ETH_CALLDATA),
      bridge: hostChainDA?.bridge ?? DA_BRIDGES.ENSHRINED,
      badge:
        hostChainDA?.badge ??
        (usesBlobs ? BADGES.DA.EthereumBlobs : BADGES.DA.EthereumCalldata),
      riskView:
        projectType === 'layer3'
          ? RISK_VIEW.DATA_ON_CHAIN_L3
          : RISK_VIEW.DATA_ON_CHAIN,
      technology: usesBlobs
        ? TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA
        : TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA,
    }
  }

  return daProvider
}

function getLiveness(
  templateVars: OpStackConfigCommon,
): ProjectLivenessInfo | undefined {
  const finalizationPeriod = getFinalizationPeriod(templateVars)
  const fraudProofType = getFraudProofType(templateVars)
  const daProvider = getDAProvider(templateVars)

  // For OpSuccinct chains, provide liveness info regardless of DA provider
  if (fraudProofType === 'OpSuccinct' || fraudProofType === 'OpSuccinctFDP') {
    const isEthereumDA =
      daProvider.layer === DA_LAYERS.ETH_BLOBS_OR_CALLDATA ||
      daProvider.layer === DA_LAYERS.ETH_CALLDATA
    const daDescription = isEthereumDA
      ? 'to the L1'
      : daProvider.layer === DA_LAYERS.EIGEN_DA
        ? 'to EigenDA'
        : 'to an external DA layer'
    const systemDescription =
      fraudProofType === 'OpSuccinct'
        ? isEthereumDA
          ? 'a ZK rollup'
          : 'a Validium'
        : isEthereumDA
          ? 'an optimistic rollup with ZK fault proofs'
          : 'an Optimium with ZK fault proofs'

    return {
      warnings: {
        stateUpdates:
          'Please note, the state is not finalized until the finalization period passes.',
      },
      explanation: `${
        templateVars.display.name
      } is ${systemDescription} that posts transaction data ${daDescription}. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets confirmed ${formatSeconds(
        finalizationPeriod,
      )} after it has been posted.`,
    }
  }

  return ifPostsToEthereum(templateVars, {
    warnings: {
      stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
    },
    explanation: `${
      templateVars.display.name
    } is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
      HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
    )} or until it gets published. The state root is settled ${formatSeconds(
      finalizationPeriod,
    )} after it has been posted.`,
  })
}

function getTrackedTxs(
  templateVars: OpStackConfigCommon,
): Layer2TxConfig[] | undefined {
  if (templateVars.nonTemplateTrackedTxs !== undefined) {
    return templateVars.nonTemplateTrackedTxs
  }

  const fraudProofType = getFraudProofType(templateVars)
  const sequencerInbox = ChainSpecificAddress.address(
    ChainSpecificAddress(
      templateVars.discovery.getContractValue('SystemConfig', 'sequencerInbox'),
    ),
  )
  const sequencerAddress = ChainSpecificAddress.address(
    ChainSpecificAddress(
      templateVars.discovery.getContractValue('SystemConfig', 'batcherHash'),
    ),
  )

  switch (fraudProofType) {
    case 'None': {
      const l2OutputOracle =
        templateVars.l2OutputOracle ??
        templateVars.discovery.getContract('L2OutputOracle')

      return [
        {
          uses: [
            { type: 'liveness', subtype: 'batchSubmissions' },
            { type: 'l2costs', subtype: 'batchSubmissions' },
          ],
          query: {
            formula: 'transfer',
            from: sequencerAddress,
            to: sequencerInbox,
            sinceTimestamp: templateVars.genesisTimestamp,
          },
        },
        {
          uses: [
            { type: 'liveness', subtype: 'stateUpdates' },
            { type: 'l2costs', subtype: 'stateUpdates' },
          ],
          query: {
            formula: 'functionCall',
            address: ChainSpecificAddress.address(l2OutputOracle.address),
            selector: '0x9aaab648',
            functionSignature:
              'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
            sinceTimestamp: UnixTime(
              l2OutputOracle.sinceTimestamp ?? templateVars.genesisTimestamp,
            ),
          },
        },
      ]
    }
    case 'Permissioned':
    case 'Permissionless':
    case 'Kailua': {
      const disputeGameFactory =
        templateVars.disputeGameFactory ??
        templateVars.discovery.getContract('DisputeGameFactory')

      return [
        {
          uses: [
            { type: 'liveness', subtype: 'batchSubmissions' },
            { type: 'l2costs', subtype: 'batchSubmissions' },
          ],
          query: {
            formula: 'transfer',
            from: sequencerAddress,
            to: sequencerInbox,
            sinceTimestamp: templateVars.genesisTimestamp,
          },
        },
        {
          uses: [
            { type: 'liveness', subtype: 'stateUpdates' },
            { type: 'l2costs', subtype: 'stateUpdates' },
          ],
          query: {
            formula: 'functionCall',
            address: ChainSpecificAddress.address(disputeGameFactory.address),
            selector: '0x82ecf2f6',
            functionSignature:
              'function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)',
            sinceTimestamp: templateVars.genesisTimestamp,
          },
        },
      ]
    }
    case 'KailuaSoon': {
      const kailuaTreasury =
        templateVars.discovery.getContract('KailuaTreasury')
      return [
        {
          uses: [
            { type: 'liveness', subtype: 'batchSubmissions' },
            { type: 'l2costs', subtype: 'batchSubmissions' },
          ],
          query: {
            formula: 'transfer',
            from: sequencerAddress,
            to: sequencerInbox,
            sinceTimestamp: templateVars.genesisTimestamp,
          },
        },
        {
          uses: [
            { type: 'liveness', subtype: 'stateUpdates' },
            { type: 'l2costs', subtype: 'stateUpdates' },
          ],
          query: {
            formula: 'functionCall',
            address: ChainSpecificAddress.address(kailuaTreasury.address),
            selector: '0xca0dc973',
            functionSignature:
              'function propose(bytes32 _rootClaim,bytes _extraData)',
            sinceTimestamp: templateVars.genesisTimestamp,
          },
        },
      ]
    }
    case 'OpSuccinct': {
      const l2OutputOracle = templateVars.discovery.getContract(
        'OPSuccinctL2OutputOracle',
      )

      return [
        {
          uses: [
            { type: 'liveness', subtype: 'batchSubmissions' },
            { type: 'l2costs', subtype: 'batchSubmissions' },
          ],
          query: {
            formula: 'transfer',
            from: sequencerAddress,
            to: sequencerInbox,
            sinceTimestamp: templateVars.genesisTimestamp,
          },
        },
        // Multiple OpSuccinct function signatures based on the mode and version
        {
          uses: [
            { type: 'liveness', subtype: 'stateUpdates' },
            { type: 'l2costs', subtype: 'stateUpdates' },
          ],
          query: {
            formula: 'functionCall',
            address: ChainSpecificAddress.address(l2OutputOracle.address),
            selector: '0x9ad84880',
            functionSignature:
              'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, uint256 _l1BlockNumber, bytes _proof)',
            sinceTimestamp: templateVars.genesisTimestamp,
          },
        },
        {
          uses: [
            { type: 'liveness', subtype: 'stateUpdates' },
            { type: 'l2costs', subtype: 'stateUpdates' },
          ],
          query: {
            formula: 'functionCall',
            address: ChainSpecificAddress.address(l2OutputOracle.address),
            selector: '0x59c3e00a', // non-optimistic mode
            functionSignature:
              'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, uint256 _l1BlockNumber, bytes _proof, address _proverAddress)',
            sinceTimestamp: templateVars.genesisTimestamp,
          },
        },
        {
          uses: [
            { type: 'liveness', subtype: 'stateUpdates' },
            { type: 'l2costs', subtype: 'stateUpdates' },
          ],
          query: {
            formula: 'functionCall',
            address: ChainSpecificAddress.address(l2OutputOracle.address),
            selector: '0x9aaab648', // optimistic mode
            functionSignature:
              'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber)',
            sinceTimestamp: templateVars.genesisTimestamp,
          },
        },
        {
          uses: [
            { type: 'liveness', subtype: 'stateUpdates' },
            { type: 'l2costs', subtype: 'stateUpdates' },
          ],
          query: {
            formula: 'functionCall',
            address: ChainSpecificAddress.address(l2OutputOracle.address),
            selector: '0xa4ee9d7b', // non-optimistic mode
            functionSignature:
              'function proposeL2Output(bytes32 _configName, bytes32 _outputRoot, uint256 _l2BlockNumber, uint256 _l1BlockNumber, bytes _proof, address _proverAddress)',
            sinceTimestamp: templateVars.genesisTimestamp,
          },
        },
      ]
    }
    case 'OpSuccinctFDP': {
      const disputeGameFactory =
        templateVars.disputeGameFactory ??
        templateVars.discovery.getContract('DisputeGameFactory')

      return [
        {
          uses: [
            { type: 'liveness', subtype: 'batchSubmissions' },
            { type: 'l2costs', subtype: 'batchSubmissions' },
          ],
          query: {
            formula: 'transfer',
            from: sequencerAddress,
            to: sequencerInbox,
            sinceTimestamp: templateVars.genesisTimestamp,
          },
        },
        {
          uses: [
            { type: 'liveness', subtype: 'stateUpdates' },
            { type: 'l2costs', subtype: 'stateUpdates' },
          ],
          query: {
            formula: 'functionCall',
            address: ChainSpecificAddress.address(disputeGameFactory.address),
            selector: '0x82ecf2f6',
            functionSignature:
              'function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)',
            sinceTimestamp: templateVars.genesisTimestamp,
          },
        },
      ]
    }
  }
}

function postsToEthereum(templateVars: OpStackConfigCommon): boolean {
  const postsToCelestia =
    templateVars.usesEthereumBlobs ??
    templateVars.discovery.getContractValue<{
      isUsingCelestia: boolean
    }>('SystemConfig', 'opStackDA').isUsingCelestia

  const daProvider =
    templateVars.daProvider ??
    (postsToCelestia ? CELESTIA_DA_PROVIDER() : undefined)

  return daProvider === undefined
}

function ifPostsToEthereum<T>(
  templateVars: OpStackConfigCommon,
  value: T,
): T | undefined {
  if (postsToEthereum(templateVars)) {
    return value
  }
}

// The active permissionless game's init bond. Pre-Karst it is initBonds[0] (game
// type 0). After Karst the respected game is CANNON_KONA (type 8) and initBonds[0]
// is zeroed, so the bond lives in the per-type initBondGame8 field.
function getPermissionlessGameBond(templateVars: OpStackConfigCommon): number {
  const portal = getOptimismPortal(templateVars)
  const respectedGameType =
    templateVars.discovery.getContractValueOrUndefined<number>(
      portal.name ?? portal.address,
      'respectedGameType',
    )
  if (respectedGameType === 8) {
    return templateVars.discovery.getContractValue<number>(
      'DisputeGameFactory',
      'initBondGame8',
    )
  }
  return templateVars.discovery.getContractValue<number[]>(
    'DisputeGameFactory',
    'initBonds',
  )[0]
}

// The permissioned game's init bond. v7 DisputeGameFactory_v2 exposes it per-type
// as initBondGame1; older factories expose the legacy initBonds array.
function getPermissionedGameBond(templateVars: OpStackConfigCommon): number {
  const perType = templateVars.discovery.getContractValueOrUndefined<number>(
    'DisputeGameFactory',
    'initBondGame1',
  )
  if (perType !== undefined) return perType
  return templateVars.discovery.getContractValue<number[]>(
    'DisputeGameFactory',
    'initBonds',
  )[1]
}

function getOptimismPortal(templateVars: OpStackConfigCommon): EntryParameters {
  if (templateVars.portal !== undefined) {
    return templateVars.portal
  }

  try {
    return templateVars.discovery.getContract('OptimismPortal')
  } catch {
    return templateVars.discovery.getContract('OptimismPortal2')
  }
}

// V2 dispute games renamed FaultDisputeGame → FaultDisputeGameV2
function getFaultDisputeGameName(templateVars: OpStackConfigCommon): string {
  if (templateVars.discovery.hasContract('FaultDisputeGame')) {
    return 'FaultDisputeGame'
  }
  return 'FaultDisputeGameV2'
}

// V2 dispute games don't discover PreimageOracle (VM address is zero
// in the implementation). The standard challenge period is 86400s.
function getOracleChallengePeriod(templateVars: OpStackConfigCommon): number {
  if (templateVars.discovery.hasContract('PreimageOracle')) {
    return templateVars.discovery.getContractValue<number>(
      'PreimageOracle',
      'challengePeriod',
    )
  }
  // V2: PreimageOracle not discovered (VM is zero in implementation).
  // Read from AnchorStateRegistry's chained handler instead.
  if (templateVars.discovery.hasContract('AnchorStateRegistry')) {
    const fromAnchor =
      templateVars.discovery.getContractValueOrUndefined<number>(
        'AnchorStateRegistry',
        'challengePeriodFromOracle',
      )
    if (fromAnchor !== undefined) return fromAnchor
  }
  return 86400
}

function getFinalizationPeriod(templateVars: OpStackConfigCommon): number {
  const fraudProofType = getFraudProofType(templateVars)

  switch (fraudProofType) {
    case 'None': {
      const l2OutputOracle =
        templateVars.l2OutputOracle ??
        templateVars.discovery.getContract('L2OutputOracle')

      return templateVars.discovery.getContractValue<number>(
        l2OutputOracle.name ?? l2OutputOracle.address,
        'FINALIZATION_PERIOD_SECONDS',
      )
    }
    case 'Permissioned':
    case 'Permissionless':
    case 'Kailua':
    case 'KailuaSoon':
    case 'OpSuccinctFDP':
    case 'AggregateProof': {
      return templateVars.discovery.getContractValue<number>(
        'OptimismPortal2',
        'proofMaturityDelaySeconds',
      )
    }
    case 'OpSuccinct': {
      return templateVars.discovery.getContractValue<number>(
        'OPSuccinctL2OutputOracle',
        'finalizationPeriodSeconds',
      )
    }
  }
}

function getChallengePeriod(templateVars: OpStackConfigCommon): number {
  const fraudProofType = getFraudProofType(templateVars)

  switch (fraudProofType) {
    case 'None': {
      const l2OutputOracle =
        templateVars.l2OutputOracle ??
        templateVars.discovery.getContract('L2OutputOracle')

      return templateVars.discovery.getContractValue<number>(
        l2OutputOracle.name ?? l2OutputOracle.address,
        'FINALIZATION_PERIOD_SECONDS',
      )
    }
    case 'Permissioned': {
      return templateVars.discovery.getContractValue<number>(
        'PermissionedDisputeGame',
        'maxClockDuration',
      )
    }
    case 'Permissionless': {
      return templateVars.discovery.getContractValue<number>(
        getFaultDisputeGameName(templateVars),
        'maxClockDuration',
      )
    }
    case 'Kailua':
    case 'KailuaSoon': {
      return templateVars.discovery.getContractValue<number>(
        'KailuaGame',
        'MAX_CLOCK_DURATION',
      )
    }
    case 'OpSuccinct': {
      return templateVars.discovery.getContractValue<number>(
        'OPSuccinctL2OutputOracle',
        'finalizationPeriodSeconds',
      )
    }
    case 'OpSuccinctFDP': {
      return templateVars.discovery.getContractValue<number>(
        'OPSuccinctFaultDisputeGame',
        'maxChallengeDuration',
      )
    }
    case 'AggregateProof': {
      // Worst-case challenge window: single-proof resolution. With both arms
      // committed the resolution drops to FAST_FINALIZATION_DELAY (1d), but the
      // risk view shows the conservative bound a challenger has to act within.
      return templateVars.discovery.getContractValue<number>(
        'AggregateVerifier',
        'SLOW_FINALIZATION_DELAY',
      )
    }
  }
}

function getExecutionDelay(
  templateVars: OpStackConfigCommon,
): number | undefined {
  const fraudProofType = getFraudProofType(templateVars)
  const portal = getOptimismPortal(templateVars)
  switch (fraudProofType) {
    case 'Permissioned':
    case 'Permissionless':
    case 'Kailua':
    case 'KailuaSoon':
    case 'OpSuccinctFDP':
    case 'AggregateProof': {
      return templateVars.discovery.getContractValue<number>(
        portal.name ?? portal.address,
        'disputeGameFinalityDelaySeconds',
      )
    }
    default:
      return undefined
  }
}

type FraudProofType =
  | 'None'
  | 'Permissioned'
  | 'Permissionless'
  | 'Kailua'
  | 'KailuaSoon'
  | 'OpSuccinct'
  | 'OpSuccinctFDP'
  | 'AggregateProof'

function getFraudProofType(templateVars: OpStackConfigCommon): FraudProofType {
  const portal = getOptimismPortal(templateVars)

  // Legacy OptimismPortal doesn't have dispute games
  if (portal.name === 'OptimismPortal') {
    if (templateVars.discovery.hasContract('OPSuccinctL2OutputOracle')) {
      return 'OpSuccinct'
    }
    return 'None'
  }

  // OptimismPortal2 uses dispute games - check respectedGameType
  const respectedGameType = templateVars.discovery.getContractValue<number>(
    portal.name ?? portal.address,
    'respectedGameType',
  )

  if (respectedGameType === 0) {
    return 'Permissionless'
  }
  // 8 = CANNON_KONA (Karst): permissionless fault proof, same trust model as
  // type 0 (kona-client Rust program instead of op-program).
  if (respectedGameType === 8) {
    return 'Permissionless'
  }
  if (respectedGameType === 1) {
    return 'Permissioned'
  }
  if (respectedGameType === 6) {
    return 'OpSuccinct'
  }
  if (respectedGameType === 1337) {
    return 'Kailua'
  }
  if (respectedGameType === 2000) {
    return 'KailuaSoon'
  }
  if (respectedGameType === 42) {
    return 'OpSuccinctFDP'
  }
  if (respectedGameType === 621) {
    return 'AggregateProof'
  }
  throw new Error(`Unexpected respectedGameType = ${respectedGameType}`)
}

function isPartOfSuperchainOnchain(templateVars: OpStackConfigCommon): boolean {
  if (!templateVars.discovery.hasContract('SuperchainConfig')) {
    return false
  }

  // Some chains are not part of superchain, but they deploy their own version of the superchain config
  // We need to check if the chain is part of superchain by checking the address of the superchain config
  return (
    templateVars.discovery.getContract('SuperchainConfig').address ===
    'eth:0x95703e0982140D16f8ebA6d158FccEde42f04a4C'
  )
}

function hasSuperchainConfig(templateVars: OpStackConfigCommon): boolean {
  return templateVars.discovery.hasContract('SuperchainConfig')
}

function migratedToLockbox(templateVars: OpStackConfigCommon): boolean {
  return templateVars.discovery.hasContract('ETHLockbox')
}

// U16 (Optimism upgrade, July 2025) moved blacklistDisputeGame() from
// OptimismPortal2 to AnchorStateRegistry.
function isPreU16(templateVars: OpStackConfigCommon): boolean {
  if (!templateVars.discovery.hasContract('AnchorStateRegistry')) return true
  const asr = templateVars.discovery.getContract('AnchorStateRegistry')
  const impl =
    (asr.values?.$implementation as string | undefined) ??
    asr.address.toString()
  const discoveries =
    templateVars.discovery.configReader.readDiscoveryWithReferences(
      templateVars.discovery.projectName,
    )
  return !discoveries.some((d) =>
    d.abis?.[impl]?.some((sig) =>
      sig.startsWith('function blacklistDisputeGame('),
    ),
  )
}

function hostChainDAProvider(hostChain: ScalingProject): DAProvider {
  const DABadge = hostChain.badges?.find((b) => b.type === 'DA')
  assert(DABadge !== undefined, 'Host chain must have data availability badge')
  assert(
    hostChain.technology?.dataAvailability !== undefined,
    'Host chain must have technology data availability',
  )

  const hostChainDAs = asArray(hostChain.dataAvailability)
  const hostChainDaTechs = asArray(hostChain.technology.dataAvailability)
  assert(
    hostChainDAs.length === 1 && hostChainDaTechs.length === 1,
    'Only exactly one DA on the host chain is currently supported',
  )
  const hostDA = hostChainDAs[0]
  assert(hostDA !== undefined, 'Host chain must have data availability')
  const hostDaTech = hostChainDaTechs[0]
  assert(
    hostDaTech !== undefined,
    'Host chain must have data availability technology assigned',
  )

  return {
    layer: hostDA.layer,
    bridge: hostDA.bridge,
    riskView: hostChain.riskView.dataAvailability,
    technology: hostDaTech,
    badge: DABadge,
  }
}

// returns addresses of all active verifiers on SP1VerifierGateway in a given discovery
export function getSP1Verifiers(
  discovery: ProjectDiscovery,
): ChainSpecificAddress[] {
  const activeVerifiers = discovery.getContractValue<
    { selector: string; verifier: ChainSpecificAddress }[]
  >('SP1VerifierGateway', 'activeVerifiers')
  return activeVerifiers.map((el) => el.verifier)
}

function getOPStackVerifiers(
  discovery: ProjectDiscovery,
): ChainSpecificAddress[] {
  if (discovery.hasContract('SP1VerifierGateway')) {
    return getSP1Verifiers(discovery)
  }
  // kailua cases look more diverse and challenging to automate. Use nonTemplateZkVerifiers
  return []
}
