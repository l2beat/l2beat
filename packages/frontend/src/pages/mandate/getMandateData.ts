import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollectionEntry } from '~/content/getCollection'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getMandateData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const content = getCollectionEntry('pages', 'mandate')
  if (!content) {
    throw new Error('Mandate content is missing')
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Mandate',
        description: 'What L2BEAT does and why.',
        url,
        openGraph: {
          image: '/meta-images/about-us/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'MandatePage',
      props: {
        ...appLayoutProps,
        content: content.content,
      },
    },
  }
}
