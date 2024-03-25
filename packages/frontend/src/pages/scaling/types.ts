import { ActivityViewEntry } from './activity/types'
import { ScalingDataAvailabilityViewEntry } from './data-availability/types'
import { ScalingFinalityViewEntry } from './finality/types'
import { ScalingL2CostsViewEntry } from './l2-costs/types'
import { ScalingLivenessViewEntry } from './liveness/types'
import { ScalingRiskViewEntry } from './risk/types'
import { ScalingSummaryViewEntry } from './summary/types'
import { ScalingTvlViewEntry } from './tvl/types'

export type ScalingEntry =
  | ScalingSummaryViewEntry
  | ScalingRiskViewEntry
  | ActivityViewEntry
  | ScalingTvlViewEntry
  | ScalingLivenessViewEntry
  | ScalingFinalityViewEntry
  | ScalingDataAvailabilityViewEntry
  | ScalingL2CostsViewEntry
