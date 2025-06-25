import { v as z } from '@l2beat/validate'
import {
  ActivityChartParams,
  getActivityChart,
} from '~/server/features/scaling/activity/getActivityChart'
import { getActivityChartStats } from '~/server/features/scaling/activity/getActivityChartStats'
import { getRecategorisedActivityChart } from '~/server/features/scaling/activity/getRecategorisedActivityChart'
import { ActivityProjectFilter } from '~/server/features/scaling/activity/utils/projectFilterUtils'
import { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { procedure, router } from '../trpc'

export const activityRouter = router({
  chart: procedure.input(ActivityChartParams).query(({ input }) => {
    return getActivityChart(input)
  }),
  recategorisedChart: procedure
    .input(
      z.object({
        range: ActivityTimeRange,
        filter: ActivityProjectFilter,
      }),
    )
    .query(({ input }) => {
      return getRecategorisedActivityChart(input.filter, input.range)
    }),
  chartStats: procedure
    .input(
      z.object({
        filter: ActivityProjectFilter,
      }),
    )
    .query(({ input }) => {
      return getActivityChartStats(input.filter)
    }),
})
