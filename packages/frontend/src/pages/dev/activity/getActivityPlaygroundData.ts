import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getActivityPlaygroundData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Activity Playground - L2BEAT',
        description:
          'Development-only playground for the Activity bars of the live Blobs table.',
        url,
        openGraph: {
          image: '/meta-images/icon-preview/opengraph-image.png',
        },
        excludeFromSearchEngines: true,
      }),
    },
    ssr: {
      page: 'ActivityPlaygroundPage',
      props: appLayoutProps,
    },
  }
}
