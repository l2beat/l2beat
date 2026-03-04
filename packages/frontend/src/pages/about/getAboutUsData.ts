import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getAboutUsData(
  req: Request,
  manifest: Manifest,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps(req)

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'About Us - L2BEAT',
        description: 'Learn about L2BEAT’s mission.',
        openGraph: {
          url: req.originalUrl,
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
