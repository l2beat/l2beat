import type { ProjectDiscoveryUpdateSection } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'

export async function getDiscoveryUpdateSections(input: {
  projectId: string
  updateIds: string[]
}): Promise<Record<string, ProjectDiscoveryUpdateSection[]>> {
  const project = await ps.getProject({
    id: ProjectId(input.projectId),
    select: ['discoveryUpdates'],
  })
  const wanted = new Set(input.updateIds)
  return Object.fromEntries(
    (project?.discoveryUpdates ?? [])
      .filter((update) => wanted.has(update.id))
      .map((update) => [update.id, update.sections]),
  )
}
