import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'

export async function getGlossaryData(manifest: Manifest): Promise<RenderData> {
  const searchBarProjects = await getSearchBarProjects()

  return {
    head: {
      manifest,
      title: 'Glossary - L2BEAT',
      description: "A glossary of terms for Ethereum's Layer 2 ecosystem",
    },
    ssr: {
      page: 'GlossaryPage',
      props: {
        glossaryEntries: getCollection('glossary'),
        terms: getCollection('glossary').map((term) => ({
          id: term.id,
          matches: [term.data.term, ...(term.data.match ?? [])],
        })),
        searchBarProjects,
      },
    },
  }
}
