import {
  ActivityChartParams,
  getActivityChart,
} from 'rewrite/src/server/features/scaling/activity/get-activity-chart'
import { getActivityChartStats } from 'rewrite/src/server/features/scaling/activity/get-activity-chart-stats'
import { getRecategorisedActivityChart } from 'rewrite/src/server/features/scaling/activity/get-recategorised-activity-chart'
import { ActivityProjectFilter } from 'rewrite/src/server/features/scaling/activity/utils/project-filter-utils'
import { ActivityTimeRange } from 'rewrite/src/server/features/scaling/activity/utils/range'
import { z } from 'zod'
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
        previewRecategorisation: z.boolean(),
      }),
    )
    .query(({ input }) => {
      return getRecategorisedActivityChart(
        input.filter,
        input.range,
        input.previewRecategorisation,
      )
    }),
  chartStats: procedure
    .input(
      z.object({
        filter: ActivityProjectFilter,
        previewRecategorisation: z.boolean(),
      }),
    )
    .query(({ input }) => {
      return getActivityChartStats(input.filter, input.previewRecategorisation)
    }),
})
