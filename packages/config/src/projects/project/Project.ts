import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProofVerification } from '../types'

export interface Project {
  id: ProjectId
  slug: string
  name: string
  addedAt: UnixTime
  // data
  proofVerification?: ProofVerification
  // tags
  isBridge?: true
  isLayer2?: true
  isLayer3?: true
  isScaling?: true
  isUpcoming?: true
  isUnderReview?: true
  isArchived?: true
}
