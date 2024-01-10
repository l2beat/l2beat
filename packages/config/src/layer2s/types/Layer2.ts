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
import { ScalingProjectRiskView } from '../../common/ScalingProjectRiskView'
import { ScalingProjectStateDerivation } from '../../common/ScalingProjectStateDerivation'
import { ScalingProjectTechnology } from '../../common/ScalingProjectTechnology'
import { StageConfig } from '../common/stages/types'
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
  /** Risk view values for this layer2 */
  riskView: ScalingProjectRiskView
  /** Rollup stage */
  stage: StageConfig
  /** Deep dive into layer2 technology */
  technology: ScalingProjectTechnology
  /** Open-source node details */
  stateDerivation?: ScalingProjectStateDerivation
  /** How project validates state? */
  stateValidation?: string
  /** List of smart contracts used in the layer2 */
  contracts: ScalingProjectContracts
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
  /** Explanation on how liveness data is gathered for given project */
  liveness?: Layer2LivenessDisplay
}
export interface Layer2LivenessDisplay {
  explanation?: string
  warnings?: {
    stateUpdates?: string
    batchSubmissions?: string
    proofSubmissions?: string
  }
}

export interface Layer2Config extends ScalingProjectConfig {
  /** API parameters used to get transaction count */
  transactionApi?: Layer2TransactionApi
  /** Configuration for getting state updates and batch submission */
  liveness?: Layer2Liveness
}
