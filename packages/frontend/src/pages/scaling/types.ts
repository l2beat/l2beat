import { ActivityViewEntry } from './activity/types'
import { ScalingDetailedTvlViewEntry } from './detailed-tvl/types'
import { ScalingLivenessViewEntry } from './liveness/types'
import { ScalingRiskViewEntry } from './risk/types'
import { ScalingTvlViewEntry } from './tvl/types'

export type ScalingEntry =
  | ScalingTvlViewEntry
  | ScalingRiskViewEntry
  | ActivityViewEntry
  | ScalingDetailedTvlViewEntry
  | ScalingLivenessViewEntry
