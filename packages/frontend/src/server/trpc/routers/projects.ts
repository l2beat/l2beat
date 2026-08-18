import { v } from '@l2beat/validate'
import { getScalingBadgeDialogData } from '~/server/features/projects/badges/getScalingBadgeDialogData'
import { getRecentChangesOverview } from '~/server/features/projects/recent-changes/getRecentChangesOverview'
import { procedure, router } from '../trpc'

export const projectsRouter = router({
  badgesDialog: procedure
    .input(v.object({ badgeId: v.string() }))
    .query(({ input }) => getScalingBadgeDialogData(input)),
  recentChanges: procedure.query(() => getRecentChangesOverview()),
})
