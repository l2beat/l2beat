import {
  Layer2Provider,
  ScalingProjectCategory,
  ScalingProjectRiskViewEntry,
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
  category: ScalingProjectCategory
  provider?: Layer2Provider
  warning?: string
  redWarning: string | undefined
  isArchived?: boolean
  isVerified?: boolean
  showProjectUnderReview?: boolean
  isUpcoming?: boolean
  stateValidation: ScalingProjectRiskViewEntry
  dataAvailability: ScalingProjectRiskViewEntry
  exitWindow: ScalingProjectRiskViewEntry
  sequencerFailure: ScalingProjectRiskViewEntry
  proposerFailure: ScalingProjectRiskViewEntry
  stage: StageConfig
}
