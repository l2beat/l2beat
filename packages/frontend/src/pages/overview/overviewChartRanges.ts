import { UnixTime } from '@l2beat/shared-pure'

export const OVERVIEW_TVS_CHART_RANGE_ARGS = ['1y'] as const
export const OVERVIEW_ACTIVITY_CHART_RANGE_ARGS = [
  '1y',
  {
    offset: -UnixTime.DAY,
  },
] as const
export const OVERVIEW_DA_CHART_RANGE_ARGS = ['1y'] as const
