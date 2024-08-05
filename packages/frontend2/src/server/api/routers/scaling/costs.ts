import { z } from 'zod'
import { getCostsChart } from '~/server/features/costs/get-costs-chart'
import { getCostsTableData } from '~/server/features/costs/get-costs-table-data'
import { CostsTimeRange } from '~/server/features/costs/utils/range'
import { procedure, router } from '../../trpc'

export const costsRouter = router({
  chart: procedure
    .input(
      z.object({
        range: CostsTimeRange,
      }),
    )
    .query(async ({ input }) => {
      return getCostsChart(input.range)
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
