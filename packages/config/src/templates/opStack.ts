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
  sumRisk,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { BADGES } from '../common/badges'
import { EXPLORER_URLS } from '../common/explorerUrls'
import { formatDelay } from '../common/formatDelays'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from '../common/liveness'
import { getStage } from '../common/stages/getStage'
import { ZK_PROGRAM_HASHES } from '../common/zkProgramHashes'
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
  ProjectScalingContractsZkProgramHash,
  ProjectScalingDa,
  ProjectScalingProofSystem,
  ProjectScalingPurpose,
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
import { getDiscoveryInfo } from './getDiscoveryInfo'
import {
  asArray,
  explorerReferences,
  mergeBadges,
  safeGetImplementation,
} from './utils'

export const CELESTIA_DA_PROVIDER: DAProvider = {
  layer: DA_LAYERS.CELESTIA,
  riskView: RISK_VIEW.DATA_CELESTIA(false),
  technology: TECHNOLOGY_DATA_AVAILABILITY.CELESTIA_OFF_CHAIN(false),
  bridge: DA_BRIDGES.NONE,
  badge: BADGES.DA.Celestia,
}

export function EIGENDA_DA_PROVIDER(
  isUsingDACertVerifier: boolean,
): (templateVars: OpStackConfigCommon) => DAProvider {
  return (templateVars: OpStackConfigCommon) => {
    const opStackDA = templateVars.discovery.getContractValue<{
      isUsingEigenDA: string | boolean
    }>('SystemConfig', 'opStackDA')

    const eigenDAConfig = opStackDA.isUsingEigenDA
    const eigenDACertVersion =
      typeof eigenDAConfig === 'string' ? eigenDAConfig : 'v1'

    return {
      layer: DA_LAYERS.EIGEN_DA,
      riskView: RISK_VIEW.DATA_EIGENDA(
        isUsingDACertVerifier,
        eigenDACertVersion,
      ),
      technology: TECHNOLOGY_DATA_AVAILABILITY.EIGENDA_OFF_CHAIN(
        isUsingDACertVerifier,
        eigenDACertVersion,
      ),
      bridge: DA_BRIDGES.NONE,
      badge: BADGES.DA.EigenDA,
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
    badge: BADGES.DA.CustomDA,
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
  milestones?: Milestone[]
  ecosystemInfo?: ProjectEcosystemInfo
  nonTemplateProofSystem?: ProjectScalingProofSystem
  nonTemplateEscrows?: ProjectEscrow[]
  nonTemplateExcludedTokens?: string[]
  nonTemplateOptimismPortalEscrowTokens?: string[]
  nonTemplateTrackedTxs?: Layer2TxConfig[]
  nonTemplateTechnology?: Partial<ProjectScalingTechnology>
  nonTemplateContractRisks?: ProjectRisk
  nonTemplateZkProgramHashes?: ProjectScalingContractsZkProgramHash[]
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
}

export interface OpStackConfigL2 extends OpStackConfigCommon {
  upgradesAndGovernance?: string
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
  if (fraudProofType === 'OpSuccinct') {
    architectureImage.push('opsuccinct')
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
        (templateVars.stateValidationImage ??
        fraudProofType === 'Permissionless')
          ? 'opfp'
          : fraudProofType === 'Kailua'
            ? 'kailua'
            : fraudProofType === 'OpSuccinct'
              ? 'opsuccinct'
              : undefined,
      stacks: ['OP Stack'],
      warning:
        templateVars.display.warning === undefined
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
      zkProgramHashes:
        templateVars.nonTemplateZkProgramHashes ??
        getZkProgramHashes(templateVars),
    },
    milestones: templateVars.milestones ?? [],
    badges: mergeBadges(automaticBadges, templateVars.additionalBadges ?? []),
    customDa: templateVars.customDa,
    reasonsForBeingOther: templateVars.reasonsForBeingOther,
    stateDerivation: templateVars.stateDerivation,
    stateValidation: getStateValidation(templateVars, explorerUrl),
    riskView: getRiskView(templateVars, daProvider),
    stage:
      templateVars.stage ??
      computedStage(templateVars, postsToEthereum(templateVars)),
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

  const systemConfig = templateVars.discovery

  const usesBlobs =
    templateVars.usesEthereumBlobs ??
    systemConfig.getContractValue<{ isSequencerSendingBlobTx: boolean }>(
      'SystemConfig',
      'opStackDA',
    ).isSequencerSendingBlobTx

  if (usesBlobs) {
    const sequencerInbox = systemConfig.getContractValue<ChainSpecificAddress>(
      'SystemConfig',
      'sequencerInbox',
    )

    const inboxStartBlock =
      systemConfig.getContractValueOrUndefined<number>(
        'SystemConfig',
        'startBlock',
      ) ?? 0

    const sequencer = systemConfig.getContractValue<ChainSpecificAddress>(
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
      warning: templateVars.display.warning,
      liveness: getLiveness(templateVars),
    },
    config: {
      ...common.config,
      trackedTxs: getTrackedTxs(templateVars),
    },
    upgradesAndGovernance: templateVars.upgradesAndGovernance,
  }
}

export function opStackL3(templateVars: OpStackConfigL3): ScalingProject {
  const layer2s = require('../processing/layer2s').layer2s as ScalingProject[]
  const hostChain = templateVars.hostChain
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

function getZkProgramHashes(
  templateVars: OpStackConfigCommon,
): ProjectScalingContractsZkProgramHash[] {
  const fraudProofType = getFraudProofType(templateVars)

  switch (fraudProofType) {
    case 'None':
    case 'Permissioned':
    case 'Permissionless':
      return []
    case 'Kailua': {
      const kailuaProgramHash = templateVars.discovery.getContractValue<string>(
        'KailuaTreasury',
        'FPVM_IMAGE_ID',
      )
      const setBuilderProgramHash = templateVars.discovery.getContractValue<
        string[]
      >('RiscZeroSetVerifier', 'imageInfo')[0]
      return [
        ZK_PROGRAM_HASHES(kailuaProgramHash),
        ZK_PROGRAM_HASHES(setBuilderProgramHash),
      ]
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

      return opSuccinctProgramHashes.map((el) => ZK_PROGRAM_HASHES(el))
    }
  }
}

function getStateValidation(
  templateVars: OpStackConfigCommon,
  explorerUrl: string | undefined,
): ProjectScalingStateValidation | undefined {
  if (templateVars.stateValidation !== undefined) {
    return templateVars.stateValidation
  }

  const fraudProofType = getFraudProofType(templateVars)
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
        isPermissionless: false,
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
      return {
        categories: [
          {
            title: 'State root proposals',
            description: `Proposers submit state roots as children of any (possibly unresolved) previous state root proposal, by calling the \`propose()\` function in the KailuaTreasury. A parent state root can have multiple conflicting children, composing a tournament. Each proposer requires to lock a bond, currently set to ${formatEther(
              kailuaBond,
            )} ETH, that can be slashed if any proposal made by them is proven incorrect via a fault proof or a conflicting validity proof. The bond can be withdrawn once the proposer has no more pending proposals that need to be resolved and was not eliminated.

Proposals consist of a state root and a reference to their parent and implicitly challenge any sibling proposals who have the same parent. A proposal asserts that the proposed state root constitutes a valid state transition from the parent's state root. To offer efficient zk fault proofs, each proposal must include ${proposalOutputCount} intermediate state commitments, each spanning ${outputBlockSpan} L2 blocks. 

Proposals target sequential tournament epochs of currently ${proposalOutputCount} * ${outputBlockSpan} L2 blocks. A tournament with a resolved parent tournament, a single child- and no conflicting sibling proposals can be resolved after ${formatSeconds(maxClockDuration)}. 

The **Vanguard** is a privileged actor who can always make the first child proposal on a parent state root. They can, in the worst case, delay each tournament for up to ${formatSeconds(vanguardAdvantage)} by not making this first proposal. Sibling proposals made after the Vanguard's initial one or after the ${formatSeconds(vanguardAdvantage)} vanguardAdvantage in each tournament are permissionless.`,
            references: [
              {
                title: "'Sequencing' - Kailua Docs",
                url: 'https://risc0.github.io/kailua/design.html#sequencing',
              },
              {
                title: 'Vanguard - Kailua Docs',
                url: 'https://risc0.github.io/kailua/parameters.html#vanguard-advantage',
              },
            ],
          },
          {
            title: 'Challenges',
            description: `
Any conflicting sibling proposals within a tournament that are made within the ${formatSeconds(maxClockDuration)} challenge period of a proposal they are challenging, delay resolving the tournament until sufficient ZK proofs are published to leave one single tournament survivor.

In the tree of proposed state roots, each parent node can have multiple children. These children are indirectly challenging each other in a tournament, which can only be resolved if but a single child survives. A state root can be resolved if it is **the only remaining proposal** due to any combination of the following elimination methods: 
1. the proposal's challenge period of ${formatSeconds(maxClockDuration)} has ended before a conflicting proposal was made
2. the proposal is proven correct with a full validity proof (invalidates all conflicting proposals)
3. a conflicting sibling proposal is proven faulty

Proving any of the ${proposalOutputCount} intermediate state commitments in a proposal faulty invalidates the entire proposal. Proving a proposal valid invalidates all conflicting siblings. Pruning of a tournament's children happens strictly chronologically, which guarantees that the first faulty proposal of a given proposer is always pruned first. When pruned, an invalid proposal leads to the elimination of its proposer, which invalidates all their subsequent proposals, slashes their bond, and disallows future proposals by the same address. A slashed bond is transferred to an address chosen by the prover who caused the slashing.

A single remaining child in a tournament can be 'resolved' and will be finalized and usable for withdrawals after an execution delay of ${formatSeconds(disputeGameFinalityDelaySeconds)} (time for the Guardian to manually blacklist malicious state roots).`,
            references: [
              {
                url: 'https://docs.boundless.network/developers/kailua/how',
                title: 'Disputes - Kailua Docs',
              },
            ],
          },
          {
            title: 'Validity proofs',
            description: `Validity proofs and fault proofs both must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.

The Kailua state validation system is primarily optimistically resolved, so no validity proofs are required in the happy case. But two different zk proofs on unresolved state roots are possible and permissionless: The proveValidity() function proves a state root proposal's full validity, automatically invalidating all conflicting sibling proposals. proveOutputFault() allows any actor to eliminate a state root proposal for which they can prove that any of the ${proposalOutputCount} intermediate state transitions in the proposal are not correct. Both are zk proofs of validity, although one is used as an efficient fault proof to invalidate a single conflicting state transition.`,
            references: [
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
                text: 'no challenger checks the published state',
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
      return {
        categories: [
          {
            title: 'Validity proofs',
            description: `Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.
        Through the SuccinctL2OutputOracle, the system also allows to switch to an optimistic mode, in which no proofs are required and a challenger can challenge the proposed output state root within the finalization period.`,
            references: [
              {
                url: 'https://succinctlabs.github.io/op-succinct/architecture.html',
                title: 'Op-Succinct architecture',
              },
            ],
            risks: [
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
                text: 'in non-optimistic mode, the SuccinctGateway is unable to route proof verification to a valid verifier.',
              },
            ],
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
    description: `Updates to the system state can be proposed and challenged by ${isPermissionless ? 'anyone who has sufficient funds' : 'permissioned operators only'}. If a state root passes the challenge period, it is optimistically considered correct and made actionable for withdrawals.`,
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
        description: `Challenges are opened to disprove invalid state roots using bisection games. Each bisection move requires a stake that increases expontentially with the depth of the bisection, with a factor of ${exponentialBondsFactor}. The maximum depth is ${gameMaxDepth}, and reaching it therefore requires a cumulative stake of ${Number.parseFloat(
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
        initialBond: formatEther(
          templateVars.discovery.getContractValue<number[]>(
            'DisputeGameFactory',
            'initBonds',
          )[1], // 1 is for permissioned games!
        ),
      }
    }
    case 'Permissionless': {
      return {
        ...RISK_VIEW.STATE_FP_INT(
          getChallengePeriod(templateVars),
          getExecutionDelay(templateVars),
        ),
        initialBond: formatEther(
          templateVars.discovery.getContractValue<number[]>(
            'DisputeGameFactory',
            'initBonds',
          )[0], // 0 is for permissionless games!
        ),
      }
    }
    case 'Kailua': {
      return {
        ...RISK_VIEW.STATE_FP_HYBRID_ZK,
        executionDelay: getExecutionDelay(templateVars),
        challengeDelay: getChallengePeriod(templateVars),
        initialBond: formatEther(
          templateVars.discovery.getContractValue<number>(
            'KailuaTreasury',
            'participationBond',
          ),
        ),
      }
    }
    case 'OpSuccinct': {
      return {
        ...RISK_VIEW.STATE_ZKP_ST_SN_WRAP,
        executionDelay: getFinalizationPeriod(templateVars),
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
        'There is no exit window for users to exit in case of unwanted regular upgrades as they are initiated by the Security Council with instant upgrade power and without proper notice.',
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
    case 'Kailua':
      return RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED_ZK(
        templateVars.discovery.getContractValue<number>(
          'KailuaTreasury',
          'vanguardAdvantage',
        ),
      )
    case 'OpSuccinct':
      return RISK_VIEW.PROPOSER_CANNOT_WITHDRAW
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
    Kailua: true,
    OpSuccinct: null,
  }

  return getStage(
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
          fraudProofType === 'Permissionless' || fraudProofType === 'Kailua',
        securityCouncilProperlySetUp:
          templateVars.hasProperSecurityCouncil ?? null,
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
    case 'OpSuccinct':
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
    case 'Kailua': {
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
  hostChainDA?: DAProvider,
): DAProvider {
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
      (postsToCelestia ? CELESTIA_DA_PROVIDER : undefined)
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
  const fraudProofType = getFraudProofType(templateVars)
  const daProvider = getDAProvider(templateVars)

  // For OpSuccinct chains, provide liveness info regardless of DA provider
  if (fraudProofType === 'OpSuccinct') {
    const daDescription =
      daProvider.layer === DA_LAYERS.ETH_BLOBS_OR_CALLDATA ||
      daProvider.layer === DA_LAYERS.ETH_CALLDATA
        ? 'to the L1'
        : daProvider.layer === DA_LAYERS.EIGEN_DA
          ? 'to EigenDA'
          : 'to an external DA layer'

    return {
      warnings: {
        stateUpdates:
          'Please note, the state is not finalized until the finalization period passes.',
      },
      explanation: `${
        templateVars.display.name
      } is a ZK rollup that posts transaction data ${daDescription}. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
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
    case 'Permissionless':
    case 'Kailua': {
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
        'FaultDisputeGame',
        'maxClockDuration',
      )
    }
    case 'Kailua': {
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
    case 'Kailua': {
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
  | 'OpSuccinct'

function getFraudProofType(templateVars: OpStackConfigCommon): FraudProofType {
  // Check if it's OpSuccinct by looking for OPSuccinctL2OutputOracle contract
  if (templateVars.discovery.hasContract('OPSuccinctL2OutputOracle')) {
    return 'OpSuccinct'
  }

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
  }
  if (respectedGameType === 1) {
    return 'Permissioned'
  }
  if (respectedGameType === 1337) {
    return 'Kailua'
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
