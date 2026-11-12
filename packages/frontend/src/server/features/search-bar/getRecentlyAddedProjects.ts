import { decodeSearchIndexProject } from '~/components/search-bar/searchIndex'
import { getCropsAttestedIds } from '~/server/features/garden/getAttestationsMeta'
import type { SearchBarProject } from '~/server/features/search-bar/types'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'
import {
  SEARCH_INDEX_PROJECT_KEYS,
  toSearchIndexProject,
} from './getSearchIndex'
import { toSearchBarProject } from './utils/toSearchBarProject'

export async function getRecentlyAddedProjects(): Promise<SearchBarProject[]> {
  const [projects, cropsAttested] = await Promise.all([
    ps.getProjects({ optional: SEARCH_INDEX_PROJECT_KEYS }),
    // Every page's layout reads this list, so a failed read leaves out the
    // projects found only through CROPS instead of failing the page.
    getCropsAttestedIds().catch((error) => {
      getLogger()
        .for('getRecentlyAddedProjects')
        .error('Failed to read CROPS attestation', { error })
      return new Set<string>()
    }),
  ])

  return projects
    .sort((a, b) => b.addedAt - a.addedAt)
    .flatMap((p) => {
      const row = toSearchIndexProject(p, cropsAttested)
      return row ? decodeSearchIndexProject(row) : []
    })
    .slice(0, 15)
    .map(toSearchBarProject)
}
