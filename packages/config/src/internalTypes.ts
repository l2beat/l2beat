import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type {
  Badge,
  ChainConfig,
  CustomDa,
  Layer2FinalityConfig,
  Layer2FinalityDisplay,
  Layer2TxConfig,
  Milestone,
  ProjectActivityConfig,
  ProjectContracts,
  ProjectDataAvailability,
  ProjectDaTrackingConfig,
  ProjectDiscoveryInfo,
  ProjectEscrow,
  ProjectLinks,
  ProjectLivenessConfig,
  ProjectLivenessInfo,
  ProjectPermissions,
  ReasonForBeingInOther,
  ScalingProjectCapability,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  ScalingProjectRiskView,
  ScalingProjectStack,
  ScalingProjectStateDerivation,
  ScalingProjectStateValidation,
  ScalingProjectTechnology,
  StageConfig,
  WarningWithSentiment,
} from './types'

/** Base interface for Layer2s and Layer3s. The hope is that Layer2 and Layer3 will dissapear and only this will remain. */

export interface ScalingProject {
  /** Unique, readable id, will be used in DB. DO NOT EDIT THIS PROPERTY */
  id: ProjectId
  capability: ScalingProjectCapability
  /** Date of creation of the file (not the project) */
  addedAt: UnixTime
  /** Is this project archived? */
  isArchived?: boolean
  /** Is this project an upcoming rollup? */
  isUpcoming?: boolean
  /** Has this project changed and is under review? */
  isUnderReview?: boolean
  /** Information displayed about the project on the frontend */
  display: ScalingProjectDisplay
  /** Information required to calculate the stats of the project */
  config: ScalingProjectConfig
  /** Technical chain configuration */
  chainConfig?: ChainConfig
  /** Data availability of scaling project */
  dataAvailability?: ProjectDataAvailability
  /** Details about the custom availability solution */
  customDa?: CustomDa
  /** Risk view values for this layer2 */
  riskView: ScalingProjectRiskView
  /** Rollup stage */
  stage: StageConfig
  /** Deep dive into layer2 technology */
  technology: ScalingProjectTechnology
  /** Open-source node details */
  stateDerivation?: ScalingProjectStateDerivation
  /** Explains how project validates state */
  stateValidation?: ScalingProjectStateValidation
  /** List of smart contracts used in the layer2 */
  contracts: ProjectContracts
  /** List of permissioned addresses on a given chain */
  permissions?: Record<string, ProjectPermissions>
  /** Links to recent developments, milestones achieved by the project */
  milestones?: Milestone[]
  /** List of badges */
  badges?: Badge[]
  /** Reasons why the scaling project is included in the other categories. If defined - project will be displayed as other */
  reasonsForBeingOther?: ReasonForBeingInOther[]
  /** Discodrive markers */
  discoveryInfo?: ProjectDiscoveryInfo
}

export interface Layer2 extends ScalingProject {
  type: 'layer2'
  display: Layer2Display
  config: Layer2Config
  /** Upgrades and governance explained */
  upgradesAndGovernance?: string
}

export interface Layer2Display extends ScalingProjectDisplay {
  /** Tooltip contents for liveness tab for given project */
  liveness?: ProjectLivenessInfo
  finality?: Layer2FinalityDisplay
  /** Warning for Costs */
  costsWarning?: WarningWithSentiment
}

export interface Layer3 extends ScalingProject {
  type: 'layer3'
  /** ProjectId of hostChain */
  hostChain: ProjectId
  /** Stacked risk view values for this layer3 and it's base chain */
  stackedRiskView: ScalingProjectRiskView
}

export interface ScalingProjectConfig {
  /** Associated tokens are marked on TVL breakdown -- "associated token accounts for X% of TVL" */
  associatedTokens?: string[]
  /** List of contracts in which L1 funds are locked */
  escrows: ProjectEscrow[]
  /** API parameters used to get transaction count */
  activityConfig?: ProjectActivityConfig
  /** Data availability tracking config */
  daTracking?: ProjectDaTrackingConfig[]
}

export interface Layer2Config extends ScalingProjectConfig {
  /** List of transactions that are tracked by our backend */
  trackedTxs?: Layer2TxConfig[]
  /** Configuration for getting liveness data */
  liveness?: ProjectLivenessConfig
  /** Configuration for getting finality data */
  finality?: Layer2FinalityConfig
}

export interface ScalingProjectDisplay {
  /** Name of the scaling project, will be used as a display name on the website */
  name: string
  /** Short name of the scaling project, will be used in some places on the website as a display name */
  shortName?: string
  /** Url friendly scaling project name, will be used in website urls */
  slug: string
  /** Name of the category the scaling project belongs to */
  category: ScalingProjectCategory
  /** Technological stack */
  stack?: ScalingProjectStack
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
  purposes: ScalingProjectPurpose[]
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
}
