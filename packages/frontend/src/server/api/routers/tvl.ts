import {
  TokenTvlChartParams,
  getTokenTvlChart,
} from '~/server/features/scaling/tvl/tokens/get-token-tvl-chart'
import {
  TvlChartDataParams,
  getTvlChartData,
} from '~/server/features/scaling/tvl/utils/get-tvl-chart-data'
import { procedure, router } from '../trpc'

export const tvlRouter = router({
  chart: procedure.input(TvlChartDataParams).query(async ({ input }) => {
    return getTvlChartData(input)
  }),
  tokenChart: procedure.input(TokenTvlChartParams).query(async ({ input }) => {
    return getTokenTvlChart(input)
  }),
})
