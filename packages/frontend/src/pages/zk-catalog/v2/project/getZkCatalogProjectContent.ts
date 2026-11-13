import {
  findZkCatalogProject,
  getZkCatalogProjectEntry,
} from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import { getZkCatalogMetadataDescription } from '~/ssr/head/projectMetaDescriptions'
import type {
  ProjectPageContent,
  ProjectPageDefinition,
} from '../../../project/projectPageDefinition'
import { renderZkCatalogProjectMarkdown } from './renderZkCatalogProjectMarkdown'

export const zkCatalogProjectPage: ProjectPageDefinition<'ZkCatalogProjectPage'> =
  {
    component: 'ZkCatalogProjectPage',
    getContent: getZkCatalogProjectContent,
    renderMarkdown: ({ projectEntry }) =>
      renderZkCatalogProjectMarkdown(projectEntry),
  }

async function getZkCatalogProjectContent(
  slug: string,
): Promise<ProjectPageContent<'ZkCatalogProjectPage'> | undefined> {
  const project = await findZkCatalogProject(slug)
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
