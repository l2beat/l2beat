import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  ChainConfig,
  DataAvailabilityHistory,
  KnowledgeNugget,
  Milestone,
  ScalingProjectConfig,
  ScalingProjectContracts,
  ScalingProjectDisplay,
  ScalingProjectPermission,
  ScalingProjectStack,
  ScalingProjectTransactionApi,
} from '../../../common'
import { ScalingProjectRiskView } from '../../../common/ScalingProjectRiskView'
import { ScalingProjectStateDerivation } from '../../../common/ScalingProjectStateDerivation'
import { ScalingProjectStateValidation } from '../../../common/ScalingProjectStateValidation'
import { ScalingProjectTechnology } from '../../../common/ScalingProjectTechnology'
import { type BadgeId } from '../../badges'
import { StageConfig } from '../../layer2s'

export interface Layer3 {
  type: 'layer3'
  /** Unique, readable id, will be used in DB. DO NOT EDIT THIS PROPERTY */
  id: ProjectId
  /** Date of creation of the file (not the project) */
  createdAt: UnixTime
  /** Is this layer3 an upcoming rollup? */
  isUpcoming?: boolean
  /** Is this layer3 archived? */
  isArchived?: boolean
  /** Has this layer3 changed and is under review? */
  isUnderReview?: boolean
  /** ProjectId of hostChain */
  hostChain: ProjectId
  /** Information displayed about the layer3 on the frontend */
  display: Layer3Display
  /** Information required to calculate the stats of the layer3 */
  config: Layer3Config
  /** Technical chain configuration */
  chainConfig?: ChainConfig
  /** Risk view values for this layer3 */
  riskView: ScalingProjectRiskView
  /** Stacked risk view values for this layer3 and it's base chain */
  stackedRiskView: ScalingProjectRiskView
  /** Rollup stage */
  stage?: StageConfig
  /** Data availability of scaling project */
  dataAvailability?: DataAvailabilityHistory
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
  /** List of permissioned addresses on the chain itself */
  nativePermissions?: Record<string, ScalingProjectPermission[]> | 'UnderReview'
  /** Links to recent developments, milestones achieved by the project */
  milestones?: Milestone[]
  /** List of knowledge nuggets: useful articles worth reading */
  knowledgeNuggets?: KnowledgeNugget[]
  /** List of badges */
  badges?: BadgeId[]
}

export interface Layer3Config extends ScalingProjectConfig {
  /** API parameters used to get transaction count */
  transactionApi?: ScalingProjectTransactionApi
}

export type Layer3Display = ScalingProjectDisplay & {
  /** Technology provider */
  provider?: ScalingProjectStack
}
