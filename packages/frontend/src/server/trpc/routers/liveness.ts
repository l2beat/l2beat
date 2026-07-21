import {
  getProjectLivenessChart,
  ProjectLivenessChartParams,
} from '~/server/features/layer2s/liveness/getProjectLivenessChart'
import { procedure, router } from '../trpc'

export const livenessRouter = router({
  projectChart: procedure
    .input(ProjectLivenessChartParams)
    .query(async ({ input }) => getProjectLivenessChart(input)),
})
