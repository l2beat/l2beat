import { ActivityViewEntry } from './activity/types'
import { ScalingCostsViewEntry } from './costs/types'
import { ScalingFinalityViewEntry } from './finality/types'
import { ScalingLivenessViewEntry } from './liveness/types'
import { ScalingSummaryViewEntry } from './summary/types'
import { ScalingTvlViewEntry } from './tvl/types'

export type ScalingEntry =
  | ScalingSummaryViewEntry
  | ActivityViewEntry
  | ScalingTvlViewEntry
  | ScalingLivenessViewEntry
  | ScalingFinalityViewEntry
  | ScalingCostsViewEntry
