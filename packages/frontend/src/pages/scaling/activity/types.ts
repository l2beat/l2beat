import { ProjectCategory, ProjectProvider, StageConfig } from '@l2beat/config'
import { ActivityApiResponse, VerificationStatus } from '@l2beat/shared-pure'

export interface ActivityPagesData {
  activityApiResponse: ActivityApiResponse
  verificationStatus: VerificationStatus
}

export interface ActivityViewEntry {
  name: string
  slug: string
  category: ProjectCategory | undefined
  provider: ProjectProvider | undefined
  warning: string | undefined
  isVerified: boolean | undefined
  showProjectUnderReview: boolean | undefined
  dataSource: string | undefined
  tpsDaily: number | undefined
  tpsWeeklyChange: string
  transactionsMonthlyCount: number | undefined
  maxTps: number | undefined
  maxTpsDate: string | undefined
  stage: StageConfig | undefined
}
