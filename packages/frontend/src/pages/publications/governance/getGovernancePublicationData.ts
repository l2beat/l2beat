import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { CollectionEntry } from '~/content/getCollection'
import { getGovernancePublicationEntry } from '~/pages/publications/governance/utils/getGovernancePublicationEntry'
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
        title: `${publication.shortTitle ?? publication.title} - L2BEAT`,
        description: publication.description ?? publication.excerpt,
        openGraph: {
          url,
          image: `/meta-images/publications/${publication.id}.png`,
          type: 'article',
        },
      }),
    },
    ssr: {
      page: 'GovernancePublicationPage',
      props: {
        ...appLayoutProps,
        publication,
      },
    },
  }
}
