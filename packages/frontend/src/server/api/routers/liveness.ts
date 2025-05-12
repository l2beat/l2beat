import { procedure, router } from '../trpc'
import {
  getProjectLivenessChart,
  ProjectLivenessChartParams,
} from '~/server/features/scaling/liveness/get-project-liveness-chart'

export const livenessRouter = router({
  projectChart: procedure
    .input(ProjectLivenessChartParams)
    .query(async ({ input }) => getProjectLivenessChart(input)),
})
