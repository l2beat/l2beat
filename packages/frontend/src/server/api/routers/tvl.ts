import {
  TvlChartDataParams,
  getTvlChart,
} from '~/server/features/scaling/tvl/get-tvl-chart-data'
import {
  TokenTvlChartParams,
  getTokenTvlChart,
} from '~/server/features/scaling/tvl/tokens/get-token-tvl-chart'
import { procedure, router } from '../trpc'

export const tvlRouter = router({
  chart: procedure.input(TvlChartDataParams).query(async ({ input }) => {
    return getTvlChart(input)
  }),
  tokenChart: procedure.input(TokenTvlChartParams).query(async ({ input }) => {
    return getTokenTvlChart(input)
  }),
})
