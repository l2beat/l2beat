import {
  RecategorisedTvsChartDataParams,
  getRecategorisedTvsChart,
} from '~/server/features/scaling/new-tvs/get-recategorised-tvs-chart-data'
import {
  TvsChartDataParams,
  getTvsChart,
} from '~/server/features/scaling/new-tvs/get-tvs-chart-data'
import {
  TokenTvsChartParams,
  getTokenTvsChart,
} from '~/server/features/scaling/new-tvs/tokens/get-token-tvs-chart'
import { procedure, router } from '../trpc'

export const newTvsRouter = router({
  chart: procedure.input(TvsChartDataParams).query(async ({ input }) => {
    return getTvsChart(input)
  }),
  recategorisedChart: procedure
    .input(RecategorisedTvsChartDataParams)
    .query(async ({ input }) => {
      return getRecategorisedTvsChart(input)
    }),
  tokenChart: procedure.input(TokenTvsChartParams).query(async ({ input }) => {
    return getTokenTvsChart(input)
  }),
})
