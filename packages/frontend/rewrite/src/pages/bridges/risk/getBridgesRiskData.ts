import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getBridgeRiskEntries } from '~/server/features/bridges/get-bridges-risk-entries'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData } from '../../../ssr/server'

export async function getBridgesRiskData(
  manifest: Manifest,
): Promise<RenderData> {
  const [searchBarProjects, entries] = await Promise.all([
    getSearchBarProjects(),
    getBridgeRiskEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Bridge Risks - L2BEAT',
      description: 'L2BEAT - detailed risk analysis of Ethereum bridges.',
    },
    ssr: {
      page: 'BridgesRiskPage',
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
