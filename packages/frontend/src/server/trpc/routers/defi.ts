import {
  getTvsChartByProjects,
  TvsChartByProjectsParams,
} from '~/server/features/tvs/getTvsChartByProjects'
import { procedure, router } from '../trpc'

export const defiRouter = router({
  tvlChart: procedure
    .input(TvsChartByProjectsParams)
    .query(({ input }) => getTvsChartByProjects(input)),
})
