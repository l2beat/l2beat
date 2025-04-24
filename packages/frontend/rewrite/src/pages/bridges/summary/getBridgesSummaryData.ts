import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getBridgesSummaryEntries } from '~/server/features/bridges/get-bridges-summary-entries'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData } from '../../../ssr/server'

export async function getBridgesSummaryData(
  manifest: Manifest,
): Promise<RenderData> {
  const [searchBarProjects, entries] = await Promise.all([
    getSearchBarProjects(),
    getBridgesSummaryEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Bridges - L2BEAT',
      description:
        'L2BEAT - the leading analytics and research website about Ethereum bridges.',
    },
    ssr: {
      page: 'BridgesSummaryPage',
      props: {
        entries,
        terms: getCollection('glossary').map((term) => ({
          id: term.id,
          matches: [term.data.term, ...(term.data.match ?? [])],
        })),
        searchBarProjects,
      },
    },
  }
}
