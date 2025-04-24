import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData } from '../../../ssr/server'

export async function getScalingSummaryData(
  manifest: Manifest,
): Promise<RenderData> {
  const [searchBarProjects, entries] = await Promise.all([
    getSearchBarProjects(),
    getScalingSummaryEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Summary - L2BEAT',
      description:
        'L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'ScalingSummaryPage',
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
