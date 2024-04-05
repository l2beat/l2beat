import {
  Layer2Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  StageConfig,
} from '@l2beat/config'
import {
  ActivityApiResponse,
  ImplementationChangeReportApiResponse,
  VerificationStatus,
} from '@l2beat/shared-pure'

export interface ActivityPagesData {
  activityApiResponse: ActivityApiResponse
  verificationStatus: VerificationStatus
  implementationChange?: ImplementationChangeReportApiResponse
}

export interface ActivityViewEntry {
  name: string
  shortName: string | undefined
  slug: string
  category: ScalingProjectCategory | undefined
  provider: Layer2Provider | undefined
  warning: string | undefined
  hasImplementationChanged?: boolean
  redWarning: string | undefined
  purposes: ScalingProjectPurpose[] | undefined
  isVerified: boolean | undefined
  showProjectUnderReview: boolean | undefined
  dataSource: string | undefined
  data: ActivityViewEntryData | undefined
  stage: StageConfig | undefined
}

export interface ActivityViewEntryData {
  tpsDaily: number
  tpsWeeklyChange: string
  transactionsMonthlyCount: number
  maxTps: number
  maxTpsDate: string
  // TODO: This is fixing typescript error although we will add this field in the future after the backend is ready
  syncStatus?: never
}
