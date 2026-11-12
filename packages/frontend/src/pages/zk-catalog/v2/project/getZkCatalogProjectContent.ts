import type { ProjectPage } from '~/server/features/projects/getProjectPage'
import { getZkCatalogProjectEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import { ps } from '~/server/projects'
import { getZkCatalogMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type { ProjectPageContent } from '../../../project/getProjectData'

export async function getZkCatalogProjectContent(
  page: ProjectPage,
): Promise<ProjectPageContent<'ZkCatalogProjectPage'> | undefined> {
  const project = await ps.getProject({
    slug: page.slug,
    select: ['zkCatalogInfo', 'display', 'statuses'],
    optional: ['archivedAt', 'milestones', 'tvsInfo'],
  })
  if (!project) return undefined
  const projectEntry = await getZkCatalogProjectEntry(project)

  return {
    props: { projectEntry },
    metadata: {
      name: project.name,
      description: getZkCatalogMetadataDescription({
        name: project.name,
        creator: project.zkCatalogInfo.creator,
        tvs: projectEntry.header.tvs.value,
        description: project.display.description,
      }),
    },
  }
}
