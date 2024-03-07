import { ProjectId } from '@l2beat/shared-pure'

import {
  KnowledgeNugget,
  Layer2Provider,
  Milestone,
  ScalingProjectConfig,
  ScalingProjectContracts,
  ScalingProjectDisplay,
  ScalingProjectPermission,
} from '../../common'
import { ChainConfig } from '../../common/ChainConfig'
import { ScalingProjectRiskView } from '../../common/ScalingProjectRiskView'
import { ScalingProjectStateDerivation } from '../../common/ScalingProjectStateDerivation'
import { ScalingProjectStateValidation } from '../../common/ScalingProjectStateValidation'
import { ScalingProjectTechnology } from '../../common/ScalingProjectTechnology'
import { StageConfig } from '../common/stages/types'
import { Layer2FinalityConfig } from './Layer2FinalityConfig'
import { Layer2Liveness } from './Layer2LivenessConfig'
import { Layer2TransactionApi } from './Layer2TransactionApi'

export interface Layer2 {
  type: 'layer2'
  /** Unique, readable id, will be used in DB. DO NOT EDIT THIS PROPERTY */
  id: ProjectId
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
  /** List of permissioned addresses */
  permissions?: ScalingProjectPermission[] | 'UnderReview'
  /** Links to recent developments, milestones achieved by the project */
  milestones?: Milestone[]
  /** List of knowledge nuggets: useful articles worth reading */
  knowledgeNuggets?: KnowledgeNugget[]
}

export interface Layer2Display extends ScalingProjectDisplay {
  /** Technology provider */
  provider?: Layer2Provider
  /** Tooltip contents for liveness tab for given project */
  liveness?: Layer2LivenessDisplay
  finality?: Layer2FinalityDisplay
  /** Warning for TVL */
  tvlWarning?: Layer2TVLWarning
}
export interface Layer2LivenessDisplay {
  explanation?: string
  warnings?: {
    stateUpdates?: string
    batchSubmissions?: string
    proofSubmissions?: string
  }
}

export interface Layer2FinalityDisplay {
  /** Warning tooltip content for finality tab for given project */
  warning?: string
  /** Finalization period displayed in table for given project (time in seconds) */
  finalizationPeriod?: number
}

export interface Layer2Config extends ScalingProjectConfig {
  /** API parameters used to get transaction count */
  transactionApi?: Layer2TransactionApi
  /** Configuration for getting state updates and batch submission */
  liveness?: Layer2Liveness
  /** Configuration for getting finality data */
  finality?: Layer2FinalityConfig
}

export interface Layer2TVLWarning {
  /** Content of the warning */
  content: string
  /** Color with which the warning should be displayed */
  sentiment: 'bad' | 'warning'
}
