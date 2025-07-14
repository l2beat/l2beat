import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollectionEntry } from '~/content/getCollection'
import { getGovernancePublicationEntry } from '~/pages/governance/utils/getGovernancePublicationEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getGovernancePublicationData(
  manifest: Manifest,
  id: string,
  url: string,
): Promise<RenderData | undefined> {
  const publicationEntry = getCollectionEntry('publications', id)
  if (!publicationEntry) {
    return undefined
  }
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
          image: `/meta-images/governance/publications/${publication.id}.png`,
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
