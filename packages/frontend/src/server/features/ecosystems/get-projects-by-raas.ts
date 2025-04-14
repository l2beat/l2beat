import type { Project } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'

export type ProjectByRaas = Record<
  string,
  {
    id: ProjectId
    slug: string
    name: string
  }[]
>

export function getProjectsByRaas(ecosystemProjects: Project<'scalingInfo'>[]) {
  return ecosystemProjects.reduce((acc, curr) => {
    const raas = curr.scalingInfo.raas
    if (!raas) return acc
    if (!acc[raas]) {
      acc[raas] = []
    }
    acc[raas].push({
      id: curr.id,
      slug: curr.slug.toString(),
      name: curr.name,
    })
    return acc
  }, {} as ProjectByRaas)
}
