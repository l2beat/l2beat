import { UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { DaThroughputTimeRange } from './utils/range'

interface DaThroughputDataPoint {
  timestamp: number
  ethereum: number
  celestia: number
  avail: number
}

export const DaThroughputChartParams = z.object({
  range: DaThroughputTimeRange,
})
export type DaThroughputChartParams = z.infer<typeof DaThroughputChartParams>

const data: Record<DaThroughputTimeRange, DaThroughputDataPoint[]> = {
  '30d': [],
  '90d': [],
  '180d': [],
  max: [],
}

export function getDaThroughputChart(
  params: DaThroughputChartParams,
): DaThroughputDataPoint[] {
  if (data[params.range].length === 0) {
    data[params.range] = getMockDaThroughputChartData(params)
  }
  return data[params.range]
}

function getMockDaThroughputChartData({
  range,
}: DaThroughputChartParams): DaThroughputDataPoint[] {
  const now = UnixTime.now().toStartOf('day')
  const days = range === 'max' ? 365 : parseInt(range)
  const from = now.add(-days, 'days')

  const timestamps = generateTimestamps([from, now], 'daily')

  return timestamps.map((timestamp) => {
    // Generate random but somewhat realistic values
    const ethereum = 150 + Math.random() * 200 // Between 150-350
    const celestia = 50 + Math.random() * 150 // Between 50-200
    const avail = 80 + Math.random() * 50 // Between 80-130

    return {
      timestamp: timestamp.toNumber(),
      ethereum: Math.round(ethereum),
      celestia: Math.round(celestia),
      avail: Math.round(avail),
    }
  })
}
