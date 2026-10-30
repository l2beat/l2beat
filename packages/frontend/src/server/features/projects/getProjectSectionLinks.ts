import compact from 'lodash/compact'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { isListedDefiProject } from '../defi/isListedDefiProject'

export type ProjectSection =
  | 'layer2s'
  | 'interop'
  | 'zkCatalog'
  | 'privacy'
  | 'defi'
  | 'tokens'

export interface ProjectSectionLink {
  section: ProjectSection
  href: string
}

/** The project's page in each section it is listed in. */
export async function getProjectSectionLinks(
  slug: string,
): Promise<ProjectSectionLink[]> {
  const project = await ps.getProject({
    slug,
    optional: [
      'scalingInfo',
      'interopConfig',
      'zkCatalogInfo',
      'privacyInfo',
      'defiInfo',
    ],
  })
  if (!project) return []

  // Must match the pages getSearchBarProjectEntries links to
  return compact<ProjectSectionLink>([
    project.scalingInfo && {
      section: 'layer2s',
      href: `/layer2s/projects/${slug}`,
    },
    project.interopConfig &&
      !project.scalingInfo && {
        section: 'interop',
        href: `/interop/protocols/${slug}`,
      },
    project.zkCatalogInfo && {
      section: 'zkCatalog',
      href: `/zk-catalog/${slug}`,
    },
    project.privacyInfo && {
      section: 'privacy',
      href: `/privacy/projects/${slug}`,
    },
    env.CLIENT_SIDE_DEFI_ENABLED &&
      isListedDefiProject(project.defiInfo) && {
        section: 'defi',
        href: `/defi/projects/${slug}`,
      },
  ])
}
