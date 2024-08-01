import {
  ImplementationChangeReportApiResponse,
  TvlApiResponse,
  VerificationStatus,
} from '@l2beat/shared-pure'

import { BridgesRiskViewEntry } from './risk/types'

export interface BridgesPagesData {
  tvlApiResponse: TvlApiResponse
  verificationStatus: VerificationStatus
  implementationChange: ImplementationChangeReportApiResponse | undefined
}

export type BridgesEntry = BridgesRiskViewEntry
