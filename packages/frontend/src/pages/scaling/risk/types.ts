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
  shortName: string | undefined
  slug: string
  category: ProjectCategory
  provider?: Layer2Provider
  warning?: string
  redWarning: string | undefined
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
