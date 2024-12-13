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
  name: string
  addedAt: UnixTime
  // data
  proofVerification?: ProofVerification
  scalingRisks?: ProjectScalingRisks
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

export interface ProjectScalingRisks {
  self: ScalingProjectRiskView
  host: ScalingProjectRiskView | undefined
  stacked: ScalingProjectRiskView | undefined
}
