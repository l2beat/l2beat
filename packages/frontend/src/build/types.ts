import {
  ActivityApiResponse,
  TvlApiResponse,
  VerificationStatus,
} from '@l2beat/shared'

export interface PagesData {
  tvlApiResponse: TvlApiResponse
  activityApiResponse: ActivityApiResponse | undefined
  verificationStatus: VerificationStatus
}
