import {
  DetailedTvsChartDataParams,
  getDetailedTvsChart,
} from '~/server/features/layer2s/tvs/getDetailedTvsChart'
import {
  getDetailedTvsChartWithProjectsRanges,
  TvsChartWithProjectsRangesDataParams,
} from '~/server/features/layer2s/tvs/getDetailedTvsChartWithProjectsRanges'
import {
  getRecategorisedTvsChart,
  RecategorisedTvsChartDataParams,
} from '~/server/features/layer2s/tvs/getRecategorisedTvsChartData'
import {
  getTvsChart,
  TvsChartDataParams,
} from '~/server/features/layer2s/tvs/getTvsChartData'
import {
  getTvsChartStats,
  TvsChartStatsParams,
} from '~/server/features/layer2s/tvs/getTvsChartStats'
import {
  getTvsTableData,
  TvsBreakdownProjectParams,
} from '~/server/features/layer2s/tvs/getTvsTableData'
import {
  getTokenTvsChart,
  TokenTvsChartParams,
} from '~/server/features/layer2s/tvs/tokens/getTokenTvsChart'
import { procedure, router } from '../trpc'

export const tvsRouter = router({
  chart: procedure
    .input(TvsChartDataParams)
    .query(({ input }) => getTvsChart(input)),
  detailedChart: procedure
    .input(DetailedTvsChartDataParams)
    .query(({ input }) => getDetailedTvsChart(input)),
  detailedChartWithProjectsRanges: procedure
    .input(TvsChartWithProjectsRangesDataParams)
    .query(({ input }) => getDetailedTvsChartWithProjectsRanges(input)),
  recategorisedChart: procedure
    .input(RecategorisedTvsChartDataParams)
    .query(({ input }) => getRecategorisedTvsChart(input)),
  chartStats: procedure
    .input(TvsChartStatsParams)
    .query(({ input }) => getTvsChartStats(input)),
  tokenChart: procedure
    .input(TokenTvsChartParams)
    .query(({ input }) => getTokenTvsChart(input)),
  table: procedure
    .input(TvsBreakdownProjectParams)
    .query(({ input }) => getTvsTableData(input)),
})
