import { z } from 'zod'
import { getActivityChart } from '~/server/features/scaling/activity/get-activity-chart'
import { ActivityProjectFilter } from '~/server/features/scaling/activity/utils/project-filter-utils'
import { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { procedure, router } from '../../trpc'

export const activityRouter = router({
  chart: procedure
    .input(
      z.object({
        range: ActivityTimeRange,
        filter: ActivityProjectFilter,
      }),
    )
    .query(async ({ input }) => {
      return getActivityChart(input.filter, input.range)
    }),
})
