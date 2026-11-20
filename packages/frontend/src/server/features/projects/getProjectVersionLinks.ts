import { ps } from '~/server/projects'
import { getProjectPath } from '~/utils/project/getProjectPath'

export interface ProjectVersionLinks {
  groupName: string
  versions: ProjectVersionLink[]
}

export interface ProjectVersionLink {
  name: string
  label: string
  href: string
  isCurrent: boolean
  isLatest: boolean
  isArchived: boolean
}

/** Links to every version's page. */
export async function getProjectVersionLinks(
  slug: string,
): Promise<ProjectVersionLinks | undefined> {
  const project = await ps.getProject({ slug, optional: ['versions'] })
  const versions = project?.versions
  if (!versions) return undefined
  return {
    groupName: versions.group.name,
    versions: versions.siblings.map((sibling) => ({
      name: sibling.name,
      label: sibling.label,
      href: getProjectPath(sibling.slug),
      isCurrent: sibling.slug === slug,
      isLatest: sibling.isLatest,
      isArchived: sibling.archivedAt !== undefined,
    })),
  }
}
