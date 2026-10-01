import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { CollectionEntry } from '~/content/getCollection'
import { getGovernancePublicationEntry } from '~/pages/publications/governance/utils/getGovernancePublicationEntry'
import { getArticleStructuredData } from '~/pages/publications/utils/getArticleStructuredData'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getGovernancePublicationData(
  manifest: Manifest,
  publicationEntry: CollectionEntry<'governance-publications'>,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const publication = getGovernancePublicationEntry(publicationEntry)
  return {
    head: {
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
