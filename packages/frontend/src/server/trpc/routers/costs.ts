import { v } from '@l2beat/validate'
import {
  CostsChartParams,
  getCostsChart,
} from '~/server/features/layer2s/costs/getCostsChart'
import { getCostsTable } from '~/server/features/layer2s/costs/getCostsTableData'
import {
  getProjectCostsChart,
  ProjectCostsChartParams,
} from '~/server/features/layer2s/costs/getProjectCostsChart'
import { ChartRange } from '~/utils/range/range'
import { procedure, router } from '../trpc'

export const costsRouter = router({
  chart: procedure
    .input(CostsChartParams)
    .query(async ({ input }) => getCostsChart(input)),
  projectChart: procedure
    .input(ProjectCostsChartParams)
    .query(async ({ input }) => getProjectCostsChart(input)),
  table: procedure
    .input(v.object({ range: ChartRange }))
    .query(async ({ input }) => getCostsTable(input.range)),
})
