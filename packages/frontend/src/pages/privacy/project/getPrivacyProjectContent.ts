import { getPrivacyProjectDetails } from '~/server/features/privacy/getPrivacyProjectDetails'
import { getPrivacyProjectEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import type { ProjectPage } from '~/server/features/projects/getProjectPage'
import { getZkCatalogProject } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import { ps } from '~/server/projects'
import { getPrivacyMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import { getWebPageStructuredData } from '~/ssr/head/structured-data/getWebPageStructuredData'
import type {
  ProjectPageContent,
  ProjectPageContext,
} from '../../project/getProjectData'

export async function getPrivacyProjectContent(
  page: ProjectPage,
  { helpers }: ProjectPageContext,
): Promise<ProjectPageContent<'PrivacyProjectPage'> | undefined> {
  const [details, zkCatalog] = await Promise.all([
    getPrivacyProjectDetails(page.slug),
    page.sections.includes('zkCatalog') ? getZkCatalog(page.slug) : undefined,
  ])
  if (!details) return undefined

  const entry = await getPrivacyProjectEntry(
    details,
    helpers,
    zkCatalog?.sections,
  )

  return {
    props: {
      entry,
      zkCatalog: zkCatalog && {
        creator: zkCatalog.creator,
        header: {
          trustedSetupsByProofSystem:
            zkCatalog.header.trustedSetupsByProofSystem,
          techStack: zkCatalog.header.techStack,
        },
      },
    },
    metadata: {
      name: details.name,
      title: `${details.name} Privacy Review & Risks - ETHBEAT`,
      description: getPrivacyMetadataDescription({
        name: details.name,
        category: details.category.label,
        description: details.display.description,
        promise: details.adversaries.promise.text,
      }),
      structuredData: (page) => [
        getWebPageStructuredData(page, {
          name: `${details.name} privacy review`,
          about: details.name,
        }),
      ],
    },
  }
}

/** The ZK Catalog's part of a privacy protocol that is in the catalog. */
async function getZkCatalog(slug: string) {
  const project = await ps.getProject({
    slug,
    select: ['zkCatalogInfo', 'display', 'statuses'],
    optional: ['archivedAt', 'milestones', 'tvsInfo'],
  })
  return project && getZkCatalogProject(project)
}
