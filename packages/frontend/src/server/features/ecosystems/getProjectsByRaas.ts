import type { Project } from '@l2beat/config'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import { getProjectIcon } from '../utils/getProjectIcon'

export type ProjectByRaas = Record<
  string,
  { projects: UsedInProjectWithIcon[]; icon: string }
>

export function getProjectsByRaas(ecosystemProjects: Project<'scalingInfo'>[]) {
  const unsorted = ecosystemProjects.reduce((acc, curr) => {
    const raas = curr.scalingInfo.raas
    if (!raas) return acc
    if (!acc[raas]) {
      acc[raas] = {
        projects: [],
        icon: getProjectIcon(raas.toLowerCase()),
      }
    }
    acc[raas].projects.push({
      id: curr.id,
      slug: curr.slug.toString(),
      icon: getProjectIcon(curr.slug),
      name: curr.name,
      url: `/scaling/projects/${curr.slug}`,
    })
    return acc
  }, {} as ProjectByRaas)

  return Object.fromEntries(
    Object.entries(unsorted).sort(
      ([, a], [, b]) => b.projects.length - a.projects.length,
    ),
  )
}
