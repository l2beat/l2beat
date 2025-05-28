import {
  CostsChartParams,
  getCostsChart,
} from 'rewrite/src/server/features/scaling/costs/get-costs-chart'
import { getCostsTable } from 'rewrite/src/server/features/scaling/costs/get-costs-table-data'
import {
  ProjectCostsChartParams,
  getProjectCostsChart,
} from 'rewrite/src/server/features/scaling/costs/get-project-costs-chart'
import { CostsTimeRange } from 'rewrite/src/server/features/scaling/costs/utils/range'
import { z } from 'zod'
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
