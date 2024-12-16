import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ScalingProjectRiskView } from '../../common'
import { ReasonForBeingInOther } from '../../common/ReasonForBeingInOther'
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
  /** e.g. Optimistic Rollup */
  type: string
  /** In the future this will be reflected as `type === 'Other'` */
  isOther: boolean
  hostChain: {
    id: ProjectId
    slug: string
    name: string
    shortName: string | undefined
  }
  stack: string | undefined
  raas: string | undefined
  daLayer: string
  stage: string
  purposes: string[]
}

export interface ProjectScalingRisks {
  self: ScalingProjectRiskView
  host: ScalingProjectRiskView | undefined
  stacked: ScalingProjectRiskView | undefined
}

export interface ProjectCountdowns {
  otherMigration?: {
    expiresAt: number
    pretendingToBe: string
    reasons: ReasonForBeingInOther[]
  }
}
