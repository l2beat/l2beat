import { ActivityApiResponse } from '@l2beat/shared-pure'

import { getTransactionCount } from './getTransactionCount'

export function getScalingFactor(
  activityApiResponse: ActivityApiResponse,
): string {
  const combinedWeeklyCount = getTransactionCount(
    activityApiResponse.combined.data,
    'week',
  )
  const ethereumWeeklyCount = getTransactionCount(
    activityApiResponse.ethereum.data,
    'week',
  )

  if (!combinedWeeklyCount || !ethereumWeeklyCount) {
    return ''
  }

  const result =
    (combinedWeeklyCount + ethereumWeeklyCount) / ethereumWeeklyCount

  return result.toFixed(2) + 'x'
}
