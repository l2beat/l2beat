import { z } from 'zod'
import { getCostsChart } from '~/server/features/scaling/costs/get-costs-chart'
import { getCostsTableData } from '~/server/features/scaling/costs/get-costs-table-data'
import { CostsChartFilter } from '~/server/features/scaling/costs/utils/get-costs-projects'
import { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { procedure, router } from '../../trpc'

export const costsRouter = router({
  chart: procedure
    .input(
      z.object({
        range: CostsTimeRange,
        filter: CostsChartFilter,
      }),
    )
    .query(async ({ input }) => {
      return getCostsChart(input.range, input.filter)
    }),
  table: procedure
    .input(
      z.object({
        range: CostsTimeRange,
      }),
    )
    .query(async ({ input }) => {
      return getCostsTableData(input.range)
    }),
})
