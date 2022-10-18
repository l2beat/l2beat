import { ActivityApiResponse } from '@l2beat/types'

import { getTransactionMonthlyCount } from './getTransactionWeeklyCount'

export function getScalingFactor(
  activityApiResponse: ActivityApiResponse,
): string {
  const combinedWeeklyCount = getTransactionMonthlyCount(
    activityApiResponse.combined.data,
  )
  const ethereumWeeklyCount = getTransactionMonthlyCount(
    activityApiResponse.ethereum?.data,
  )

  if (!combinedWeeklyCount || !ethereumWeeklyCount) {
    return ''
  }

  const result =
    (combinedWeeklyCount + ethereumWeeklyCount) / ethereumWeeklyCount

  return result.toFixed(2) + 'x'
}
