import { getCollection } from '~/content/getCollection'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { getRecentlyAddedProjects } from '~/server/features/projects/search-bar/getRecentlyAddedProjects'

export async function getAppLayoutProps(): Promise<AppLayoutProps> {
  const recentlyAddedProjects = await getRecentlyAddedProjects()
  return {
    terms: getCollection('glossary').map((term) => ({
      id: term.id,
      matches: [term.data.term, ...(term.data.match ?? [])],
      description: term.data.definition,
    })),
    recentlyAddedProjects,
    whatsNew: undefined,
  }
}
