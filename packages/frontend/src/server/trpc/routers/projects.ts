import { v } from '@l2beat/validate'
import { getLayer2sBadgeDialogData } from '~/server/features/projects/badges/getLayer2sBadgeDialogData'
import { getRecentChangesOverview } from '~/server/features/projects/recent-changes/getRecentChangesOverview'
import { getSearchBarProjects } from '~/server/features/projects/search-bar/getSearchBarProjects'
import { procedure, router } from '../trpc'

export const projectsRouter = router({
  searchBar: procedure
    .input(v.string())
    .query(({ input }) => getSearchBarProjects(input)),
  badgesDialog: procedure
    .input(v.object({ badgeId: v.string() }))
    .query(({ input }) => getLayer2sBadgeDialogData(input)),
  recentChanges: procedure.query(() => getRecentChangesOverview()),
})
