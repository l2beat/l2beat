import {
  ActivityApiChart,
  ActivityApiChartPoint,
  Result,
  UnixTime,
} from '@l2beat/shared-pure'

import { DailyTransactionCount } from './types'

export function alignActivityData(
  apiChartData: DailyTransactionCount[],
  ethereumChartData: DailyTransactionCount[],
): Result<
  ActivityApiChartPoint[],
  'DATA_NOT_SYNCED' | 'ETHEREUM_DATA_DELAYED'
> {
  const lastProjectTimestamp = apiChartData.at(-1)?.timestamp
  if (!lastProjectTimestamp) {
    // No data in activity chart
    return { type: 'error', error: 'DATA_NOT_SYNCED' }
  }
  const ethChartTimestampIndex = ethereumChartData.findIndex(
    (x) => x.timestamp.toNumber() === lastProjectTimestamp.toNumber(),
  )
  if (ethChartTimestampIndex === -1) {
    return { type: 'error', error: 'ETHEREUM_DATA_DELAYED' }
  }
  const alignedEthChartData = ethereumChartData.slice(
    0,
    ethChartTimestampIndex + 1,
  )
  const length = Math.min(apiChartData.length, alignedEthChartData.length)

  const data: ActivityApiChart['data'] = new Array(length)
    .fill(0)
    .map((_, i) => {
      const apiPoint = apiChartData.at(-length + i)
      const ethPoint = alignedEthChartData.at(-length + i)
      return [
        apiPoint?.timestamp ?? new UnixTime(0),
        apiPoint?.count ?? 0,
        ethPoint?.count ?? 0,
      ]
    })

  return {
    type: 'success',
    data,
  }
}
