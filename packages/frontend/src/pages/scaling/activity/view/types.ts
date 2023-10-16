import { Layer2, StageConfig } from '@l2beat/config'

export interface ActivityViewEntry {
  name: string
  slug: string
  category: Layer2['display']['category'] | undefined
  provider: Layer2['display']['provider'] | undefined
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
