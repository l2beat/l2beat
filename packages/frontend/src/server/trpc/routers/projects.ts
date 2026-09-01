import { v } from '@l2beat/validate'
import { getL2BadgeDialogData } from '~/server/features/projects/badges/getL2BadgeDialogData'
import { getRecentChangesOverview } from '~/server/features/projects/recent-changes/getRecentChangesOverview'
import { procedure, router } from '../trpc'

export const projectsRouter = router({
  badgesDialog: procedure
    .input(v.object({ badgeId: v.string() }))
    .query(({ input }) => getL2BadgeDialogData(input)),
  recentChanges: procedure.query(() => getRecentChangesOverview()),
})
