import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getVerifiers } from '~/server/features/zk-catalog/getVerifiers'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getZkCatalogProjectDetails } from './utils/getZkCatalogProjectDetails'

export async function getZkCatalogV1ProjectData(
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
      page: 'ZkCatalogV1ProjectPage',
      props: {
        ...appLayoutProps,
        projectDetails,
      },
    },
  }
}
