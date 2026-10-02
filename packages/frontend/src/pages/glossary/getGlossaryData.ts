import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollection } from '~/content/getCollection'
import { getGlossaryStructuredData } from '~/pages/glossary/getGlossaryStructuredData'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getGlossaryData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const glossaryEntries = getCollection('glossary')

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Glossary',
        description:
          'Understand key terms in Ethereum’s scaling ecosystem with L2BEAT’s glossary.',
        url,
        openGraph: {
          image: '/meta-images/glossary/opengraph-image.png',
        },
        structuredData: (page) => [
          getGlossaryStructuredData(page, glossaryEntries),
        ],
      }),
    },
    ssr: {
      page: 'GlossaryPage',
      props: {
        ...appLayoutProps,
        glossaryEntries,
      },
    },
  }
}
