import type { EntryParameters } from '@l2beat/discovery'
import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
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
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
  pickWorseRisk,
  sumRisk,
} from '../common'
import { BADGES } from '../common/badges'
import { EXPLORER_URLS } from '../common/explorerUrls'
import { formatChallengePeriod, formatDelay } from '../common/formatDelays'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from '../common/liveness'
import { getStage } from '../common/stages/getStage'
import type { ProjectDiscovery } from '../discovery/ProjectDiscovery'
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
  Milestone,
  ProjectActivityConfig,
  ProjectCustomDa,
  ProjectDaTrackingConfig,
  ProjectEscrow,
  ProjectFinalityConfig,
  ProjectFinalityInfo,
  ProjectLivenessInfo,
  ProjectRisk,
  ProjectScalingCapability,
  ProjectScalingCategory,
  ProjectScalingDa,
  ProjectScalingPurpose,
  ProjectScalingRiskView,
  ProjectScalingScopeOfAssessment,
  ProjectScalingStage,
  ProjectScalingStateDerivation,
  ProjectScalingStateValidation,
  ProjectTechnologyChoice,
  ProjectUpgradeableActor,
  ReasonForBeingInOther,
  TableReadyValue,
} from '../types'
import { getActivityConfig } from './activity'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from './generateDiscoveryDrivenSections'
import { explorerReferences, mergeBadges, safeGetImplementation } from './utils'

export const CELESTIA_DA_PROVIDER: DAProvider = {
  layer: DA_LAYERS.CELESTIA,
  riskView: RISK_VIEW.DATA_CELESTIA(false),
  technology: TECHNOLOGY_DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(false),
  bridge: DA_BRIDGES.NONE,
  badge: BADGES.DA.Celestia,
}

export const EIGENDA_DA_PROVIDER: DAProvider = {
  layer: DA_LAYERS.EIGEN_DA,
  riskView: RISK_VIEW.DATA_EIGENDA(false),
  technology: TECHNOLOGY_DATA_AVAILABILITY.EIGENDA_OFF_CHAIN(false),
  bridge: DA_BRIDGES.NONE,
  badge: BADGES.DA.EigenDA,
}

export function DACHALLENGES_DA_PROVIDER(
  daChallengeWindow: string,
  daResolveWindow: string,
  nodeSourceLink?: string,
  daLayer: DaProjectTableValue = DA_LAYERS.NONE,
): DAProvider {
  return {
    layer: daLayer,
    riskView: RISK_VIEW.DATA_EXTERNAL_CHALLENGES,
    technology: TECHNOLOGY_DATA_AVAILABILITY.DACHALLENGES_OFF_CHAIN(
      daChallengeWindow,
      daResolveWindow,
      nodeSourceLink,
    ),
    bridge: DA_BRIDGES.NONE_WITH_DA_CHALLENGES,
    badge: BADGES.DA.DAC,
  }
}

interface DAProvider {
  layer: DaProjectTableValue
  riskView: TableReadyValue
  technology: ProjectTechnologyChoice
  bridge: TableReadyValue
  badge: Badge
}

interface OpStackConfigCommon {
  capability?: ProjectScalingCapability
  architectureImage?: string
  stateValidationImage?: string
  isArchived?: true
  addedAt: UnixTime
  daProvider?: DAProvider
  customDa?: ProjectCustomDa
  discovery: ProjectDiscovery
  additionalDiscoveries?: { [chain: string]: ProjectDiscovery }
  upgradeability?: {
    upgradableBy?: ProjectUpgradeableActor[]
  }
  l1StandardBridgeEscrow?: EthereumAddress
  l1StandardBridgeTokens?: string[]
  l1StandardBridgePremintedTokens?: string[]
  activityConfig?: ProjectActivityConfig
  genesisTimestamp: UnixTime
  finality?: ProjectFinalityConfig
  l2OutputOracle?: EntryParameters
  disputeGameFactory?: EntryParameters
  portal?: EntryParameters
  stateDerivation?: ProjectScalingStateDerivation
  stateValidation?: ProjectScalingStateValidation
  milestones?: Milestone[]
  nonTemplateEscrows?: ProjectEscrow[]
  nonTemplateExcludedTokens?: string[]
  nonTemplateOptimismPortalEscrowTokens?: string[]
  nonTemplateTrackedTxs?: Layer2TxConfig[]
  nonTemplateTechnology?: Partial<ProjectScalingTechnology>
  associatedTokens?: string[]
  isNodeAvailable?: boolean | 'UnderReview'
  nodeSourceLink?: string
  chainConfig?: ChainConfig
  hasProperSecurityCouncil?: boolean
  usesBlobs?: boolean
  isUnderReview?: boolean
  stage?: ProjectScalingStage
  additionalBadges?: Badge[]
  additionalPurposes?: ProjectScalingPurpose[]
  overridingPurposes?: ProjectScalingPurpose[]
  riskView?: ProjectScalingRiskView
  usingAltVm?: boolean
  reasonsForBeingOther?: ReasonForBeingInOther[]
  display: Omit<ProjectScalingDisplay, 'provider' | 'category' | 'purposes'> & {
    category?: ProjectScalingCategory
  }
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
  scopeOfAssessment?: ProjectScalingScopeOfAssessment
}

export interface OpStackConfigL2 extends OpStackConfigCommon {
  upgradesAndGovernance?: string
  display: Omit<ProjectScalingDisplay, 'provider' | 'category' | 'purposes'> & {
    category?: ProjectScalingDisplay['category']
  }
}

export interface OpStackConfigL3 extends OpStackConfigCommon {
  stackedRiskView?: ProjectScalingRiskView
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
    | 'stack'
    | 'category'
    | 'warning'
  >
} {
  const optimismPortalTokens = [
    'ETH',
    ...(templateVars.nonTemplateOptimismPortalEscrowTokens ?? []),
  ]

  const daProvider = getDAProvider(templateVars, hostChainDA)

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
  const partOfSuperchain = isPartOfSuperchain(templateVars)
  if (partOfSuperchain) {
    architectureImage.push('superchain')
    automaticBadges.push(BADGES.Infra.Superchain)
  }
  if (fraudProofType !== 'None') {
    architectureImage.push('opfp')
  }
  if (fraudProofType === 'Permissionless') {
    architectureImage.push('permissionless')
  }

  const nativeContractRisks: ProjectRisk[] = [
    partOfSuperchain
      ? ({
          category: 'Funds can be stolen if',
          text: `a contract receives a malicious code upgrade. Both regular and emergency upgrades must be approved by both the Security Council and the Foundation. There is no delay on regular upgrades.`,
        } satisfies ProjectRisk)
      : CONTRACTS.UPGRADE_NO_DELAY_RISK,
  ]

  const allDiscoveries = [
    templateVars.discovery,
    ...Object.values(templateVars.additionalDiscoveries ?? {}),
  ]
  return {
    isArchived: templateVars.isArchived,
    id: ProjectId(templateVars.discovery.projectName),
    addedAt: templateVars.addedAt,
    capability: templateVars.capability ?? 'universal',
    isUnderReview: templateVars.isUnderReview ?? false,
    display: {
      purposes: templateVars.overridingPurposes ?? [
        'Universal',
        ...(templateVars.additionalPurposes ?? []),
      ],
      architectureImage:
        templateVars.architectureImage ?? architectureImage.join('-'),
      stateValidationImage:
        (templateVars.stateValidationImage ??
        fraudProofType === 'Permissionless')
          ? 'opfp'
          : undefined,
      stack: 'OP Stack',
      category:
        templateVars.display.category ??
        (postsToEthereum(templateVars) ? 'Optimistic Rollup' : 'Optimium'),
      warning:
        templateVars.display.warning === undefined
          ? 'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.'
          : templateVars.display.warning,
    },
    chainConfig: templateVars.chainConfig && {
      ...templateVars.chainConfig,
      gasTokens: templateVars.chainConfig?.gasTokens ?? ['ETH'],
    },
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
        templateVars.discovery.getEscrowDetails({
          includeInTotal: type === 'layer2',
          address: portal.address,
          tokens: optimismPortalTokens,
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
    technology: getTechnology(templateVars, explorerUrl, daProvider),
    permissions: generateDiscoveryDrivenPermissions(allDiscoveries),
    contracts: {
      addresses: generateDiscoveryDrivenContracts(allDiscoveries),
      risks: nativeContractRisks,
    },
    milestones: templateVars.milestones ?? [],
    badges: mergeBadges(automaticBadges, templateVars.additionalBadges ?? []),
    customDa: templateVars.customDa,
    reasonsForBeingOther: templateVars.reasonsForBeingOther,
    stateDerivation: templateVars.stateDerivation,
    stateValidation: getStateValidation(templateVars),
    riskView: templateVars.riskView ?? getRiskView(templateVars, daProvider),
    stage:
      templateVars.stage ??
      computedStage(templateVars, postsToEthereum(templateVars)),
    dataAvailability: extractDA(daProvider),
    scopeOfAssessment: templateVars.scopeOfAssessment,
  }
}

function getDaTracking(
  templateVars: OpStackConfigCommon,
): ProjectDaTrackingConfig[] | undefined {
  if (templateVars.nonTemplateDaTracking) {
    return templateVars.nonTemplateDaTracking
  }

  const usesBlobs =
    templateVars.usesBlobs ??
    templateVars.discovery.getContractValue<{
      isSequencerSendingBlobTx: boolean
    }>('SystemConfig', 'opStackDA').isSequencerSendingBlobTx

  const sequencerInbox = templateVars.discovery.getContractValue<string>(
    'SystemConfig',
    'sequencerInbox',
  )

  const inboxStartBlock =
    templateVars.discovery.getContractValueOrUndefined<number>(
      'SystemConfig',
      'startBlock',
    ) ?? 0

  const sequencer = templateVars.discovery.getContractValue<string>(
    'SystemConfig',
    'batcherHash',
  )

  return usesBlobs
    ? [
        {
          type: 'ethereum',
          daLayer: ProjectId('ethereum'),
          sinceBlock: inboxStartBlock,
          inbox: sequencerInbox,
          sequencers: [sequencer],
        },
      ]
    : templateVars.celestiaDa
      ? [
          {
            type: 'celestia',
            daLayer: ProjectId('celestia'),
            // TODO: update to value from discovery
            sinceBlock: templateVars.celestiaDa.sinceBlock,
            namespace: templateVars.celestiaDa.namespace,
          },
        ]
      : templateVars.availDa
        ? [
            {
              type: 'avail',
              daLayer: ProjectId('avail'),
              // TODO: update to value from discovery
              sinceBlock: templateVars.availDa.sinceBlock,
              appId: templateVars.availDa.appId,
            },
          ]
        : undefined
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
      warning: templateVars.display.warning,
      liveness: getLiveness(templateVars),
      finality: getFinality(templateVars),
    },
    config: {
      ...common.config,
      trackedTxs: getTrackedTxs(templateVars),
      finality: ifPostsToEthereum(templateVars, templateVars.finality),
    },
    upgradesAndGovernance: templateVars.upgradesAndGovernance,
  }
}

export function opStackL3(templateVars: OpStackConfigL3): ScalingProject {
  const layer2s = require('../processing/layer2s').layer2s as ScalingProject[]
  const hostChain = templateVars.discovery.chain
  const baseChain = layer2s.find((l2) => l2.id === hostChain)
  assert(baseChain, `Could not find base chain ${hostChain} in layer2s`)

  const common = opStackCommon(
    'layer3',
    templateVars,
    baseChain.chainConfig?.explorerUrl,
    hostChainDAProvider(baseChain),
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
    exitWindow: pickWorseRisk(
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

function getStateValidation(
  templateVars: OpStackConfigCommon,
): ProjectScalingStateValidation | undefined {
  if (templateVars.stateValidation !== undefined) {
    return templateVars.stateValidation
  }

  const fraudProofType = getFraudProofType(templateVars)
  switch (fraudProofType) {
    case 'None':
      return undefined
    case 'Permissioned': {
      const maxClockDuration = templateVars.discovery.getContractValue<number>(
        'PermissionedDisputeGame',
        'maxClockDuration',
      )

      const permissionedDisputeGameBonds =
        templateVars.discovery.getContractValue<number[]>(
          'DisputeGameFactory',
          'initBonds',
        )[1] // 1 is for permissioned games!

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

      const oracleChallengePeriod =
        templateVars.discovery.getContractValue<number>(
          'PreimageOracle',
          'challengePeriod',
        )

      return describeOPFP({
        disputeGameBonds: permissionedDisputeGameBonds,
        maxClockDuration: maxClockDuration,
        gameMaxDepth: permissionedGameMaxDepth,
        gameSplitDepth: permissionedGameSplitDepth,
        gameClockExtension: permissionedGameClockExtension,
        oracleChallengePeriod: oracleChallengePeriod,
      })
    }
    case 'Permissionless': {
      const permissionlessDisputeGameBonds =
        templateVars.discovery.getContractValue<number[]>(
          'DisputeGameFactory',
          'initBonds',
        )[0] // 0 is for permissionless games!

      const maxClockDuration = templateVars.discovery.getContractValue<number>(
        'FaultDisputeGame',
        'maxClockDuration',
      )

      const permissionlessGameMaxDepth =
        templateVars.discovery.getContractValue<number>(
          'FaultDisputeGame',
          'maxGameDepth',
        )

      const permissionlessGameSplitDepth =
        templateVars.discovery.getContractValue<number>(
          'FaultDisputeGame',
          'splitDepth',
        )

      const permissionlessGameClockExtension =
        templateVars.discovery.getContractValue<number>(
          'FaultDisputeGame',
          'clockExtension',
        )

      const oracleChallengePeriod =
        templateVars.discovery.getContractValue<number>(
          'PreimageOracle',
          'challengePeriod',
        )

      return describeOPFP({
        disputeGameBonds: permissionlessDisputeGameBonds,
        maxClockDuration: maxClockDuration,
        gameMaxDepth: permissionlessGameMaxDepth,
        gameSplitDepth: permissionlessGameSplitDepth,
        gameClockExtension: permissionlessGameClockExtension,
        oracleChallengePeriod: oracleChallengePeriod,
      })
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
}: {
  disputeGameBonds: number
  maxClockDuration: number
  gameMaxDepth: number
  gameSplitDepth: number
  gameClockExtension: number
  oracleChallengePeriod: number
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
    description:
      'Updates to the system state can be proposed and challenged by anyone who has sufficient funds. If a state root passes the challenge period, it is optimistically considered correct and made actionable for withdrawals.',
    categories: [
      {
        title: 'State root proposals',
        description: `Proposers submit state roots as children of the latest confirmed state root (called anchor state), by calling the \`create\` function in the DisputeGameFactory. A state root can have multiple conflicting children. Each proposal requires a stake, currently set to ${formatEther(
          disputeGameBonds,
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
        description: `Challenges are opened to disprove invalid state roots using bisection games. Each bisection move requires a stake that increases expontentially with the depth of the bisection, with a factor of ${exponentialBondsFactor}. The maximum depth is ${gameMaxDepth}, and reaching it therefore requires a cumulative stake of ${parseFloat(
          formatEther(permissionlessGameFullCost),
        ).toFixed(
          2,
        )} ETH from depth 0. Actors can participate in any challenge by calling the \`defend\` or \`attack\` functions, depending whether they agree or disagree with the latest claim and want to move the bisection game forward. Actors that disagree with the top-level claim are called challengers, and actors that agree are called defenders. Each actor might be involved in multiple (sub-)challenges at the same time, meaning that the protocol operates with [full concurrency](https://medium.com/l2beat/fraud-proof-wars-b0cb4d0f452a). Challengers and defenders alternate in the bisection game, and they pass each other a clock that starts with ${formatSeconds(
          maxClockDuration,
        )}. If a clock expires, the claim is considered defeated if it was countered, or it gets confirmed if uncountered. Since honest parties can inherit clocks from malicious parties that play both as challengers and defenders (see [freeloader claims](https://specs.optimism.io/fault-proof/stage-one/fault-dispute-game.html#freeloader-claims)), if a clock gets inherited with less than ${formatSeconds(
          gameClockExtension,
        )}, it generally gets extended by ${formatSeconds(
          gameClockExtension,
        )} with the exception of ${formatSeconds(
          gameClockExtension * 2,
        )} right before depth ${gameSplitDepth}, and ${formatSeconds(
          oracleChallengePeriod,
        )} right before the last depth. The maximum clock extension that a top level claim can get is therefore ${formatSeconds(
          gameMaxClockExtension,
        )}. Since unconfirmed state roots are independent of one another, users can decide to exit with a subsequent confirmed state root if the previous one is delayed. Winners get the entire losers' stake, meaning that sybils can potentially play against each other at no cost. The final instruction found via the bisection game is then executed onchain in the MIPS one step prover contract who determines the winner. The protocol does not enforce valid bisections, meaning that actors can propose correct initial claims and then provide incorrect midpoints. The protocol can be subject to resource exhaustion attacks ([Spearbit 5.1.3](https://github.com/ethereum-optimism/optimism/blob/develop/docs/security-reviews/2024_08_Fault-Proofs-No-MIPS_Spearbit.pdf)).`,
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
    stateValidation: getRiskViewStateValidation(templateVars),
    exitWindow: getRiskViewExitWindow(templateVars),
    proposerFailure: getRiskViewProposerFailure(templateVars),
    dataAvailability: {
      ...(daProvider === undefined
        ? RISK_VIEW.DATA_ON_CHAIN
        : daProvider.riskView),
    },
    sequencerFailure: {
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
): TableReadyValue {
  const fraudProofType = getFraudProofType(templateVars)

  switch (fraudProofType) {
    case 'None': {
      return {
        ...RISK_VIEW.STATE_NONE,
        secondLine: formatChallengePeriod(getFinalizationPeriod(templateVars)),
      }
    }
    case 'Permissioned': {
      return {
        ...RISK_VIEW.STATE_FP_INT,
        description:
          RISK_VIEW.STATE_FP_INT.description +
          ` Only one entity is currently allowed to propose and submit challenges, as only permissioned games are currently allowed.`,
        sentiment: 'bad',
        secondLine: formatChallengePeriod(getFinalizationPeriod(templateVars)),
      }
    }
    case 'Permissionless': {
      return {
        ...RISK_VIEW.STATE_FP_INT,
        secondLine: formatChallengePeriod(getFinalizationPeriod(templateVars)),
      }
    }
  }
}

function getRiskViewExitWindow(
  templateVars: OpStackConfigCommon,
): TableReadyValue {
  const finalizationPeriod = getFinalizationPeriod(templateVars)

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
  }
}

function computedStage(
  templateVars: OpStackConfigCommon,
  postsToEthereum: boolean,
): ProjectScalingStage {
  if (!postsToEthereum || templateVars.isNodeAvailable === undefined) {
    return { stage: 'NotApplicable' }
  }

  const fraudProofType = getFraudProofType(templateVars)
  const fraudProofMapping: Record<FraudProofType, boolean | null> = {
    None: null,
    Permissioned: false,
    Permissionless: true,
  }

  return getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: templateVars.isNodeAvailable,
      },
      stage1: {
        principle: false,
        stateVerificationOnL1: fraudProofType !== 'None',
        fraudProofSystemAtLeast5Outsiders: fraudProofMapping[fraudProofType],
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp:
          templateVars.hasProperSecurityCouncil ?? null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
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

function getTechnology(
  templateVars: OpStackConfigCommon,
  explorerUrl: string | undefined,
  daProvider: DAProvider | undefined,
): ProjectScalingTechnology {
  const sequencerInbox = EthereumAddress(
    templateVars.discovery.getContractValue('SystemConfig', 'sequencerInbox'),
  )

  const portal = getOptimismPortal(templateVars)

  const usesBlobs =
    templateVars.usesBlobs ??
    templateVars.discovery.getContractValue<{
      isSequencerSendingBlobTx: boolean
    }>('SystemConfig', 'opStackDA').isSequencerSendingBlobTx

  return {
    stateCorrectness: getTechnologyStateCorrectness(templateVars, explorerUrl),
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
      return OPERATOR.CENTRALIZED_OPERATOR
  }
}

function getTechnologyStateCorrectness(
  templateVars: OpStackConfigCommon,
  explorerUrl: string | undefined,
): ProjectTechnologyChoice | undefined {
  if (templateVars.nonTemplateTechnology?.stateCorrectness !== undefined) {
    return templateVars.nonTemplateTechnology.stateCorrectness
  }

  const fraudProofType = getFraudProofType(templateVars)
  switch (fraudProofType) {
    case 'None': {
      const l2OutputOracle =
        templateVars.l2OutputOracle ??
        templateVars.discovery.getContract('L2OutputOracle')

      return {
        name: 'Fraud proofs are not enabled',
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
            title: 'L2OutputOracle.sol - source code, deleteL2Outputs function',
            address: safeGetImplementation(l2OutputOracle),
          },
        ]),
      }
    }
    case 'Permissioned': {
      const disputeGameFactory =
        templateVars.discovery.getContract('DisputeGameFactory')
      const permissionedDisputeGame = templateVars.discovery.getContract(
        'PermissionedDisputeGame',
      )
      return {
        name: 'Fraud proofs ensure state correctness',
        description:
          'After some period of time, the published state root is assumed to be correct. For a certain time period, one of the whitelisted actors can submit a fraud proof that shows that the state was incorrect.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'no validator checks the published state. Fraud proofs assume at least one honest and able validator.',
          },
        ],
        references: explorerReferences(explorerUrl, [
          {
            title:
              'DisputeGameFactory.sol - Etherscan source code, create() function',
            address: safeGetImplementation(disputeGameFactory),
          },
          {
            title:
              'PermissionedDisputeGame.sol - Etherscan source code, attack() function',
            address: permissionedDisputeGame.address,
          },
        ]),
      }
    }
    case 'Permissionless': {
      const disputeGameFactory =
        templateVars.discovery.getContract('DisputeGameFactory')
      const faultDisputeGame =
        templateVars.discovery.getContract('FaultDisputeGame')

      return {
        name: 'Fraud proofs ensure state correctness',
        description:
          'After some period of time, the published state root is assumed to be correct. During the challenge period, anyone is allowed to submit a fraud proof that shows that the state was incorrect.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'no validator checks the published state. Fraud proofs assume at least one honest and able validator.',
          },
        ],
        references: explorerReferences(explorerUrl, [
          {
            title:
              'DisputeGameFactory.sol - Etherscan source code, create() function',
            address: safeGetImplementation(disputeGameFactory),
          },
          {
            title:
              'FaultDisputeGame.sol - Etherscan source code, attack() function',
            address: faultDisputeGame.address,
          },
        ]),
      }
    }
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
          ? 'FaultDisputeGame'
          : 'PermissionedDisputeGame'

      const maxClockDuration = templateVars.discovery.getContractValue<number>(
        disputeGameName,
        'maxClockDuration',
      )

      result.push({
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
        url: 'https://stack.optimism.io/docs/security/forced-withdrawal/',
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
  hostChainDA?: DAProvider,
): DAProvider {
  const postsToCelestia =
    templateVars.usesBlobs ??
    templateVars.discovery.getContractValue<{
      isUsingCelestia: boolean
    }>('SystemConfig', 'opStackDA').isUsingCelestia
  const daProvider =
    templateVars.daProvider ??
    (postsToCelestia ? CELESTIA_DA_PROVIDER : undefined)

  if (daProvider === undefined) {
    assert(
      templateVars.isNodeAvailable !== undefined,
      'isNodeAvailable must be defined if no DA provider is defined',
    )
  }

  if (daProvider === undefined) {
    const usesBlobs =
      templateVars.usesBlobs ??
      templateVars.discovery.getContractValue<{
        isSequencerSendingBlobTx: boolean
      }>('SystemConfig', 'opStackDA').isSequencerSendingBlobTx

    return {
      layer:
        (hostChainDA?.layer ?? usesBlobs)
          ? DA_LAYERS.ETH_BLOBS_OR_CALLDATA
          : DA_LAYERS.ETH_CALLDATA,
      bridge: hostChainDA?.bridge ?? DA_BRIDGES.ENSHRINED,
      badge:
        (hostChainDA?.badge ?? usesBlobs)
          ? BADGES.DA.EthereumBlobs
          : BADGES.DA.EthereumCalldata,
      riskView: RISK_VIEW.DATA_ON_CHAIN,
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

  return ifPostsToEthereum(templateVars, {
    warnings: {
      stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
    },
    explanation: `${
      templateVars.display.name
    } is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
      HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
    )} or until it gets published. The state root gets finalized ${formatSeconds(
      finalizationPeriod,
    )} after it has been posted.`,
  })
}

function getFinality(
  templateVars: OpStackConfigCommon,
): ProjectFinalityInfo | undefined {
  const finalizationPeriod = getFinalizationPeriod(templateVars)

  return ifPostsToEthereum(templateVars, {
    warnings: {
      timeToInclusion: {
        sentiment: 'neutral',
        value:
          "It's assumed that transaction data batches are submitted sequentially.",
      },
    },
    finalizationPeriod: finalizationPeriod,
  })
}

function getTrackedTxs(
  templateVars: OpStackConfigCommon,
): Layer2TxConfig[] | undefined {
  const fraudProofType = getFraudProofType(templateVars)
  const sequencerInbox = EthereumAddress(
    templateVars.discovery.getContractValue('SystemConfig', 'sequencerInbox'),
  )
  const sequencerAddress = EthereumAddress(
    templateVars.discovery.getContractValue('SystemConfig', 'batcherHash'),
  )

  switch (fraudProofType) {
    case 'None': {
      const l2OutputOracle =
        templateVars.l2OutputOracle ??
        templateVars.discovery.getContract('L2OutputOracle')

      return (
        templateVars.nonTemplateTrackedTxs ?? [
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
              address: l2OutputOracle.address,
              selector: '0x9aaab648',
              functionSignature:
                'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
              sinceTimestamp: UnixTime(
                l2OutputOracle.sinceTimestamp ?? templateVars.genesisTimestamp,
              ),
            },
          },
        ]
      )
    }
    case 'Permissioned':
    case 'Permissionless': {
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
            address: disputeGameFactory.address,
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
    templateVars.usesBlobs ??
    templateVars.discovery.getContractValue<{
      isUsingCelestia: boolean
    }>('SystemConfig', 'opStackDA').isUsingCelestia

  const daProvider =
    templateVars.daProvider ??
    (postsToCelestia ? CELESTIA_DA_PROVIDER : undefined)

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
    case 'Permissionless': {
      return templateVars.discovery.getContractValue<number>(
        'OptimismPortal2',
        'proofMaturityDelaySeconds',
      )
    }
  }
}

type FraudProofType = 'None' | 'Permissioned' | 'Permissionless'

function getFraudProofType(templateVars: OpStackConfigCommon): FraudProofType {
  const portal = getOptimismPortal(templateVars)
  if (portal.name === 'OptimismPortal') {
    return 'None'
  }

  const respectedGameType = templateVars.discovery.getContractValue<number>(
    portal.name ?? portal.address,
    'respectedGameType',
  )

  if (respectedGameType === 0) {
    return 'Permissionless'
  } else if (respectedGameType === 1) {
    return 'Permissioned'
  } else {
    throw new Error(`Unexpected respectedGameType = ${respectedGameType}`)
  }
}

function isPartOfSuperchain(templateVars: OpStackConfigCommon): boolean {
  return templateVars.discovery.hasContract('SuperchainConfig')
}

function hostChainDAProvider(hostChain: ScalingProject): DAProvider {
  const DABadge = hostChain.badges?.find((b) => b.type === 'DA')
  assert(DABadge !== undefined, 'Host chain must have data availability badge')
  assert(
    hostChain.technology.dataAvailability !== undefined,
    'Host chain must have technology data availability',
  )
  assert(
    hostChain.dataAvailability !== undefined,
    'Host chain must have data availability',
  )

  return {
    layer: hostChain.dataAvailability.layer,
    bridge: hostChain.dataAvailability.bridge,
    riskView: hostChain.riskView.dataAvailability,
    technology: hostChain.technology.dataAvailability,
    badge: DABadge,
  }
}
