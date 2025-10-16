import type { SearchBarProject } from '~/server/features/projects/search-bar/types'
import { ps } from '~/server/projects'
import { getSearchBarProjectEntries } from './utils/getSearchBarProjectEntries'

export async function getRecentlyAddedProjects(): Promise<SearchBarProject[]> {
  const projects = await ps.getProjects({
    optional: [
      'scalingInfo',
      'daLayer',
      'daBridge',
      'isScaling',
      'isDaLayer',
      'isBridge',
      'ecosystemConfig',
      'zkCatalogInfo',
    ],
    whereNot: ['isUpcoming'],
  })

  return projects
    .sort((a, b) => b.addedAt - a.addedAt)
    .flatMap((p) => getSearchBarProjectEntries(p, projects))
    .slice(0, 15)
}
