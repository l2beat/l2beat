import { z } from 'zod'
import { getActivityTableData } from '~/server/features/activity/get-activity-table-data'
import { ActivityTimeRange } from '~/server/features/activity/utils/range'
import { procedure, router } from '../../trpc'

export const activityRouter = router({
  table: procedure
    .input(
      z.object({
        timeRange: ActivityTimeRange,
      }),
    )
    .query(async ({ input }) => {
      return getActivityTableData(input.timeRange)
    }),
})
