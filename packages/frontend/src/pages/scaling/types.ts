import { ActivityViewEntry } from './activity/view/types'
import { ScalingDetailedTvlViewEntry } from './detailed-tvl/types'
import { ScalingRiskViewEntry } from './risk/view/types'
import { ScalingTvlViewEntry } from './tvl/types'

export type ScalingEntry =
  | ScalingTvlViewEntry
  | ScalingRiskViewEntry
  | ActivityViewEntry
  | ScalingDetailedTvlViewEntry
