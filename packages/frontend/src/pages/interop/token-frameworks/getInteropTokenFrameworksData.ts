import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getInteropTokenFrameworksData(
  req: Request,
  manifest: Manifest,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Token frameworks - L2BEAT',
        description:
          'Overview of token frameworks used across interop protocols.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/interop/token-frameworks/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'InteropTokenFrameworksPage',
      props: {
        ...appLayoutProps,
      },
    },
  }
}
