import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import type { AppLayoutProps } from '~/app/_layout'

export async function getAppLayoutProps(opts?: {
  recategorisationPreview?: boolean
}): Promise<AppLayoutProps> {
  const searchBarProjects = await getSearchBarProjects()
  return {
    terms: getCollection('glossary').map((term) => ({
      id: term.id,
      matches: [term.data.term, ...(term.data.match ?? [])],
    })),
    searchBarProjects,
    defaultRecategorisationPreviewChecked: opts?.recategorisationPreview,
  }
}
