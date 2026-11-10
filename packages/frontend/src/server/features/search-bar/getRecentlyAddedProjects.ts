import { decodeSearchIndexProject } from '~/components/search-bar/searchIndex'
import type { SearchBarProject } from '~/server/features/search-bar/types'
import { ps } from '~/server/projects'
import {
  SEARCH_INDEX_PROJECT_KEYS,
  toSearchIndexProject,
} from './getSearchIndex'
import { toSearchBarProject } from './utils/toSearchBarProject'

export async function getRecentlyAddedProjects(): Promise<SearchBarProject[]> {
  const projects = await ps.getProjects({ optional: SEARCH_INDEX_PROJECT_KEYS })

  return projects
    .sort((a, b) => b.addedAt - a.addedAt)
    .flatMap((p) => {
      const row = toSearchIndexProject(p)
      return row ? decodeSearchIndexProject(row) : []
    })
    .slice(0, 15)
    .map(toSearchBarProject)
}
