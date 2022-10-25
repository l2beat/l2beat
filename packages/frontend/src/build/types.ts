import { ActivityApiResponse, TvlApiResponse } from '@l2beat/types'

export interface PagesData {
  tvlApiResponse: TvlApiResponse
  activityApiResponse: ActivityApiResponse
  verificationStatus: Record<string, boolean>
}
