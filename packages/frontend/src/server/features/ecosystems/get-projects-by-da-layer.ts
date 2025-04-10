import type { Project } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'

export type ProjectsByDaLayer = Record<
  string,
  {
    id: ProjectId
    slug: string
    name: string
  }[]
>

export function getProjectsByDaLayer(
  ecosystemProjects: Project<'scalingInfo'>[],
): ProjectsByDaLayer {
  return ecosystemProjects.reduce((acc, curr) => {
    const daLayer = curr.scalingInfo.daLayer
    if (!daLayer) return acc
    if (!acc[daLayer]) {
      acc[daLayer] = []
    }
    acc[daLayer].push({
      id: curr.id,
      slug: curr.slug.toString(),
      name: curr.name,
    })
    return acc
  }, {} as ProjectsByDaLayer)
}
