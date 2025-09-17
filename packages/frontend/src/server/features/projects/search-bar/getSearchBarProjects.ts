import fuzzysort from 'fuzzysort'
import { ps } from '~/server/projects'
import { getLogger } from '../../../utils/logger'
import type { SearchBarProject } from './types'
import { getSearchBarProjectEntries } from './utils/getSearchBarProjectEntries'

export async function getSearchBarProjects(
  search: string,
): Promise<SearchBarProject[]> {
  const logger = getLogger().for('getSearchBarProjects')

  const projects = await ps.getProjects({
    optional: [
      'scalingInfo',
      'daLayer',
      'daBridge',
      'isScaling',
      'isDaLayer',
      'isBridge',
      'isUpcoming',
      'ecosystemConfig',
      'zkCatalogInfo',
    ],
  })

  const searchBarProjects = projects.flatMap((p) =>
    getSearchBarProjectEntries(p, projects),
  )

  const result = fuzzysort
    .go(search, searchBarProjects, {
      limit: 15,
      keys: ['name', (e) => e.tags?.join() ?? ''],
      scoreFn: (match) =>
        match.score * (match.obj.category === 'zkCatalog' ? 0.9 : 1),
    })
    .map((match) => match.obj)

  logger.info('Search bar projects result', {
    search,
    projectIds: result.map((r) => r.id),
  })
  return result
}
