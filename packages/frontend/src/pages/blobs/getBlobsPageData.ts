import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getBlobsPageData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Blobs',
        description:
          'Blob usage on Ethereum, broken down by the projects that post them.',
        url,
        openGraph: {
          image: '/meta-images/blobs/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'BlobsPage',
      props: await getAppLayoutProps(),
    },
  }
}
