import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollectionEntry } from '~/content/getCollection'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getNewNameData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const content = getCollectionEntry('pages', 'l2beat-is-now-ethbeat')
  if (!content) {
    throw new Error('Rename announcement content is missing')
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'L2BEAT is now ETHBEAT',
        description:
          'L2BEAT is now ETHBEAT: the same team, research and data under a new name and domain. What changed, what did not, and the old and new URLs.',
        url,
        openGraph: {
          image: '/meta-images/l2beat-is-now-ethbeat/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'NewNamePage',
      props: {
        ...appLayoutProps,
        content: content.content,
      },
    },
  }
}
