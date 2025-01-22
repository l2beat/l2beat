import type {
  ProjectId,
  Sentiment,
  UnixTime,
  WarningValueWithSentiment,
} from '@l2beat/shared-pure'

import type {
  KnowledgeNugget,
  Milestone,
  ProjectDataAvailability,
  ScalingProjectConfig,
  ScalingProjectContracts,
  ScalingProjectDisplay,
  ScalingProjectPermission,
  ScalingProjectStack,
  ScalingProjectTransactionApi,
} from '../../../common'
import type { ChainConfig } from '../../../common/ChainConfig'
import type { ScalingProjectRiskView } from '../../../common/ScalingProjectRiskView'
import type { ScalingProjectStateDerivation } from '../../../common/ScalingProjectStateDerivation'
import type { ScalingProjectStateValidation } from '../../../common/ScalingProjectStateValidation'
import type { ScalingProjectTechnology } from '../../../common/ScalingProjectTechnology'
import type { BadgeId } from '../../badges'
import type { StageConfig } from '../common/stages/types'
import type { Layer2FinalityConfig } from './Layer2FinalityConfig'
import type { Layer2LivenessConfig } from './Layer2LivenessConfig'
import type { Layer2TxConfig } from './Layer2TrackedTxsConfig'

export interface Layer2 {
  type: 'layer2'
  /** Unique, readable id, will be used in DB. DO NOT EDIT THIS PROPERTY */
  id: ProjectId
  /** Date of creation of the file (not the project) */
  createdAt: UnixTime
  /** Is this layer2 archived? */
  isArchived?: boolean
  /** Is this layer2 an upcoming rollup? */
  isUpcoming?: boolean
  /** Has this layer2 changed and is under review? */
  isUnderReview?: boolean
  /** Information displayed about the layer2 on the frontend */
  display: Layer2Display
  /** Information required to calculate the stats of the layer2 */
  config: Layer2Config
  /** Technical chain configuration */
  chainConfig?: ChainConfig
  /** Data availability of scaling project */
  dataAvailability?: ProjectDataAvailability
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
  contracts: ScalingProjectContracts
  /** Upgrades and governance explained */
  upgradesAndGovernance?: string
  /** List of permissioned addresses on the host chain */
  permissions?: ScalingProjectPermission[] | 'UnderReview'
  /** List of permissioned addresses on the chain itself */
  nativePermissions?: Record<string, ScalingProjectPermission[]> | 'UnderReview'
  /** Links to recent developments, milestones achieved by the project */
  milestones?: Milestone[]
  /** List of knowledge nuggets: useful articles worth reading */
  knowledgeNuggets?: KnowledgeNugget[]
  /** List of badges */
  badges?: BadgeId[]
}

export type Layer2Display = ScalingProjectDisplay & {
  /** Technology provider */
  provider?: ScalingProjectStack
  /** Tooltip contents for liveness tab for given project */
  liveness?: ProjectLivenessInfo
  finality?: Layer2FinalityDisplay
  /** Warning for Costs */
  costsWarning?: WarningWithSentiment
}

export interface ProjectLivenessInfo {
  explanation?: string
  warnings?: {
    stateUpdates?: string
    batchSubmissions?: string
    proofSubmissions?: string
  }
}

export interface Layer2FinalityDisplay {
  /** Warning tooltip content for finality tab for given project */
  warnings?: {
    timeToInclusion?: WarningValueWithSentiment
    stateUpdateDelay?: WarningValueWithSentiment
  }
  /** Finalization period displayed in table for given project (time in seconds) */
  finalizationPeriod?: number
}

export interface Layer2Config extends ScalingProjectConfig {
  /** API parameters used to get transaction count */
  transactionApi?: ScalingProjectTransactionApi
  /** List of transactions that are tracked by our backend */
  trackedTxs?: Layer2TxConfig[]
  /** Configuration for getting liveness data */
  liveness?: Layer2LivenessConfig
  /** Configuration for getting finality data */
  finality?: Layer2FinalityConfig
}

export interface WarningWithSentiment {
  /** Content of the warning */
  content: string
  /** Color with which the warning should be displayed */
  sentiment: Extract<Sentiment, 'bad' | 'warning' | 'neutral'>
}
