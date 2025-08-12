import {
  DaThroughputChartParams,
  getDaThroughputChart,
} from '~/server/features/data-availability/throughput/getDaThroughputChart'
import {
  getProjectDaThroughputChartData,
  ProjectDaThroughputChartDataParams,
} from '~/server/features/data-availability/throughput/getProjectDaThroughputChartData'
import { getProjectDaThroughputCharts } from '~/server/features/data-availability/throughput/getProjectDaThroughputCharts'
import {
  getScalingProjectDaThroughputChart,
  ScalingProjectDaThroughputChartParams,
} from '~/server/features/data-availability/throughput/getScalingProjectDaThroughtputChart'
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

  scalingProjectChart: procedure
    .input(ScalingProjectDaThroughputChartParams)
    .query(async ({ input }) => getScalingProjectDaThroughputChart(input)),
})
