import { getSearchBarProjects } from '~/components/search-bar/searchBarProjects'
import { getCollection } from '~/content/getCollection'
import type { AppLayoutProps } from '~/layouts/AppLayout'

export async function getAppLayoutProps(): Promise<AppLayoutProps> {
  const searchBarProjects = await getSearchBarProjects()
  return {
    terms: getCollection('glossary').map((term) => ({
      id: term.id,
      matches: [term.data.term, ...(term.data.match ?? [])],
    })),
    searchBarProjects,
  }
}
