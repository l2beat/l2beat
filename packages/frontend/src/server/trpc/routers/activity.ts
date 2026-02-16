import { v as z } from '@l2beat/validate'
import {
  ActivityChartParams,
  getActivityChart,
} from '~/server/features/scaling/activity/getActivityChart'
import { getActivityChartStats } from '~/server/features/scaling/activity/getActivityChartStats'
import {
  EthereumActivityChartParams,
  getEthereumActivityChart,
} from '~/server/features/scaling/activity/getEthereumActivityChart'
import { getRecategorisedActivityChart } from '~/server/features/scaling/activity/getRecategorisedActivityChart'
import { ActivityProjectFilter } from '~/server/features/scaling/activity/utils/projectFilterUtils'
import { ChartRange } from '~/utils/range/range'
import { procedure, router } from '../trpc'

export const activityRouter = router({
  chart: procedure
    .input(ActivityChartParams)
    .query(({ input }) => getActivityChart(input)),
  ethereumChart: procedure
    .input(EthereumActivityChartParams)
    .query(({ input }) => getEthereumActivityChart(input)),
  recategorisedChart: procedure
    .input(
      z.object({
        range: ChartRange,
        filter: ActivityProjectFilter,
      }),
    )
    .query(({ input }) =>
      getRecategorisedActivityChart(input.filter, input.range),
    ),
  chartStats: procedure
    .input(
      z.object({
        filter: ActivityProjectFilter,
      }),
    )
    .query(({ input }) => getActivityChartStats(input.filter)),
})
