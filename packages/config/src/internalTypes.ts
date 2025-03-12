import type {
  EthereumAddress,
  ProjectId,
  TrackedTxsConfigSubtype,
  TrackedTxsConfigType,
  UnixTime,
} from '@l2beat/shared-pure'
import type {
  Badge,
  BridgeCategory,
  ChainConfig,
  Milestone,
  ProjectActivityConfig,
  ProjectBridgeRisks,
  ProjectBridgeTechnology,
  ProjectContracts,
  ProjectCustomDa,
  ProjectDaTrackingConfig,
  ProjectDiscoveryInfo,
  ProjectEscrow,
  ProjectFinalityConfig,
  ProjectFinalityInfo,
  ProjectLinks,
  ProjectLivenessConfig,
  ProjectLivenessInfo,
  ProjectPermissions,
  ProjectScalingCapability,
  ProjectScalingCategory,
  ProjectScalingDa,
  ProjectScalingPurpose,
  ProjectScalingRiskView,
  ProjectScalingScopeOfAssessment,
  ProjectScalingStack,
  ProjectScalingStage,
  ProjectScalingStateDerivation,
  ProjectScalingStateValidation,
  ProjectTechnologyChoice,
  ReasonForBeingInOther,
  WarningWithSentiment,
} from './types'

/** Base interface for Layer2s and Layer3s. */
export interface ScalingProject {
  type: 'layer2' | 'layer3'
  /** Unique, readable id, will be used in DB. DO NOT EDIT THIS PROPERTY */
  id: ProjectId
  /** If the project is an L3, ProjectId that serves as the base layer */
  hostChain?: ProjectId
  /** Is the project univeral or app specific (e.g. DEX) */
  capability: ProjectScalingCapability
  /** Date of creation of the file (not the project) */
  addedAt: UnixTime
  /** Is this project archived? */
  isArchived?: boolean
  /** Is this project an upcoming rollup? */
  isUpcoming?: boolean
  /** Has this project changed and is under review? */
  isUnderReview?: boolean
  /** Information displayed about the project on the frontend */
  display: ProjectScalingDisplay
  /** Information required to calculate the stats of the project */
  config: ProjectScalingConfig
  /** Technical chain configuration */
  chainConfig?: ChainConfig
  /** Data availability of scaling project */
  dataAvailability?: ProjectScalingDa
  /** Details about the custom availability solution */
  customDa?: ProjectCustomDa
  /** Risk view values for this project */
  riskView: ProjectScalingRiskView
  /** Stacked risk view values for this project and it's base chain - only applicable to layer3s */
  stackedRiskView?: ProjectScalingRiskView
  /** Rollup stage */
  stage: ProjectScalingStage
  /** Deep dive into project technology */
  technology: ProjectScalingTechnology
  /** Open-source node details */
  stateDerivation?: ProjectScalingStateDerivation
  /** Explains how project validates state */
  stateValidation?: ProjectScalingStateValidation
  /** List of smart contracts used in the project */
  contracts: ProjectContracts
  /** List of permissioned addresses on a given chain */
  permissions?: Record<string, ProjectPermissions>
  /** Links to recent developments, milestones achieved by the project */
  milestones?: Milestone[]
  /** List of badges */
  badges?: Badge[]
  /** Reasons why the scaling project is included in the other categories. If defined - project will be displayed as other */
  reasonsForBeingOther?: ReasonForBeingInOther[]
  /** Things we have or haven't checked while assesing the stage */
  scopeOfAssessment?: ProjectScalingScopeOfAssessment
  /** Discodrive markers - shouldn't be configured by a user */
  discoveryInfo?: ProjectDiscoveryInfo
  /** Upgrades and governance explained */
  upgradesAndGovernance?: string
}

export interface ProjectScalingConfig {
  /** Associated tokens are marked on TVL breakdown -- "associated token accounts for X% of TVL" */
  associatedTokens?: string[]
  /** List of contracts in which L1 funds are locked */
  escrows: ProjectEscrow[]
  /** API parameters used to get transaction count */
  activityConfig?: ProjectActivityConfig
  /** Data availability tracking config */
  daTracking?: ProjectDaTrackingConfig[]
  /** List of transactions that are tracked by our backend */
  trackedTxs?: Layer2TxConfig[]
  /** Configuration for getting liveness data */
  liveness?: ProjectLivenessConfig
  /** Configuration for getting finality data */
  finality?: ProjectFinalityConfig
}

export interface ProjectScalingDisplay {
  /** Name of the scaling project, will be used as a display name on the website */
  name: string
  /** Short name of the scaling project, will be used in some places on the website as a display name */
  shortName?: string
  /** Url friendly scaling project name, will be used in website urls */
  slug: string
  /** Name of the category the scaling project belongs to */
  category: ProjectScalingCategory
  /** Technological stack */
  stack?: ProjectScalingStack
  /** A warning displayed in the header of the project. Also will be displayed as yellow shield next to project name (table view) */
  headerWarning?: string
  /** Warning for TVL */
  tvlWarning?: WarningWithSentiment
  /** A warning displayed above the description of the project */
  warning?: string
  /** Project raw with red warning will turn into red, and there will be red warning icon with this message */
  redWarning?: string
  /** A few sentences describing the scaling project */
  description: string
  /** Detailed description of the scaling project, will be visible in detailed description section */
  detailedDescription?: string
  /** A short (<20 characters) description of the use case */
  purposes: ProjectScalingPurpose[]
  /** List of links */
  links: ProjectLinks
  /** Name of the architecture image to show in the contract section if present, otherwise use slug */
  architectureImage?: string
  /** Name of the state validation image to show in the state validation section if present, otherwise use slug */
  stateValidationImage?: string
  /** Name of the upgrades and governance image to show in the upgrades and governance section if present, otherwise use slug */
  upgradesAndGovernanceImage?: string
  /** Name of the sequencing image to show in the sequencing section if present, otherwise use slug */
  sequencingImage?: string
  /** Tooltip contents for liveness tab for given project */
  liveness?: ProjectLivenessInfo
  finality?: ProjectFinalityInfo
  /** Warning for Costs */
  costsWarning?: WarningWithSentiment
}

export interface ProjectScalingTechnology {
  /** What state correctness mechanism is used in the project */
  stateCorrectness?: ProjectTechnologyChoice
  /** What is the new cryptography used in the project */
  newCryptography?: ProjectTechnologyChoice
  /** What is the data availability choice for the project */
  dataAvailability?: ProjectTechnologyChoice
  /** What are the details about project operator(s) */
  operator?: ProjectTechnologyChoice
  /** What are the details about project sequencing */
  sequencing?: ProjectTechnologyChoice
  /** What are the details about force transactions (censorship resistance) */
  forceTransactions?: ProjectTechnologyChoice
  /** A description of the available exit mechanisms */
  exitMechanisms?: ProjectTechnologyChoice[]
  /** What is solution to the mass exit problem */
  massExit?: ProjectTechnologyChoice
  /** Other considerations */
  otherConsiderations?: ProjectTechnologyChoice[]
  /** Is the technology section under review */
  isUnderReview?: boolean
}

export interface Layer2TxConfig {
  uses: Layer2TrackedTxUse[]
  query: TrackedTxQuery
  _hackCostMultiplier?: number
}

export interface Layer2TrackedTxUse {
  type: TrackedTxsConfigType
  subtype: TrackedTxsConfigSubtype
}

type TrackedTxQuery = FunctionCall | Transfer | SharpSubmission | SharedBridge

interface FunctionCall {
  formula: 'functionCall'
  address: EthereumAddress
  selector: `0x${string}`
  functionSignature: `function ${string}`
  /** Inclusive */
  sinceTimestamp: UnixTime
  /** Inclusive */
  untilTimestamp?: UnixTime
}

interface Transfer {
  formula: 'transfer'
  from: EthereumAddress
  to: EthereumAddress
  /** Inclusive */
  sinceTimestamp: UnixTime
  /** Inclusive */
  untilTimestamp?: UnixTime
}

interface SharpSubmission {
  formula: 'sharpSubmission'
  programHashes: string[]
  /** Inclusive */
  sinceTimestamp: UnixTime
  /** Inclusive */
  untilTimestamp?: UnixTime
}

interface SharedBridge {
  formula: 'sharedBridge'
  chainId: number
  address: EthereumAddress
  selector: `0x${string}`
  functionSignature: `function ${string}`
  /** Inclusive */
  sinceTimestamp: UnixTime
  /** Inclusive */
  untilTimestamp?: UnixTime
}

export interface Bridge {
  type: 'bridge'
  id: ProjectId
  /** Date of creation of the file (not the project) */
  addedAt: UnixTime
  isArchived?: boolean
  isUpcoming?: boolean
  isUnderReview?: boolean
  display: BridgeDisplay
  config: BridgeConfig
  chainConfig?: ChainConfig
  riskView: ProjectBridgeRisks
  technology: ProjectBridgeTechnology
  contracts?: ProjectContracts
  permissions?: Record<string, ProjectPermissions>
  milestones?: Milestone[]
  discoveryInfo?: ProjectDiscoveryInfo
}

export interface BridgeDisplay {
  name: string
  shortName?: string
  slug: string
  warning?: string
  description: string
  detailedDescription?: string
  category: BridgeCategory
  links: ProjectLinks
  architectureImage?: string
}

export interface BridgeConfig {
  associatedTokens?: string[]
  escrows: ProjectEscrow[]
}
