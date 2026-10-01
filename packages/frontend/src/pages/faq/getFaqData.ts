import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { faqItems } from '~/pages/faq/FaqItems'
import { getFaqStructuredData } from '~/pages/faq/getFaqStructuredData'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
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
        name: 'FAQ',
        description:
          'Frequently Asked Questions about L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
        url,
        openGraph: {
          image: '/meta-images/faq/opengraph-image.png',
        },
        structuredData: () => [getFaqStructuredData(faqItems)],
      }),
    },
    ssr: {
      page: 'FaqPage',
      props: appLayoutProps,
    },
  }
}
