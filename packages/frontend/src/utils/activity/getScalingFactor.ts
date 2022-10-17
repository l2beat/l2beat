import { ActivityApiResponse } from '@l2beat/types'

import { getTransactionWeeklyCount } from './getTransactionWeeklyCount'

export function getScalingFactor(
  activityApiResponse: ActivityApiResponse,
): string {
  const combinedWeeklyCount = getTransactionWeeklyCount(
    activityApiResponse.combined.data,
  )
  const ethereumWeeklyCount = getTransactionWeeklyCount(
    activityApiResponse.ethereum?.data,
  )

  if (!combinedWeeklyCount || !ethereumWeeklyCount) {
    return ''
  }

  const result =
    (combinedWeeklyCount + ethereumWeeklyCount) / ethereumWeeklyCount

  return result.toFixed(2) + 'x'
}
