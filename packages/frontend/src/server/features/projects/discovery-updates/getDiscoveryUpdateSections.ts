import type { ProjectDiscoveryUpdateSection } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'

export async function getDiscoveryUpdateSections(
  projectId: ProjectId,
  updateIds: string[],
): Promise<Record<string, ProjectDiscoveryUpdateSection[]>> {
  const project = await ps.getProject({
    id: projectId,
    select: ['discoveryUpdates'],
  })
  const sectionsById = new Map(
    project?.discoveryUpdates.map((update) => [update.id, update.sections]),
  )
  return Object.fromEntries(
    updateIds.map((id) => [id, sectionsById.get(id) ?? []]),
  )
}
