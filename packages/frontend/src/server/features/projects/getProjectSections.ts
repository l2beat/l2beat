import { env } from '~/env'
import { ps } from '~/server/projects'
import { isListedDefiProject } from '../defi/isListedDefiProject'
import {
  getProjectPageSections,
  PROJECT_PAGE_SECTION_FIELDS,
} from './getProjectPage'

export type ProjectSection =
  | 'layer2s'
  | 'interop'
  | 'zkCatalog'
  | 'privacy'
  | 'defi'
  | 'tokens'

/** The site sections that list the project, for its page's breadcrumbs. */
export async function getProjectSections(
  slug: string,
): Promise<ProjectSection[]> {
  const project = await ps.getProject({
    slug,
    optional: [...PROJECT_PAGE_SECTION_FIELDS],
  })
  if (!project) return []
  return (
    getProjectPageSections(project, {
      hasChainPage: false,
      defiEnabled: env.CLIENT_SIDE_DEFI_ENABLED,
    })
      .filter((section) => section !== 'ethereum' && section !== 'chain')
      // DeFi lists only the categories that have a page of their own.
      .filter(
        (section) =>
          section !== 'defi' || isListedDefiProject(project.defiInfo),
      )
  )
}
