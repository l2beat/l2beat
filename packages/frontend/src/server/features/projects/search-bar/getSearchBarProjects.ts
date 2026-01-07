import { EthereumAddress } from '@l2beat/shared-pure'
import fuzzysort from 'fuzzysort'
import { ps } from '~/server/projects'
import { getLogger } from '../../../utils/logger'
import type { SearchBarProject } from './types'
import { getSearchBarProjectEntries } from './utils/getSearchBarProjectEntries'
import { toSearchBarProject } from './utils/toSearchBarProject'

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
      'contracts',
    ],
  })

  const searchBarEntries = projects.flatMap((p) =>
    getSearchBarProjectEntries(p, projects),
  )

  if (EthereumAddress.check(search)) {
    const matched = searchBarEntries.filter((entry) =>
      entry.contractAddresses?.includes(search),
    )
    logger.info('Search bar projects address-based result', {
      search,
      projectIds: matched.map((r) => r.id),
    })
    return matched.map(toSearchBarProject)
  }

  const result = fuzzysort
    .go(search, searchBarEntries, {
      limit: 15,
      keys: ['name', (e) => e.tags?.join() ?? ''],
      scoreFn: (match) =>
        match.score * (match.obj.category === 'zkCatalog' ? 0.9 : 1),
    })
    .map((match) => toSearchBarProject(match.obj))

  logger.info('Search bar projects result', {
    search,
    projectIds: result.map((r) => r.id),
  })
  return result
}
