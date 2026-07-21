import {
  DaThroughputChartParams,
  getDaThroughputChart,
} from '~/server/features/data-availability/throughput/getDaThroughputChart'
import {
  getLayer2sProjectDaThroughputChart,
  Layer2sProjectDaThroughputChartParams,
} from '~/server/features/data-availability/throughput/getLayer2sProjectDaThroughtputChart'
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

  layer2sProjectChart: procedure
    .input(Layer2sProjectDaThroughputChartParams)
    .query(async ({ input }) => getLayer2sProjectDaThroughputChart(input)),
})
