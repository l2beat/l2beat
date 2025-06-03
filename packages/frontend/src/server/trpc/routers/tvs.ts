import {
  RecategorisedTvsChartDataParams,
  getRecategorisedTvsChart,
} from '~/server/features/scaling/tvs/getRecategorisedTvsChartData'
import {
  TvsChartDataParams,
  getTvsChart,
} from '~/server/features/scaling/tvs/getTvsChartData'
import {
  TokenTvsChartParams,
  getTokenTvsChart,
} from '~/server/features/scaling/tvs/tokens/getTokenTvsChart'
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
