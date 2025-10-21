import {
  get7dTvsBreakdown,
  TvsBreakdownProjectFilter,
} from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import {
  DetailedTvsChartDataParams,
  getDetailedTvsChart,
} from '~/server/features/scaling/tvs/getDetailedTvsChart'
import {
  getRecategorisedTvsChart,
  RecategorisedTvsChartDataParams,
} from '~/server/features/scaling/tvs/getRecategorisedTvsChartData'
import {
  getTvsChart,
  TvsChartDataParams,
} from '~/server/features/scaling/tvs/getTvsChartData'
import {
  getTokenTvsChart,
  TokenTvsChartParams,
} from '~/server/features/scaling/tvs/tokens/getTokenTvsChart'
import { procedure, router } from '../trpc'

export const tvsRouter = router({
  chart: procedure
    .input(TvsChartDataParams)
    .query(({ input }) => getTvsChart(input)),
  detailedChart: procedure
    .input(DetailedTvsChartDataParams)
    .query(({ input }) => getDetailedTvsChart(input)),
  recategorisedChart: procedure
    .input(RecategorisedTvsChartDataParams)
    .query(({ input }) => getRecategorisedTvsChart(input)),
  tokenChart: procedure
    .input(TokenTvsChartParams)
    .query(({ input }) => getTokenTvsChart(input)),
  table: procedure
    .input(TvsBreakdownProjectFilter)
    .query(({ input }) => get7dTvsBreakdown(input)),
})
