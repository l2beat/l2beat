import { ProjectId } from '@l2beat/shared-pure'

import {
  KnowledgeNugget,
  Layer3Provider,
  Milestone,
  ScalingProjectConfig,
  ScalingProjectContracts,
  ScalingProjectDisplay,
  ScalingProjectPermission,
} from '../../common'
import { ScalingProjectRiskView } from '../../common/ScalingProjectRiskView'
import { ScalingProjectStateDerivation } from '../../common/ScalingProjectStateDerivation'
import { ScalingProjectTechnology } from '../../common/ScalingProjectTechnology'

export interface Layer3 {
  type: 'layer3'
  /** Unique, readable id, will be used in DB. DO NOT EDIT THIS PROPERTY */
  id: ProjectId
  /** Is this layer3 an upcoming rollup? */
  isUpcoming?: boolean
  /** Has this layer3 changed and is under review? */
  isUnderReview?: boolean
  /** ProjectId of hostChain */
  hostChain: ProjectId
  /** Information displayed about the layer3 on the frontend */
  display: Layer3Display
  /** Information required to calculate the stats of the layer3 */
  config: ScalingProjectConfig
  /** Risk view values for this layer3 */
  riskView: ScalingProjectRiskView
  /** Deep dive into layer3 technology */
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

export interface Layer3Display extends ScalingProjectDisplay {
  /** Technology provider */
  provider?: Layer3Provider
}
