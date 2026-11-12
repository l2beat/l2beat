import { decodeSearchIndexProject } from '~/components/search-bar/searchIndex'
import { selectProjectPages } from '~/server/features/projects/getProjectPage'
import type { SearchBarProject } from '~/server/features/search-bar/types'
import { ps } from '~/server/projects'
import {
  SEARCH_INDEX_PROJECT_KEYS,
  toSearchIndexProject,
} from './getSearchIndex'
import { toSearchBarProject } from './utils/toSearchBarProject'

export async function getRecentlyAddedProjects(): Promise<SearchBarProject[]> {
  const projects = await ps.getProjects({
    optional: [...SEARCH_INDEX_PROJECT_KEYS],
  })

  return selectProjectPages(projects)
    .flatMap((entry) =>
      entry.project ? [{ entry, addedAt: entry.project.addedAt }] : [],
    )
    .sort((a, b) => b.addedAt - a.addedAt)
    .flatMap(({ entry }) => {
      const row = toSearchIndexProject(entry)
      return row ? decodeSearchIndexProject(row) : []
    })
    .slice(0, 15)
    .map(toSearchBarProject)
}
