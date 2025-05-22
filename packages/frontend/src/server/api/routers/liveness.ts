import {
  ProjectLivenessChartParams,
  getProjectLivenessChart,
} from '~/server/features/scaling/liveness/get-project-liveness-chart'
import { procedure, router } from '../trpc'

export const livenessRouter = router({
  projectChart: procedure
    .input(ProjectLivenessChartParams)
    .query(async ({ input }) => getProjectLivenessChart(input)),
})
