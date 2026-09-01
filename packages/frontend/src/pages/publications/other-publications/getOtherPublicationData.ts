import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { CollectionEntry } from '~/content/getCollection'
import { getOtherPublicationEntry } from '~/pages/publications/other-publications/utils/getOtherPublicationEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getOtherPublicationData(
  manifest: Manifest,
  publicationEntry: CollectionEntry<'other-publications'>,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const publication = getOtherPublicationEntry(publicationEntry)
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${publication.shortTitle ?? publication.title} - L2BEAT`,
        description: publication.description ?? publication.excerpt,
        url,
        openGraph: {
          image: `/meta-images/publications/${publication.id}.png`,
          type: 'article',
        },
      }),
    },
    ssr: {
      page: 'PublicationPage',
      props: {
        ...appLayoutProps,
        publication,
      },
    },
  }
}
