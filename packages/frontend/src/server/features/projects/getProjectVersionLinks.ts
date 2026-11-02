import { ps } from '~/server/projects'
import type { ProjectSection } from './getProjectSectionLinks'

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

const VERSION_PAGES: Record<
  Exclude<ProjectSection, 'tokens'>,
  (slug: string) => string
> = {
  layer2s: (slug) => `/layer2s/projects/${slug}`,
  interop: (slug) => `/interop/protocols/${slug}`,
  zkCatalog: (slug) => `/zk-catalog/${slug}`,
  privacy: (slug) => `/privacy/projects/${slug}`,
  defi: (slug) => `/defi/projects/${slug}`,
}

/** Links to every version's page in the section the page belongs to. */
export async function getProjectVersionLinks(
  slug: string,
  section: keyof typeof VERSION_PAGES,
): Promise<ProjectVersionLinks | undefined> {
  const project = await ps.getProject({ slug, optional: ['versions'] })
  const versions = project?.versions
  if (!versions) return undefined
  const href = VERSION_PAGES[section]
  return {
    groupName: versions.group.name,
    versions: versions.siblings.map((sibling) => ({
      name: sibling.name,
      label: sibling.label,
      href: href(sibling.slug),
      isCurrent: sibling.slug === slug,
      isLatest: sibling.isLatest,
      isArchived: sibling.archivedAt !== undefined,
    })),
  }
}
