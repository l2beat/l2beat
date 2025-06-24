import {
  DaThroughputChartParams,
  getDaThroughputChart,
} from '~/server/features/data-availability/throughput/getDaThroughputChart'
import {
  DaThroughputChartByProjectParams,
  getDaThroughputChartByProject,
} from '~/server/features/data-availability/throughput/getDaThroughputChartByProject'
import {
  ProjectDaThroughputChartParams,
  getProjectDaThroughputChart,
} from '~/server/features/data-availability/throughput/getProjectDaThroughputChart'
import { procedure, router } from '../trpc'

export const daRouter = router({
  chart: procedure
    .input(DaThroughputChartParams)
    .query(async ({ input }) => getDaThroughputChart(input)),
  projectChart: procedure
    .input(ProjectDaThroughputChartParams)
    .query(async ({ input }) => getProjectDaThroughputChart(input)),
  projectChartByProject: procedure
    .input(DaThroughputChartByProjectParams)
    .query(async ({ input }) => getDaThroughputChartByProject(input)),
})
