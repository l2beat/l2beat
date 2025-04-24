import { getZkCatalogProjectDetails } from '~/app/(side-nav)/zk-catalog/[slug]/_utils/get-zk-catalog-project-details'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getVerifiers } from '~/server/features/zk-catalog/get-verifiers'
import { ps } from '~/server/projects'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData } from '../../../ssr/server'

export async function getZkCatalogProjectData(
  manifest: Manifest,
  slug: string,
): Promise<RenderData | undefined> {
  const project = await ps.getProject({
    slug,
    select: ['proofVerification'],
    optional: ['isScaling'],
    whereNot: ['archivedAt'],
  })
  if (!project) {
    return undefined
  }
  const [searchBarProjects, verifiers] = await Promise.all([
    getSearchBarProjects(),
    getVerifiers(),
  ])

  const projectDetails = getZkCatalogProjectDetails(project, verifiers)

  return {
    head: {
      manifest,
      title: 'FAQ - L2BEAT',
      description:
        'Frequently Asked Questions about L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'ZkCatalogProjectPage',
      props: {
        projectDetails,
        terms: getCollection('glossary').map((term) => ({
          id: term.id,
          matches: [term.data.term, ...(term.data.match ?? [])],
        })),
        searchBarProjects,
      },
    },
  }
}
