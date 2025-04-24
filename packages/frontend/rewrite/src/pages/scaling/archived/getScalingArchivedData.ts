import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getScalingArchivedEntries } from '~/server/features/scaling/archived/get-scaling-archived-entries'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData } from '../../../ssr/server'

export async function getScalingArchivedData(
  manifest: Manifest,
): Promise<RenderData> {
  const [searchBarProjects, entries] = await Promise.all([
    getSearchBarProjects(),
    getScalingArchivedEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Archived - L2BEAT',
      description:
        'L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'ScalingArchivedPage',
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
