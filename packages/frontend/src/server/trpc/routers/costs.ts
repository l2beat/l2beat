import { z } from 'zod'
import {
  ProjectCostsChartParams,
  getProjectCostsChart,
} from '~/server/features/scaling/costs/getProjectCostsChart'
import {
  CostsChartParams,
  getCostsChart,
} from '~/server/features/scaling/costs/getCostsChart'
import { getCostsTable } from '~/server/features/scaling/costs/getCostsTableData'
import { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { procedure, router } from '../trpc'

export const costsRouter = router({
  chart: procedure
    .input(CostsChartParams)
    .query(async ({ input }) => getCostsChart(input)),
  projectChart: procedure
    .input(ProjectCostsChartParams)
    .query(async ({ input }) => getProjectCostsChart(input)),
  table: procedure
    .input(
      z.object({
        range: CostsTimeRange,
      }),
    )
    .query(async ({ input }) => getCostsTable(input.range)),
})
