import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type {
  ProjectDataAvailability,
  ScalingProjectCategory,
  ScalingProjectRiskView,
  ScalingProjectStack,
} from '../../common'
import type { ReasonForBeingInOther } from '../../common/ReasonForBeingInOther'
import type { BridgeDisplay, BridgeRiskView } from '../bridges'
import type {
  DacBridge,
  EnshrinedBridge,
  NoDaBridge,
  OnChainDaBridge,
} from '../da-beat'
import type {
  Layer2FinalityConfig,
  Layer2FinalityDisplay,
  ProjectLivenessInfo,
  StageConfig,
  WarningWithSentiment,
} from '../layer2s'
import type { ProofVerification } from '../types'

export interface BaseProject {
  id: ProjectId
  slug: string
  name: string
  shortName: string | undefined
  addedAt: UnixTime
  // data
  statuses?: ProjectStatuses
  bridgeInfo?: ProjectBridgeInfo
  bridgeRisks?: BridgeRiskView
  scalingInfo?: ProjectScalingInfo
  scalingStage?: StageConfig | undefined
  scalingRisks?: ProjectScalingRisks
  scalingDa?: ProjectDataAvailability
  tvlInfo?: ProjectTvlInfo
  // tvlConfig
  /** Display information for the liveness feature. If present liveness is enabled for this project. */
  livenessInfo?: ProjectLivenessInfo
  /** Display information for the costs feature. If present costs is enabled for this project. */
  costsInfo?: ProjectCostsInfo
  // trackedTxsConfig
  /** Configuration for the finality feature. If present finality is enabled for this project. */
  finalityInfo?: Layer2FinalityDisplay
  /** Configuration for the finality feature. If present finality is enabled for this project. */
  finalityConfig?: Layer2FinalityConfig
  proofVerification?: ProofVerification
  daBridges?: (OnChainDaBridge | EnshrinedBridge | NoDaBridge | DacBridge)[]
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
  // countdowns
  otherMigration?: {
    expiresAt: number
    pretendingToBe: ScalingProjectCategory
    reasons: ReasonForBeingInOther[]
  }
}

export interface ProjectBridgeInfo {
  category: BridgeDisplay['category']
  destination: string[]
  validatedBy: string
}

export interface ProjectScalingInfo {
  layer: 'layer2' | 'layer3'
  type: ScalingProjectCategory
  /** In the future this will be reflected as `type === 'Other'` */
  isOther: boolean
  reasonsForBeingOther: ReasonForBeingInOther[] | undefined
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

export interface ProjectCostsInfo {
  warning?: WarningWithSentiment
}
