import { Layer2 } from '@l2beat/config'

export interface ActivityViewEntry {
  name: string
  slug: string
  category?: Layer2['display']['category']
  provider?: Layer2['display']['provider']
  warning?: string
  isVerified?: boolean
  isUpcoming?: boolean
  isArchived?: boolean
  showProjectUnderReview?: boolean
  dataSource?: string
  tpsDaily?: number
  tpsWeeklyChange: string
  transactionsMonthlyCount: number | undefined
  maxTps?: number
  maxTpsDate?: string
}
