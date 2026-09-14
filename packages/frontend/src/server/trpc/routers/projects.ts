import { ProjectId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getL2BadgeDialogData } from '~/server/features/projects/badges/getL2BadgeDialogData'
import { getDiscoveryUpdateSections } from '~/server/features/projects/discovery-updates/getDiscoveryUpdateSections'
import { getRecentChangesOverview } from '~/server/features/projects/recent-changes/getRecentChangesOverview'
import { procedure, router } from '../trpc'

export const projectsRouter = router({
  badgesDialog: procedure
    .input(v.object({ badgeId: v.string() }))
    .query(({ input }) => getL2BadgeDialogData(input)),
  recentChanges: procedure.query(() => getRecentChangesOverview()),
  discoveryUpdateSections: procedure
    .input(v.object({ projectId: v.string(), updateIds: v.array(v.string()) }))
    .query(({ input }) =>
      getDiscoveryUpdateSections(ProjectId(input.projectId), input.updateIds),
    ),
})
