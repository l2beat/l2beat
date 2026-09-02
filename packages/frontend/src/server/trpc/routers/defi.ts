import {
  DefiTvlChartParams,
  getDefiTvlChart,
} from '~/server/features/defi/getDefiTvlChart'
import { procedure, router } from '../trpc'

export const defiRouter = router({
  tvlChart: procedure
    .input(DefiTvlChartParams)
    .query(({ input }) => getDefiTvlChart(input)),
})
