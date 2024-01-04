import {
  Layer2Provider,
  ProjectCategory,
  ProjectRiskViewEntry,
  StageConfig,
} from '@l2beat/config'
import { TvlApiResponse, VerificationStatus } from '@l2beat/shared-pure'

export interface ScalingRiskPagesData {
  verificationStatus: VerificationStatus
  tvlApiResponse: TvlApiResponse
}

export interface ScalingRiskViewEntry {
  name: string
  slug: string
  category: ProjectCategory
  provider?: Layer2Provider
  warning?: string
  isArchived?: boolean
  isVerified?: boolean
  showProjectUnderReview?: boolean
  isUpcoming?: boolean
  stateValidation: ProjectRiskViewEntry
  dataAvailability: ProjectRiskViewEntry
  exitWindow: ProjectRiskViewEntry
  sequencerFailure: ProjectRiskViewEntry
  proposerFailure: ProjectRiskViewEntry
  stage: StageConfig
}
