import { UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'
import { getProjectDaThroughputChart } from '~/server/features/data-availability/throughput/get-project-da-throughput-chart'
import {
  CostsChartParams,
  getCostsChart,
} from '~/server/features/scaling/costs/get-costs-chart'
import { getCostsTable } from '~/server/features/scaling/costs/get-costs-table-data'
import { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { procedure, router } from '../trpc'

export const costsRouter = router({
  chart: procedure
    .input(CostsChartParams)
    .query(async ({ input }) => getCostsChart(input)),
  chartWithDataPosted: procedure
    .input(
      z.object({
        range: CostsTimeRange,
        projectId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const costs = await getCostsChart({
        previewRecategorisation: false,
        filter: { type: 'projects', projectIds: [input.projectId] },
        range: input.range,
      })
      const da = await getProjectDaThroughputChart(input)
      const timestampedDaData = Object.fromEntries(da ?? [])
      return costs.map((cost) => {
        const dailyTimestamp = new UnixTime(cost[0]).toStartOf('day')
        const isHourlyRange = input.range === '1d' || input.range === '7d'
        const posted = timestampedDaData[dailyTimestamp.toNumber()]
        return [
          ...cost,
          posted !== undefined ? (isHourlyRange ? posted / 24 : posted) : null,
        ] as const
      })
    }),
  table: procedure
    .input(
      z.object({
        range: CostsTimeRange,
      }),
    )
    .query(async ({ input }) => getCostsTable(input.range)),
})
