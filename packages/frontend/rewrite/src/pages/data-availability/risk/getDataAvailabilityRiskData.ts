import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getDaRiskEntries } from '~/server/features/data-availability/risks/get-da-risk-entries'

export async function getDataAvailabilityRiskData(
  manifest: Manifest,
): Promise<RenderData> {
  const [searchBarProjects, { publicSystems, customSystems }] =
    await Promise.all([getSearchBarProjects(), getDaRiskEntries()])
  return {
    head: {
      manifest,
      title: 'Activity - L2BEAT',
      description:
        'L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'DataAvailabilityRiskPage',
      props: {
        publicSystems,
        customSystems,
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
