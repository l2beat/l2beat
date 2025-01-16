import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  ProjectDataAvailability,
  ScalingProjectCategory,
  ScalingProjectRiskView,
  ScalingProjectStack,
} from '../../common'
import { ReasonForBeingInOther } from '../../common/ReasonForBeingInOther'
import {
  Layer2FinalityConfig,
  Layer2FinalityDisplay,
  ProjectLivenessInfo,
  WarningWithSentiment,
} from '../layer2s'
import {
  DacBridge,
  EnshrinedBridge,
  NoDaBridge,
  OnChainDaBridge,
} from '../other'
import { ProofVerification } from '../types'

export interface Project {
  id: ProjectId
  slug: string
  name: string
  shortName: string | undefined
  addedAt: UnixTime
  // data
  statuses?: ProjectStatuses
  scalingInfo?: ProjectScalingInfo
  scalingRisks?: ProjectScalingRisks
  scalingDa?: ProjectDataAvailability
  tvlInfo?: ProjectTvlInfo
  // tvlConfig
  /** Display information for the liveness feature. If this is present liveness is enabled for this project. */
  livenessInfo?: ProjectLivenessInfo
  // costsInfo
  // trackedTxsConfig
  // activityInfo
  // activityConfig
  /** Configuration for the finality feature. If this is present finality is enabled for this project. */
  finalityInfo?: Layer2FinalityDisplay
  /** Configuration for the finality feature. If this is present finality is enabled for this project. */
  finalityConfig?: Layer2FinalityConfig
  proofVerification?: ProofVerification
  daBridges?: (OnChainDaBridge | EnshrinedBridge | NoDaBridge | DacBridge)[]
  countdowns?: ProjectCountdowns
  // tags
  isBridge?: true
  isScaling?: true
  isZkCatalog?: true
  isDaLayer?: true
  isUpcoming?: true
  isArchived?: true
}

export interface ProjectStatuses {
  yellowWarning: string | undefined
  redWarning: string | undefined
  isUnderReview: boolean
  isUnverified: boolean
}

export interface ProjectScalingInfo {
  layer: 'layer2' | 'layer3'
  type: ScalingProjectCategory
  /** In the future this will be reflected as `type === 'Other'` */
  isOther: boolean
  hostChain: {
    id: ProjectId
    slug: string
    name: string
    shortName: string | undefined
  }
  stack: ScalingProjectStack | undefined
  raas: string | undefined
  daLayer: string
  stage: ScalingProjectStage
  purposes: string[]
}

export type ScalingProjectStage =
  | 'Not applicable'
  | 'Under review'
  | 'Stage 0'
  | 'Stage 1'
  | 'Stage 2'

export interface ProjectScalingRisks {
  self: ScalingProjectRiskView
  host: ScalingProjectRiskView | undefined
  stacked: ScalingProjectRiskView | undefined
}

export interface ProjectTvlInfo {
  associatedTokens: string[]
  warnings: WarningWithSentiment[]
}

export interface ProjectCountdowns {
  otherMigration?: {
    expiresAt: number
    pretendingToBe: ScalingProjectCategory
    reasons: ReasonForBeingInOther[]
  }
}
