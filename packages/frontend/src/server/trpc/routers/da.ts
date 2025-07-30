import {
  DaThroughputChartParams,
  getDaThroughputChart,
} from '~/server/features/data-availability/throughput/getDaThroughputChart'
import {
  DaThroughputChartByProjectParams,
  getDaThroughputChartByProject,
} from '~/server/features/data-availability/throughput/getDaThroughputChartByProject'
import {
  getProjectDaThroughputChartData,
  ProjectDaThroughputChartDataParams,
} from '~/server/features/data-availability/throughput/getProjectDaThroughputChartData'
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
  scalingProjectChart: procedure
    .input(ScalingProjectDaThroughputChartParams)
    .query(async ({ input }) => getScalingProjectDaThroughputChart(input)),
  projectChartByProject: procedure
    .input(DaThroughputChartByProjectParams)
    .query(async ({ input }) => getDaThroughputChartByProject(input)),
})
