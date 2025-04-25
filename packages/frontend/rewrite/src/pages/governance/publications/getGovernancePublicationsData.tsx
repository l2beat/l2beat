import { getCollection } from '~/content/get-collection'

import type { Manifest } from 'rewrite/src/common/Manifest'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getGovernancePublicationEntry } from '~/app/(side-nav)/governance/_utils/get-governance-publication-entry'

export async function getGovernancePublicationsData(
  manifest: Manifest,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const publications = getCollection('publications')
    .sort((b, a) => a.data.publishedOn.getTime() - b.data.publishedOn.getTime())
    .map(getGovernancePublicationEntry)

  return {
    head: {
      manifest,
      title: 'Glossary - L2BEAT',
      description: "A glossary of terms for Ethereum's Layer 2 ecosystem",
    },
    ssr: {
      page: 'GovernancePublicationsPage',
      props: {
        ...appLayoutProps,
        publications,
      },
    },
  }
}
