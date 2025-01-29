import type { ContractParameters } from '@l2beat/discovery-types'
import {
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import { ethereum } from '../../../chains/ethereum'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
  addSentimentToDataAvailability,
  pickWorseRisk,
  sumRisk,
} from '../../../common'
import {
  formatChallengePeriod,
  formatDelay,
} from '../../../common/formatDelays'
import type { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import { HARDCODED } from '../../../discovery/values/hardcoded'
import type {
  ChainConfig,
  DataAvailabilityBridge,
  DataAvailabilityLayer,
  KnowledgeNugget,
  Milestone,
  ProjectDataAvailability,
  ProjectEscrow,
  ProjectTechnologyChoice,
  ReasonForBeingInOther,
  ScalingProject,
  ScalingProjectCapability,
  ScalingProjectCategory,
  ScalingProjectContract,
  ScalingProjectDisplay,
  ScalingProjectPermission,
  ScalingProjectPurpose,
  ScalingProjectRisk,
  ScalingProjectRiskView,
  ScalingProjectRiskViewEntry,
  ScalingProjectStateDerivation,
  ScalingProjectStateValidation,
  ScalingProjectTechnology,
  TransactionApiConfig,
} from '../../../types'
import { Badge, type BadgeId } from '../../badges'
import type { DacDaLayer } from '../../da-beat/types'
import type { Layer3 } from '../../layer3s/types'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from '../common/liveness'
import { getStage } from '../common/stages/getStage'
import type { StageConfig } from '../common/stages/types'
import type {
  Layer2,
  Layer2Display,
  Layer2FinalityConfig,
  Layer2FinalityDisplay,
  Layer2TxConfig,
  ProjectLivenessInfo,
} from '../types'
import { generateDiscoveryDrivenSections } from './generateDiscoveryDrivenSections'
import { explorerReferences, mergeBadges, safeGetImplementation } from './utils'

export const CELESTIA_DA_PROVIDER: DAProvider = {
  layer: DA_LAYERS.CELESTIA,
  riskView: RISK_VIEW.DATA_CELESTIA(false),
  technology: TECHNOLOGY_DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(false),
  bridge: DA_BRIDGES.NONE,
  badge: Badge.DA.Celestia,
}

export const EIGENDA_DA_PROVIDER: DAProvider = {
  layer: DA_LAYERS.EIGEN_DA,
  riskView: RISK_VIEW.DATA_EIGENDA(false),
  technology: TECHNOLOGY_DATA_AVAILABILITY.EIGENDA_OFF_CHAIN(false),
  bridge: DA_BRIDGES.NONE,
  badge: Badge.DA.EigenDA,
}

export function DACHALLENGES_DA_PROVIDER(
  daChallengeWindow: string,
  daResolveWindow: string,
  nodeSourceLink?: string,
  daLayer: DataAvailabilityLayer = DA_LAYERS.NONE,
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
    badge: Badge.DA.DAC,
  }
}

interface DAProvider {
  layer: DataAvailabilityLayer
  fallback?: DataAvailabilityLayer
  riskView: ScalingProjectRiskViewEntry
  technology: ProjectTechnologyChoice
  bridge: DataAvailabilityBridge
  badge: BadgeId
}

interface OpStackConfigCommon {
  capability?: ScalingProjectCapability
  architectureImage?: string
  stateValidationImage?: string
  isArchived?: true
  addedAt: UnixTime
  daProvider?: DAProvider
  dataAvailabilitySolution?: DacDaLayer
  discovery: ProjectDiscovery
  additionalDiscoveries?: { [chain: string]: ProjectDiscovery }
  upgradeability?: {
    upgradableBy: string[] | undefined
    upgradeDelay: string | undefined
  }
  l1StandardBridgeEscrow?: EthereumAddress
  l1StandardBridgeTokens?: string[]
  l1StandardBridgePremintedTokens?: string[]
  rpcUrl?: string
  transactionApi?: TransactionApiConfig
  genesisTimestamp: UnixTime
  finality?: Layer2FinalityConfig
  l2OutputOracle?: ContractParameters
  portal?: ContractParameters
  stateDerivation?: ScalingProjectStateDerivation
  stateValidation?: ScalingProjectStateValidation
  milestones?: Milestone[]
  knowledgeNuggets?: KnowledgeNugget[]
  roleOverrides?: Record<string, string>
  nonTemplatePermissions?: ScalingProjectPermission[]
  nonTemplateNativePermissions?: Record<string, ScalingProjectPermission[]>
  nonTemplateContracts?: ScalingProjectContract[]
  nonTemplateNativeContracts?: Record<string, ScalingProjectContract[]>
  nonTemplateEscrows?: ProjectEscrow[]
  nonTemplateExcludedTokens?: string[]
  nonTemplateOptimismPortalEscrowTokens?: string[]
  nonTemplateTrackedTxs?: Layer2TxConfig[]
  nonTemplateTechnology?: Partial<ScalingProjectTechnology>
  associatedTokens?: string[]
  isNodeAvailable?: boolean | 'UnderReview'
  nodeSourceLink?: string
  chainConfig?: ChainConfig
  hasProperSecurityCouncil?: boolean
  usesBlobs?: boolean
  isUnderReview?: boolean
  stage?: StageConfig
  additionalBadges?: BadgeId[]
  discoveryDrivenData?: boolean
  additionalPurposes?: ScalingProjectPurpose[]
  riskView?: ScalingProjectRiskView
  gasTokens?: string[]
  usingAltVm?: boolean
  reasonsForBeingOther?: ReasonForBeingInOther[]
  display: Omit<ScalingProjectDisplay, 'provider' | 'category' | 'purposes'> & {
    category?: ScalingProjectCategory
  }
}

export interface OpStackConfigL2 extends OpStackConfigCommon {
  upgradesAndGovernance?: string
  display: Omit<Layer2Display, 'provider' | 'category' | 'purposes'> & {
    category?: Layer2Display['category']
  }
}

export interface OpStackConfigL3 extends OpStackConfigCommon {
  stackedRiskView?: ScalingProjectRiskView
  hostChain: ProjectId
}

function opStackCommon(
  type: (Layer2 | Layer3)['type'],
  templateVars: OpStackConfigCommon,
  explorerUrl: string | undefined,
  incomingNativeDA?: ProjectDataAvailability,
): Omit<ScalingProject, 'type' | 'display'> & {
  display: Pick<
    ScalingProjectDisplay,
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

  const daProvider = getDAProvider(templateVars)
  const postsToEthereum = daProvider === undefined

  const usesBlobs =
    templateVars.usesBlobs ??
    templateVars.discovery.getContractValue<{
      isSequencerSendingBlobTx: boolean
    }>('SystemConfig', 'opStackDA').isSequencerSendingBlobTx

  let daBadge: BadgeId | undefined = daProvider?.badge
  if (postsToEthereum) {
    daBadge = usesBlobs ? Badge.DA.EthereumBlobs : Badge.DA.EthereumCalldata
  }

  assert(daBadge !== undefined, 'DA badge must be defined')

  const automaticBadges = templateVars.usingAltVm
    ? [Badge.Stack.OPStack, daBadge]
    : [Badge.Stack.OPStack, Badge.VM.EVM, daBadge]

  const nativeDA =
    incomingNativeDA ??
    addSentimentToDataAvailability({
      layers: [
        usesBlobs ? DA_LAYERS.ETH_BLOBS_OR_CALLDATA : DA_LAYERS.ETH_CALLDATA,
      ],
      bridge: DA_BRIDGES.ENSHRINED,
      mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
    })

  const portal = getOptimismPortal(templateVars)
  const l1StandardBridgeEscrow =
    templateVars.l1StandardBridgeEscrow ??
    templateVars.discovery.getContract('L1StandardBridge').address
  const upgradeability = templateVars.upgradeability ?? {
    upgradableBy: ['ProxyAdmin'],
    upgradeDelay: 'No delay',
  }

  const fraudProofType = getFraudProofType(templateVars)

  // archi images defined locally in the project.ts take precedence over this one
  const architectureImage = ['opstack', postsToEthereum ? 'rollup' : 'optimium']
  const partOfSuperchain = isPartOfSuperchain(templateVars)
  if (partOfSuperchain) {
    architectureImage.push('superchain')
    automaticBadges.push(Badge.Infra.Superchain)
  }
  if (fraudProofType !== 'None') {
    architectureImage.push('opfp')
  }

  const nativeContractRisks: ScalingProjectRisk[] = [
    partOfSuperchain
      ? ({
          category: 'Funds can be stolen if',
          text: `a contract receives a malicious code upgrade. Both regular and emergency upgrades must be approved by both the Security Council and the Foundation. There is no delay on regular upgrades.`,
        } satisfies ScalingProjectRisk)
      : CONTRACTS.UPGRADE_NO_DELAY_RISK,
  ]

  const discoveryDrivenSections = templateVars.discoveryDrivenData
    ? generateDiscoveryDrivenSections(
        templateVars.discovery,
        nativeContractRisks,
        templateVars.additionalDiscoveries,
      )
    : undefined

  return {
    isArchived: templateVars.isArchived,
    id: ProjectId(templateVars.discovery.projectName),
    addedAt: templateVars.addedAt,
    capability: templateVars.capability ?? 'universal',
    isUnderReview: templateVars.isUnderReview ?? false,
    display: {
      purposes: ['Universal', ...(templateVars.additionalPurposes ?? [])],
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
        (postsToEthereum ? 'Optimistic Rollup' : 'Optimium'),
      warning:
        templateVars.display.warning === undefined
          ? 'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.'
          : templateVars.display.warning,
    },
    chainConfig: templateVars.chainConfig,
    config: {
      associatedTokens: templateVars.associatedTokens,
      gasTokens: templateVars.gasTokens,
      transactionApi:
        templateVars.transactionApi ??
        (templateVars.rpcUrl !== undefined
          ? {
              type: 'rpc',
              startBlock: 1,
              defaultUrl: templateVars.rpcUrl,
              defaultCallsPerMinute: 1500,
              adjustCount: { type: 'SubtractOne' },
            }
          : undefined),
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
    },
    technology: getTechnology(templateVars, explorerUrl),
    permissions: discoveryDrivenSections
      ? discoveryDrivenSections.permissions
      : [
          ...templateVars.discovery.getOpStackPermissions({
            batcherHash: 'Sequencer',
            PROPOSER: 'Proposer',
            GUARDIAN: 'Guardian',
            CHALLENGER: 'Challenger',
            ...(templateVars.roleOverrides ?? {}),
          }),
          ...(templateVars.nonTemplatePermissions ?? []),
        ],
    nativePermissions: discoveryDrivenSections
      ? discoveryDrivenSections.nativePermissions
      : templateVars.nonTemplateNativePermissions,
    contracts: discoveryDrivenSections
      ? discoveryDrivenSections.contracts
      : {
          addresses: [
            ...templateVars.discovery.getOpStackContractDetails(upgradeability),
            ...(templateVars.nonTemplateContracts ?? []),
          ],
          risks: nativeContractRisks,
          nativeAddresses: templateVars.nonTemplateNativeContracts,
        },
    milestones: templateVars.milestones ?? [],
    knowledgeNuggets: [
      ...(templateVars.knowledgeNuggets ?? []),
      {
        title: 'How Optimism compresses data',
        url: 'https://twitter.com/bkiepuszewski/status/1508740414492323840?s=20&t=vMgR4jW1ssap-A-MBsO4Jw',
        thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
      },
      {
        title: 'Superchain Explainer',
        url: 'https://docs.optimism.io/stack/explainer',
        thumbnail: NUGGETS.THUMBNAILS.OPTIMISM_03,
      },
      {
        title: 'Modular Rollup Theory',
        url: 'https://www.youtube.com/watch?v=jnVjhp41pcc',
        thumbnail: NUGGETS.THUMBNAILS.MODULAR_ROLLUP,
      },
    ],
    badges: mergeBadges(automaticBadges, templateVars.additionalBadges ?? []),
    dataAvailabilitySolution: templateVars.dataAvailabilitySolution,
    reasonsForBeingOther: templateVars.reasonsForBeingOther,
    stateDerivation: templateVars.stateDerivation,
    stateValidation: getStateValidation(templateVars),
    riskView: templateVars.riskView ?? getRiskView(templateVars, daProvider),
    stage: templateVars.stage ?? computedStage(templateVars, postsToEthereum),
    dataAvailability: decideDA(daProvider, nativeDA),
  }
}

export function opStackL2(templateVars: OpStackConfigL2): Layer2 {
  const common = opStackCommon('layer2', templateVars, ethereum.explorerUrl)
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

export function opStackL3(templateVars: OpStackConfigL3): Layer3 {
  const layer2s = require('..').layer2s as Layer2[]
  const baseChain = layer2s.find((l2) => l2.id === templateVars.hostChain)
  assert(
    baseChain,
    `Could not find base chain ${templateVars.hostChain} in layer2s`,
  )

  const common = opStackCommon(
    'layer3',
    templateVars,
    baseChain.chainConfig?.explorerUrl,
    baseChain.dataAvailability,
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
    hostChain: templateVars.hostChain,
    display: { ...common.display, ...templateVars.display },
    stackedRiskView: templateVars.stackedRiskView ?? stackedRisk,
  }
}

function getStateValidation(
  templateVars: OpStackConfigCommon,
): ScalingProjectStateValidation | undefined {
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
}): ScalingProjectStateValidation {
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
): ScalingProjectRiskView {
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
): ScalingProjectRiskViewEntry {
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
      }
    }
    case 'Permissionless': {
      return RISK_VIEW.STATE_FP_INT
    }
  }
}

function getRiskViewExitWindow(
  templateVars: OpStackConfigCommon,
): ScalingProjectRiskViewEntry {
  const finalizationPeriod = getFinalizationPeriod(templateVars)

  return RISK_VIEW.EXIT_WINDOW(0, finalizationPeriod)
}

function getRiskViewProposerFailure(
  templateVars: OpStackConfigCommon,
): ScalingProjectRiskViewEntry {
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
): StageConfig {
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
): ScalingProjectTechnology {
  const daProvider = getDAProvider(templateVars)
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
        ...EXITS.REGULAR(
          'optimistic',
          'merkle proof',
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
          portal.name,
          'disputeGameFinalityDelaySeconds',
        )

      const proofMaturityDelaySeconds =
        templateVars.discovery.getContractValue<number>(
          portal.name,
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
    ...EXITS.FORCED('all-withdrawals'),
    references: [
      {
        title: 'Forced withdrawal from an OP Stack blockchain',
        url: 'https://stack.optimism.io/docs/security/forced-withdrawal/',
      },
    ],
  })

  return result
}

function decideDA(
  daProvider: DAProvider | undefined,
  nativeDA: ProjectDataAvailability | undefined,
): ProjectDataAvailability | undefined {
  if (daProvider !== undefined) {
    return addSentimentToDataAvailability({
      layers: daProvider.fallback
        ? [daProvider.layer, daProvider.fallback]
        : [daProvider.layer],
      bridge: daProvider.bridge,
      mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
    })
  }

  return nativeDA
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
): DAProvider | undefined {
  const postsToCelestia =
    templateVars.usesBlobs ??
    templateVars.discovery.getContractValue<{
      isSomeTxsLengthEqualToCelestiaDAExample: boolean
    }>('SystemConfig', 'opStackDA').isSomeTxsLengthEqualToCelestiaDAExample
  const daProvider =
    templateVars.daProvider ??
    (postsToCelestia ? CELESTIA_DA_PROVIDER : undefined)

  if (daProvider === undefined) {
    assert(
      templateVars.isNodeAvailable !== undefined,
      'isNodeAvailable must be defined if no DA provider is defined',
    )
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
): Layer2FinalityDisplay | undefined {
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
  switch (fraudProofType) {
    case 'None': {
      const sequencerInbox = EthereumAddress(
        templateVars.discovery.getContractValue(
          'SystemConfig',
          'sequencerInbox',
        ),
      )
      const sequencerAddress = EthereumAddress(
        templateVars.discovery.getContractValue('SystemConfig', 'batcherHash'),
      )
      const l2OutputOracle =
        templateVars.l2OutputOracle ??
        templateVars.discovery.getContract('L2OutputOracle')

      return ifPostsToEthereum(
        templateVars,
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
              sinceTimestamp: new UnixTime(
                l2OutputOracle.sinceTimestamp ??
                  templateVars.genesisTimestamp.toNumber(),
              ),
            },
          },
        ],
      )
    }
    case 'Permissioned':
    case 'Permissionless':
      return undefined
  }
}

function ifPostsToEthereum<T>(
  templateVars: OpStackConfigCommon,
  value: T,
): T | undefined {
  return getDAProvider(templateVars) === undefined ? value : undefined
}

function getOptimismPortal(
  templateVars: OpStackConfigCommon,
): ContractParameters {
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
        l2OutputOracle.name,
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
    portal.name,
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
