import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getBridgesArchivedEntries } from '~/server/features/bridges/get-bridges-archived-entries'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData } from '../../../ssr/server'

export async function getBridgesArchivedData(
  manifest: Manifest,
): Promise<RenderData> {
  const [searchBarProjects, entries] = await Promise.all([
    getSearchBarProjects(),
    getBridgesArchivedEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Archived Bridges - L2BEAT',
      description:
        'L2BEAT - archive of Ethereum bridges that are no longer active.',
    },
    ssr: {
      page: 'BridgesArchivedPage',
      props: {
        entries,
        terms: getCollection('glossary').map((term) => ({
          id: term.id,
          matches: [term.data.term, ...(term.data.match ?? [])],
        })),
        searchBarProjects: searchBarProjects.map((p) => ({
          ...p,
          iconUrl: manifest.getUrl(p.iconUrl),
        })),
      },
    },
  }
}
