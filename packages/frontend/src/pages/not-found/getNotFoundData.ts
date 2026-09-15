import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getNotFoundData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Page not found - L2BEAT',
        description: 'The page you are looking for does not exist.',
        url,
        openGraph: {
          image: '/meta-images/home/opengraph-image.png',
        },
        excludeFromSearchEngines: true,
      }),
    },
    ssr: {
      page: 'NotFoundPage',
      props: appLayoutProps,
    },
  }
}
