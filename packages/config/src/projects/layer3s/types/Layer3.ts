import { ProjectId } from '@l2beat/shared-pure'

import {
  ChainConfig,
  DataAvailabilityWithSentiment,
  KnowledgeNugget,
  Layer3Provider,
  Milestone,
  ScalingProjectConfig,
  ScalingProjectContracts,
  ScalingProjectDisplay,
  ScalingProjectPermission,
  ScalingProjectTransactionApi,
} from '../../../common'
import { ScalingProjectRiskView } from '../../../common/ScalingProjectRiskView'
import { ScalingProjectStateDerivation } from '../../../common/ScalingProjectStateDerivation'
import { ScalingProjectStateValidation } from '../../../common/ScalingProjectStateValidation'
import { ScalingProjectTechnology } from '../../../common/ScalingProjectTechnology'

export interface Layer3 {
  type: 'layer3'
  /** Unique, readable id, will be used in DB. DO NOT EDIT THIS PROPERTY */
  id: ProjectId
  /** Is this layer3 an upcoming rollup? */
  isUpcoming?: boolean
  /** Is this layer3 archived? */
  isArchived?: boolean
  /** Has this layer3 changed and is under review? */
  isUnderReview?: boolean
  /** ProjectId of hostChain */
  hostChain: ProjectId | 'Multiple'
  /** Information displayed about the layer3 on the frontend */
  display: Layer3Display
  /** Information required to calculate the stats of the layer3 */
  config: Layer3Config
  /** Technical chain configuration */
  chainConfig?: ChainConfig
  /** Risk view values for this layer3 */
  riskView: ScalingProjectRiskView
  /** Stacked risk view values for this layer3 and it's base chain */
  stackedRiskView?: ScalingProjectRiskView
  /** Data availability of scaling project project */
  dataAvailability?: DataAvailabilityWithSentiment
  /** Deep dive into layer3 technology */
  technology: ScalingProjectTechnology
  /** Open-source node details */
  stateDerivation?: ScalingProjectStateDerivation
  /** How project validates state? */
  stateValidation?: ScalingProjectStateValidation
  /** List of smart contracts used in the layer2 */
  contracts: ScalingProjectContracts
  /** List of permissioned addresses */
  permissions?: ScalingProjectPermission[] | 'UnderReview'
  /** Links to recent developments, milestones achieved by the project */
  milestones?: Milestone[]
  /** List of knowledge nuggets: useful articles worth reading */
  knowledgeNuggets?: KnowledgeNugget[]
}

export interface Layer3Config extends ScalingProjectConfig {
  /** API parameters used to get transaction count */
  transactionApi?: ScalingProjectTransactionApi
}

export interface Layer3Display extends ScalingProjectDisplay {
  /** Technology provider */
  provider?: Layer3Provider
}
