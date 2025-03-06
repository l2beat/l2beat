import { UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'
import { getProjectDaThroughputChart } from '../../data-availability/throughput/get-project-da-throughput-chart'
import { getCostsChart } from './get-costs-chart'
import { CostsTimeRange } from './utils/range'

export type CostsWithThroughputParams = z.infer<
  typeof CostsWithThroughputParams
>
export const CostsWithThroughputParams = z.object({
  range: CostsTimeRange,
  projectId: z.string(),
})

export async function getCostsWithThroughputData(
  params: CostsWithThroughputParams,
) {
  const costs = await getCostsChart({
    previewRecategorisation: false,
    filter: { type: 'projects', projectIds: [params.projectId] },
    range: params.range,
  })
  const da = await getProjectDaThroughputChart(params)
  const timestampedDaData = Object.fromEntries(da ?? [])
  return costs.map((cost) => {
    const dailyTimestamp = UnixTime.toStartOf(cost[0], 'day')
    const isHourlyRange = params.range === '1d' || params.range === '7d'
    const posted = timestampedDaData[dailyTimestamp]
    return [
      ...cost,
      posted !== undefined ? (isHourlyRange ? posted / 24 : posted) : null,
    ] as const
  })
}
