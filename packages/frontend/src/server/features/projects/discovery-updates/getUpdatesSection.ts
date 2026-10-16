import type { ProjectDiscoveryUpdate } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { UPDATES_PAGE_SIZE } from '~/components/projects/sections/updatesPaging'
import type { SsrHelpers } from '~/trpc/server'
import type { ProjectOssificationView } from '../ossification/getProjectOssification'

export async function getUpdatesSection(
  helpers: SsrHelpers,
  projectId: ProjectId,
  updates: ProjectDiscoveryUpdate[],
  ossification?: ProjectOssificationView,
): Promise<ProjectDetailsSection | undefined> {
  if (updates.length === 0 && !ossification) {
    return undefined
  }

  // Diff bodies are the bulk of a project's update history. Only the first
  // page's bodies ride along in the dehydrated query cache; the section fetches
  // later pages on demand through the same query.
  if (updates.length > 0) {
    await helpers.queryClient.prefetchQuery(
      helpers.trpc.projects.discoveryUpdateSections.queryOptions({
        projectId,
        updateIds: updates.slice(0, UPDATES_PAGE_SIZE).map((u) => u.id),
      }),
    )
  }

  return {
    type: 'UpdatesSection',
    props: {
      id: 'updates',
      title: ossification ? 'Ossification & Updates' : 'Updates',
      projectId,
      updates: updates.map(({ sections: _, ...summary }) => summary),
      ossification,
    },
  }
}
