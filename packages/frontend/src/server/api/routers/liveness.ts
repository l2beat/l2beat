import {
  LivenessProjectChartParams,
  getLivenessProjectChart,
} from '~/server/features/scaling/liveness/get-project-liveness-chart'
import { procedure, router } from '../trpc'

export const livenessRouter = router({
  projectChart: procedure
    .input(LivenessProjectChartParams)
    .query(async ({ input }) => getLivenessProjectChart(input)),
})
