import {
  TvlChartDataParams,
  getTvlChart,
} from '~/server/features/scaling/tvl/get-tvl-chart-data'
import {
  TvlChartDataParams2,
  getTvlChart2,
} from '~/server/features/scaling/tvl/get-tvl-chart-data-2'
import {
  TokenTvlChartParams,
  getTokenTvlChart,
} from '~/server/features/scaling/tvl/tokens/get-token-tvl-chart'
import { procedure, router } from '../trpc'

export const tvlRouter = router({
  chart: procedure.input(TvlChartDataParams).query(async ({ input }) => {
    return getTvlChart(input)
  }),
  chartV2: procedure.input(TvlChartDataParams2).query(async ({ input }) => {
    return getTvlChart2(input)
  }),
  tokenChart: procedure.input(TokenTvlChartParams).query(async ({ input }) => {
    return getTokenTvlChart(input)
  }),
})
