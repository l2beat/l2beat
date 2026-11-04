import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { CollectionEntry } from '~/content/getCollection'
import {
  getOtherPublicationEntry,
  type OtherPublicationEntry,
} from '~/pages/publications/other-publications/utils/getOtherPublicationEntry'
import { getArticleStructuredData } from '~/pages/publications/utils/getArticleStructuredData'
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
    head: getOtherPublicationHead(manifest, publicationEntry, publication, url),
    ssr: {
      page: 'PublicationPage',
      props: {
        ...appLayoutProps,
        publication,
      },
    },
  }
}

export function getOtherPublicationHead(
  manifest: Manifest,
  publicationEntry: CollectionEntry<'other-publications'>,
  publication: OtherPublicationEntry,
  url: string,
): RenderData['head'] {
  return {
    manifest,
    metadata: getMetadata(manifest, {
      name: publication.shortTitle ?? publication.title,
      description: publication.description ?? publication.excerpt,
      url,
      openGraph: {
        image: `/meta-images/publications/${publication.id}.png`,
        type: 'article',
      },
      structuredData: (page) => [
        getArticleStructuredData(page, {
          headline: publication.title,
          publishedOn: publicationEntry.data.publishedOn,
          author: publication.author,
        }),
      ],
    }),
  }
}
