import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getCollection } from '~/content/get-collection'
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
        title: 'Glossary - L2BEAT',
        description: "A glossary of terms for Ethereum's Layer 2 ecosystem",
        openGraph: {
          url,
          image: '/meta-images/glossary/opengraph-image.png',
        },
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
