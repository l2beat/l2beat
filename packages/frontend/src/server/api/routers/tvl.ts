import {
  TvlChartDataParams,
  getTvlChartData,
} from '~/server/features/scaling/tvl/get-tvl-chart-data'
import { getTvlChartTotal } from '~/server/features/scaling/tvl/get-tvl-total'
import {
  TokenTvlChartParams,
  getTokenTvlChart,
} from '~/server/features/scaling/tvl/tokens/get-token-tvl-chart'
import { procedure, router } from '../trpc'

export const tvlRouter = router({
  chart: procedure.input(TvlChartDataParams).query(async ({ input }) => {
    return getTvlChartData(input)
  }),
  total: procedure
    .input(TvlChartDataParams.omit({ range: true }))
    .query(async ({ input }) => {
      return getTvlChartTotal(input)
    }),
  tokenChart: procedure.input(TokenTvlChartParams).query(async ({ input }) => {
    return getTokenTvlChart(input)
  }),
})
