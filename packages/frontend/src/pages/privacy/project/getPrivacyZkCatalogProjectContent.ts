import { getPrivacyProjectDetails } from '~/server/features/privacy/getPrivacyProjectDetails'
import { addZkCatalogToPrivacyEntry } from '~/server/features/privacy/project/addZkCatalogToPrivacyEntry'
import {
  findZkCatalogProject,
  getZkCatalogProject,
} from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import type {
  ProjectPageContent,
  ProjectPageContext,
  ProjectPageDefinition,
} from '../../project/projectPageDefinition'
import { getZkCatalogSummaryFacts } from '../../zk-catalog/v2/project/renderZkCatalogProjectMarkdown'
import { getPrivacyProjectContent } from './getPrivacyProjectContent'
import { renderPrivacyProjectMarkdown } from './renderPrivacyProjectMarkdown'

/**
 * The page of a privacy protocol that is also in the ZK Catalog, like
 * Railgun.
 */
export const privacyZkCatalogProjectPage: ProjectPageDefinition<'PrivacyProjectPage'> =
  {
    component: 'PrivacyProjectPage',
    getContent: getPrivacyZkCatalogProjectContent,
    renderMarkdown: ({ entry, zkCatalog }) =>
      renderPrivacyProjectMarkdown(
        entry,
        zkCatalog && { facts: getZkCatalogSummaryFacts(zkCatalog) },
      ),
  }

async function getPrivacyZkCatalogProjectContent(
  slug: string,
  context: ProjectPageContext,
): Promise<ProjectPageContent<'PrivacyProjectPage'> | undefined> {
  const [details, project] = await Promise.all([
    getPrivacyProjectDetails(slug),
    findZkCatalogProject(slug),
  ])
  if (!details || !project) return undefined
  const [content, zkCatalog] = await Promise.all([
    getPrivacyProjectContent(details, context),
    getZkCatalogProject(project),
  ])

  return {
    ...content,
    props: {
      entry: addZkCatalogToPrivacyEntry(
        content.props.entry,
        zkCatalog.sections,
        details,
      ),
      zkCatalog: {
        // "Railgun by Railgun" says nothing
        creator:
          zkCatalog.creator !== details.name ? zkCatalog.creator : undefined,
        trustedSetupsByProofSystem: zkCatalog.header.trustedSetupsByProofSystem,
        techStack: zkCatalog.header.techStack,
      },
    },
  }
}
