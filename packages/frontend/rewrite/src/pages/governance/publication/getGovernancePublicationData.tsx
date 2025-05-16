import { getCollectionEntry } from '~/content/get-collection'

import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
import { getGovernancePublicationEntry } from '~/app/(side-nav)/governance/_utils/get-governance-publication-entry'
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
