import { ProjectId } from '@l2beat/shared-pure'

import {
  KnowledgeNugget,
  Layer3Provider,
  Milestone,
  ProjectConfig,
  ProjectContracts,
  ProjectDisplay,
  ProjectPermission,
} from '../../common'
import { ProjectRiskView } from '../../common/ProjectRiskView'
import { ProjectStateDerivation } from '../../common/ProjectStateDerivation'
import { ProjectTechnology } from '../../common/ProjectTechnology'

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
  config: ProjectConfig
  /** Risk view values for this layer3 */
  riskView: ProjectRiskView
  /** Deep dive into layer3 technology */
  technology: ProjectTechnology
  /** Open-source node details */
  stateDerivation?: ProjectStateDerivation
  /** How project validates state? */
  stateValidation?: string
  /** List of smart contracts used in the layer2 */
  contracts: ProjectContracts
  /** List of permissioned addresses */
  permissions?: ProjectPermission[] | 'UnderReview'
  /** Links to recent developments, milestones achieved by the project */
  milestones?: Milestone[]
  /** List of knowledge nuggets: useful articles worth reading */
  knowledgeNuggets?: KnowledgeNugget[]
}

export interface Layer3Display extends ProjectDisplay {
  /** Technology provider */
  provider?: Layer3Provider
}
