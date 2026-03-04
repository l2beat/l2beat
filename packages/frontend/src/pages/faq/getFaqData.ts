import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getFaqData(
  req: Request,
  manifest: Manifest,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps(req)

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'FAQ - L2BEAT',
        description:
          'Frequently Asked Questions about L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/faq/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'FaqPage',
      props: appLayoutProps,
    },
  }
}
