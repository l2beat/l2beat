import type { Project } from '@l2beat/config'
import type { UsedInProjectWithIcon } from '~/pages/data-availability/summary/components/table/projects-used-in'
import { getProjectIcon } from '../utils/get-project-icon'

export type ProjectByRaas = Record<
  string,
  { projects: UsedInProjectWithIcon[]; icon: string }
>

export function getProjectsByRaas(ecosystemProjects: Project<'scalingInfo'>[]) {
  return ecosystemProjects.reduce((acc, curr) => {
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
    })
    return acc
  }, {} as ProjectByRaas)
}
