import { TvlApiResponse, VerificationStatus } from '@l2beat/shared-pure'

import { BridgesRiskViewEntry } from './risk/types'
import { BridgesSummaryViewEntry } from './summary/types'

export interface BridgesPagesData {
  tvlApiResponse: TvlApiResponse
  verificationStatus: VerificationStatus
}

export type BridgesEntry = BridgesSummaryViewEntry | BridgesRiskViewEntry
