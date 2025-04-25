import { getCollectionEntry } from '~/content/get-collection'

import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getGovernancePublicationEntry } from '~/app/(side-nav)/governance/_utils/get-governance-publication-entry'

export async function getGovernancePublicationData(
  manifest: Manifest,
  id: string,
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
      title: 'Glossary - L2BEAT',
      description: "A glossary of terms for Ethereum's Layer 2 ecosystem",
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
