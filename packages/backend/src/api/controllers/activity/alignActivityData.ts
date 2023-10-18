import {
  ActivityApiChart,
  ActivityApiChartPoint,
  UnixTime,
} from '@l2beat/shared-pure'

import { DailyTransactionCount } from './types'

export function alignActivityData(
  apiChartData: DailyTransactionCount[],
  ethereumChartData: DailyTransactionCount[],
): ActivityApiChartPoint[] {
  const lastProjectTimestamp = apiChartData.at(-1)?.timestamp
  if (!lastProjectTimestamp) {
    throw new Error('No data in activity chart')
  }
  const ethChartTimestampIndex = ethereumChartData.findIndex(
    (x) => x.timestamp.toNumber() === lastProjectTimestamp.toNumber(),
  )
  if (ethChartTimestampIndex === -1) {
    throw new Error('No matching timestamp in ethereum chart')
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
  return data
}
