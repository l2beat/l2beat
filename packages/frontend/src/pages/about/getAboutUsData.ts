import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { Manifest } from '~/utils/Manifest'

export async function getAboutUsData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'About Us - L2BEAT',
        openGraph: {
          url,
          image: '/meta-images/about-us/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'AboutUsPage',
      props: appLayoutProps,
    },
  }
}
