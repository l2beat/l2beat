import {
  ProjectCategory,
  ProjectProvider,
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
  provider?: ProjectProvider
  warning?: string
  isArchived?: boolean
  isVerified?: boolean
  showProjectUnderReview?: boolean
  isUpcoming?: boolean
  stateValidation: ProjectRiskViewEntry
  dataAvailability: ProjectRiskViewEntry
  upgradeability: ProjectRiskViewEntry
  sequencerFailure: ProjectRiskViewEntry
  proposerFailure: ProjectRiskViewEntry
  stage: StageConfig
}
