import { ActivityViewEntry } from './activity/types'
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
