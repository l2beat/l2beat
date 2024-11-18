import { z } from 'zod'
import { getActivityChart } from '~/server/features/scaling/activity/get-activity-chart'
import { getActivityChartStats } from '~/server/features/scaling/activity/get-activity-chart-stats'
import { ActivityProjectFilter } from '~/server/features/scaling/activity/utils/project-filter-utils'
import { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { procedure, router } from '../trpc'

export const activityRouter = router({
  chart: procedure
    .input(
      z.object({
        range: ActivityTimeRange,
        filter: ActivityProjectFilter,
      }),
    )
    .query(({ input, ctx }) => {
      return getActivityChart(ctx.db, input.filter, input.range)
    }),
  chartStats: procedure
    .input(z.object({ filter: ActivityProjectFilter }))
    .query(({ input, ctx }) => {
      return getActivityChartStats(ctx.db, input.filter)
    }),
})
