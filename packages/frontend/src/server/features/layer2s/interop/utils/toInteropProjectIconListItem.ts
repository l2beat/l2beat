import type { Project } from '@l2beat/config'
import { unique } from '@l2beat/shared-pure'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { manifest } from '~/utils/Manifest'

export function toInteropProjectIconListItems(
  projects: Project<'interopConfig'>[],
): ProjectIconListItem[] {
  return unique(projects, (project) => project.id)
    .map((project) => ({
      id: project.id,
      name: project.interopConfig.name ?? project.name,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      href: `/interop/protocols/${project.slug}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
