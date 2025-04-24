import { getCollection, getCollectionEntry } from '~/content/get-collection'

import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getGovernancePublicationEntry } from '~/app/(side-nav)/governance/_utils/get-governance-publication-entry'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'

export async function getGovernancePublicationData(
  manifest: Manifest,
  id: string,
): Promise<RenderData | undefined> {
  const publicationEntry = getCollectionEntry('publications', id)
  if (!publicationEntry) {
    return undefined
  }
  const searchBarProjects = await getSearchBarProjects()
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
        publication,
        terms: getCollection('glossary').map((term) => ({
          id: term.id,
          matches: [term.data.term, ...(term.data.match ?? [])],
        })),
        searchBarProjects,
      },
    },
  }
}
