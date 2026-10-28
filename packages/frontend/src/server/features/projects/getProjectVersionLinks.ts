import type { ProjectVersions } from '@l2beat/config'

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

const VERSION_PAGES = {
  layer2s: (slug: string) => `/layer2s/projects/${slug}`,
  interop: (slug: string) => `/interop/protocols/${slug}`,
}

/** Links to every version's page in the section the page belongs to. */
export function getProjectVersionLinks(
  project: { slug: string; versions?: ProjectVersions },
  section: keyof typeof VERSION_PAGES,
): ProjectVersionLinks | undefined {
  if (!project.versions) return undefined
  const href = VERSION_PAGES[section]
  return {
    groupName: project.versions.group.name,
    versions: project.versions.siblings.map((sibling) => ({
      name: sibling.name,
      label: sibling.label,
      href: href(sibling.slug),
      isCurrent: sibling.slug === project.slug,
      isLatest: sibling.isLatest,
      isArchived: sibling.archivedAt !== undefined,
    })),
  }
}
