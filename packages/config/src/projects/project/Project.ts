import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ScalingProjectRiskView } from '../../common'
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
  addedAt: UnixTime
  // data
  title?: ProjectTitle
  scalingBasicInfo?: ProjectScalingBasicInfo
  scalingRisks?: ProjectScalingRisks
  proofVerification?: ProofVerification
  daBridges?: (OnChainDaBridge | EnshrinedBridge | NoDaBridge | DacBridge)[]
  // tags
  isBridge?: true
  isLayer2?: true
  isLayer3?: true
  isScaling?: true
  isZkCatalog?: true
  isDaLayer?: true
  isUpcoming?: true
  isUnderReview?: true
  isArchived?: true
}

export interface ProjectTitle {
  name: string
  shortName: string | undefined
  yellowWarning: string | undefined
  redWarning: string | undefined
}

export interface ProjectScalingBasicInfo {
  type: string
  /** In the future this will be reflected as `type === 'Other'` */
  isOther: boolean
  hostChain: string
  stack: string
  raas: string
  daLayer: string
  stage: string
  purposes: string[]
}

export interface ProjectScalingRisks {
  self: ScalingProjectRiskView
  host: ScalingProjectRiskView | undefined
  stacked: ScalingProjectRiskView | undefined
}
