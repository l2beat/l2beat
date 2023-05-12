import {
  ActivityApiResponse,
  TvlApiResponse,
  VerificationStatus,
} from '@l2beat/common'

export interface PagesData {
  tvlApiResponse: TvlApiResponse
  activityApiResponse: ActivityApiResponse | undefined
  verificationStatus: VerificationStatus
}
