import { ActivityViewEntry } from './activity/types'
import { ScalingSummaryViewEntry } from './summary/types'
import { ScalingTvlViewEntry } from './tvl/types'

export type ScalingEntry =
  | ScalingSummaryViewEntry
  | ActivityViewEntry
  | ScalingTvlViewEntry
