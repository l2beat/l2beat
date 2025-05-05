import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import { getZkCatalogProjectDetails } from '~/app/(side-nav)/zk-catalog/[slug]/_utils/get-zk-catalog-project-details'
import { getVerifiers } from '~/server/features/zk-catalog/get-verifiers'
import { ps } from '~/server/projects'
import type { Manifest } from '../../../../../src/utils/Manifest'
import type { RenderData } from '../../../ssr/server'

export async function getZkCatalogProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
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
      metadata: getMetadata(manifest, {
        title: `${project.name} - ZK Catalog`,
        openGraph: {
          url,
          image: `/meta-images/zk-catalog/projects/${project.slug}/opengraph-image.png`,
        },
      }),
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
