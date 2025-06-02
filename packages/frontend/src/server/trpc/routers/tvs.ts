import {
  RecategorisedTvsChartDataParams,
  getRecategorisedTvsChart,
} from '~/server/features/scaling/tvs/get-recategorised-tvs-chart-data'
import {
  TvsChartDataParams,
  getTvsChart,
} from '~/server/features/scaling/tvs/get-tvs-chart-data'
import {
  TokenTvsChartParams,
  getTokenTvsChart,
} from '~/server/features/scaling/tvs/tokens/get-token-tvs-chart'
import { procedure, router } from '../trpc'

export const tvsRouter = router({
  chart: procedure
    .input(TvsChartDataParams)
    .query(({ input }) => getTvsChart(input)),
  recategorisedChart: procedure
    .input(RecategorisedTvsChartDataParams)
    .query(({ input }) => getRecategorisedTvsChart(input)),
  tokenChart: procedure
    .input(TokenTvsChartParams)
    .query(({ input }) => getTokenTvsChart(input)),
})
