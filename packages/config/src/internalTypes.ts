import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type {
  ScalingProjectCapability,
  ScalingProjectDisplay,
  ScalingProjectConfig,
  ChainConfig,
  ProjectDataAvailability,
  CustomDa,
  ScalingProjectRiskView,
  StageConfig,
  ScalingProjectTechnology,
  ScalingProjectStateDerivation,
  ScalingProjectStateValidation,
  ProjectContracts,
  ProjectPermissions,
  Milestone,
  Badge,
  ReasonForBeingInOther,
  ProjectDiscoveryInfo,
  Layer2Config,
  Layer2FinalityDisplay,
  ProjectLivenessInfo,
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
