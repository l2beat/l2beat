import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getVerifiers } from 'rewrite/src/server/features/zk-catalog/get-verifiers'
import { ps } from 'rewrite/src/server/projects'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
import { getZkCatalogEntries } from '~/app/(side-nav)/zk-catalog/_utils/get-zk-catalog-entries'
import type { Manifest } from '../../../../src/utils/Manifest'

export async function getZkCatalogData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, verifiers, projects] = await Promise.all([
    getAppLayoutProps(),
    getVerifiers(),
    ps.getProjects({
      select: ['proofVerification'],
      whereNot: ['archivedAt'],
    }),
  ])
  const entries = getZkCatalogEntries(projects, verifiers)

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'ZK Catalog - L2BEAT',
        description: 'A catalog of the ZK projects with detailed research.',
        openGraph: {
          url,
          image: '/meta-images/zk-catalog/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ZkCatalogPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
