import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import type { AppLayoutProps } from '~/layouts/app-layout.tsx'

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
