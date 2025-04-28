import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'

export async function getAppLayoutProps() {
  const searchBarProjects = await getSearchBarProjects()
  return {
    terms: getCollection('glossary').map((term) => ({
      id: term.id,
      matches: [term.data.term, ...(term.data.match ?? [])],
    })),
    searchBarProjects,
  }
}
