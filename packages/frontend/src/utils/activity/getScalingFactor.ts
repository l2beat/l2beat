import { ActivityApiResponse } from '@l2beat/shared-pure'

import { getTransactionCount } from './getTransactionCount'

export function getScalingFactor(
  activityApiResponse: ActivityApiResponse,
): string {
  activityApiResponse.combined.daily.data
  const combinedWeeklyCount = getTransactionCount(
    activityApiResponse.combined.daily.data,
    'project',
    'week',
  )
  const ethereumWeeklyCount = getTransactionCount(
    activityApiResponse.combined.daily.data,
    'ethereum',
    'week',
  )

  if (!combinedWeeklyCount || !ethereumWeeklyCount) {
    return ''
  }

  const result =
    (combinedWeeklyCount + ethereumWeeklyCount) / ethereumWeeklyCount

  return result.toFixed(2) + 'x'
}
