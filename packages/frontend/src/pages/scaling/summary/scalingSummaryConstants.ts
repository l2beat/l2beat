import { UnixTime } from '@l2beat/shared-pure'

export const SCALING_SUMMARY_TVS_CHART_RANGE_ARGS = ['1y'] as const
export const SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS = [
  '1y',
  {
    offset: -UnixTime.DAY,
  },
] as const
export const SCALING_SUMMARY_UNIT = 'usd'
