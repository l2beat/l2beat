import type { ProjectDiscoveryUpdate } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { UpdatesSectionProps } from '~/components/projects/sections/UpdatesSection'
import { UPDATES_PAGE_SIZE } from '~/components/projects/sections/updatesPaging'
import type { SsrHelpers } from '~/trpc/server'

// Diff bodies are the bulk of a project's update history. Only the first
// page's bodies ride along in the dehydrated query cache; the section fetches
// later pages on demand through the same query.
export async function getUpdatesSectionProps(
  helpers: SsrHelpers,
  projectId: ProjectId,
  updates: ProjectDiscoveryUpdate[],
): Promise<Pick<UpdatesSectionProps, 'projectId' | 'updates'>> {
  await helpers.queryClient.prefetchQuery(
    helpers.trpc.projects.discoveryUpdateSections.queryOptions({
      projectId,
      updateIds: updates.slice(0, UPDATES_PAGE_SIZE).map((u) => u.id),
    }),
  )
  return {
    projectId,
    updates: updates.map(({ sections: _, ...summary }) => summary),
  }
}
