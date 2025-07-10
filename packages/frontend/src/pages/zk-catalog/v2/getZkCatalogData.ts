import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getZkCatalogEntries } from './utils/getZkCatalogEntries'

export async function getZkCatalogData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, zkCatalogProjects] = await Promise.all([
    getAppLayoutProps(),
    ps.getProjects({
      select: ['proofSystem', 'display'],
    }),
  ])

  const entries = getZkCatalogEntries(zkCatalogProjects)

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
