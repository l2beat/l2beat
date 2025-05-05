import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/server'
import type { Manifest } from '~/utils/Manifest'

export async function getFaqData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'FAQ - L2BEAT',
        description:
          'Frequently Asked Questions about L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
        openGraph: {
          url,
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
