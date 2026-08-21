import {
  DaThroughputChartParams,
  getDaThroughputChart,
} from '~/server/features/data-availability/throughput/getDaThroughputChart'
import {
  getL2ProjectDaThroughputChart,
  L2ProjectDaThroughputChartParams,
} from '~/server/features/data-availability/throughput/getL2ProjectDaThroughtputChart'
import {
  getProjectDaThroughputChartData,
  ProjectDaThroughputChartDataParams,
} from '~/server/features/data-availability/throughput/getProjectDaThroughputChartData'
import { getProjectDaThroughputCharts } from '~/server/features/data-availability/throughput/getProjectDaThroughputCharts'
import { procedure, router } from '../trpc'

export const daRouter = router({
  chart: procedure
    .input(DaThroughputChartParams)
    .query(async ({ input }) => getDaThroughputChart(input)),
  projectChart: procedure
    .input(ProjectDaThroughputChartDataParams)
    .query(async ({ input }) => getProjectDaThroughputChartData(input)),

  projectCharts: procedure
    .input(ProjectDaThroughputChartDataParams)
    .query(async ({ input }) => getProjectDaThroughputCharts(input)),

  l2ProjectChart: procedure
    .input(L2ProjectDaThroughputChartParams)
    .query(async ({ input }) => getL2ProjectDaThroughputChart(input)),
})
