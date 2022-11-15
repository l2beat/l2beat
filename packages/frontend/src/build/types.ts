import {
  ActivityApiResponse,
  TvlApiResponse,
  VerificationStatus,
} from '@l2beat/types'

export interface PagesData {
  tvlApiResponse: TvlApiResponse
  activityApiResponse: ActivityApiResponse | undefined
  verificationStatus: VerificationStatus
}
