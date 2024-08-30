import { z } from 'zod'
import {
  CostsChartParams,
  getCostsChart,
} from '~/server/features/scaling/costs/get-costs-chart'
import { getCostsTableData } from '~/server/features/scaling/costs/get-costs-table-data'
import { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { procedure, router } from '../trpc'

export const costsRouter = router({
  chart: procedure.input(CostsChartParams).query(async ({ input }) => {
    return getCostsChart(input)
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
