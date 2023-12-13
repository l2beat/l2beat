import { ActivityViewEntry } from './activity/types'
import { ScalingDetailedTvlViewEntry } from './detailed-tvl/types'
import { ScalingLivenessViewEntry } from './liveness/types'
import { ScalingRiskViewEntry } from './risk/types'
import { ScalingSummaryViewEntry } from './summary/types'

export type ScalingEntry =
  | ScalingSummaryViewEntry
  | ScalingRiskViewEntry
  | ActivityViewEntry
  | ScalingDetailedTvlViewEntry
  | ScalingLivenessViewEntry
