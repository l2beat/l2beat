import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getScalingDaEntries } from '~/server/features/scaling/data-availability/get-scaling-da-entries'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData } from '../../../ssr/server'

export async function getScalingDataAvailabilityData(
  manifest: Manifest,
): Promise<RenderData> {
  const [searchBarProjects, entries] = await Promise.all([
    getSearchBarProjects(),
    getScalingDaEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Data Availability - L2BEAT',
      description:
        'L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'ScalingDataAvailabilityPage',
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
