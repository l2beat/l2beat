import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getZkCatalogProjectDetails } from '~/app/(side-nav)/zk-catalog/[slug]/_utils/get-zk-catalog-project-details'
import { getVerifiers } from '~/server/features/zk-catalog/get-verifiers'
import { ps } from '~/server/projects'
import type { Manifest } from '../../../../../src/utils/Manifest'
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
  const [appLayoutProps, verifiers] = await Promise.all([
    getAppLayoutProps(),
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
        ...appLayoutProps,
        projectDetails,
      },
    },
  }
}
