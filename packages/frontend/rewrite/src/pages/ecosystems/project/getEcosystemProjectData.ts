import type { Manifest } from 'rewrite/src/common/Manifest'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getEcosystemEntry } from '~/server/features/ecosystems/get-ecosystem-entry'

export async function getEcosystemProjectData(
  manifest: Manifest,
  slug: string,
): Promise<RenderData | undefined> {
  const [searchBarProjects, ecosystem] = await Promise.all([
    getSearchBarProjects(),
    getEcosystemEntry(slug),
  ])

  if (!ecosystem) {
    return undefined
  }

  return {
    head: {
      manifest,
      title: `${ecosystem.name} - L2BEAT`,
      description: 'Some description',
    },
    ssr: {
      page: 'EcosystemProjectPage',
      props: {
        ecosystem,
        terms: getCollection('glossary').map((term) => ({
          id: term.id,
          matches: [term.data.term, ...(term.data.match ?? [])],
        })),
        searchBarProjects,
      },
    },
  }
}
