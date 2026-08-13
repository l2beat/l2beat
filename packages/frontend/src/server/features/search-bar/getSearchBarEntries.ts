import { EthereumAddress } from '@l2beat/shared-pure'
import { searchEntries } from '~/components/search-bar/searchBarResults'
import { getActiveInteropAbstractTokens } from '~/server/features/scaling/interop/token/getInteropAbstractTokens'
import { ps } from '~/server/projects'
import { getLogger } from '../../utils/logger'
import type { SearchBarProjectEntry, SearchBarTokenEntry } from './types'
import { getSearchBarProjectEntries } from './utils/getSearchBarProjectEntries'
import { getSearchBarTokenEntries } from './utils/getSearchBarTokenEntries'
import { toSearchBarProject } from './utils/toSearchBarProject'
import { toSearchBarToken } from './utils/toSearchBarToken'

type SearchBarSearchEntry = (SearchBarProjectEntry | SearchBarTokenEntry) & {
  searchMatchKind: 'direct' | 'fuzzy'
  searchScore: number
}

function formatSearchResult(entry: SearchBarSearchEntry) {
  const base =
    entry.type === 'token' ? toSearchBarToken(entry) : toSearchBarProject(entry)

  return {
    ...base,
    searchMatchKind: entry.searchMatchKind,
    searchScore: entry.searchScore,
  }
}

export async function getSearchBarEntries(search: string) {
  const logger = getLogger().for('getSearchBarEntries')

  const [projects, tokens] = await Promise.all([
    ps.getProjects({
      optional: [
        'scalingInfo',
        'daLayer',
        'daBridge',
        'ecosystemConfig',
        'interopConfig',
        'zkCatalogInfo',
        'privacyInfo',
        'defiInfo',
        'contracts',
        'permissions',
        'aliases',
      ],
    }),
    getActiveInteropAbstractTokens(),
  ])

  const searchBarEntries = projects.flatMap((p) =>
    getSearchBarProjectEntries(p, projects),
  )

  if (EthereumAddress.check(search)) {
    const matched = searchBarEntries
      .filter((entry) =>
        entry.projectAddresses?.includes(EthereumAddress(search)),
      )
      .map((entry, index, list) => ({
        ...entry,
        searchMatchKind: 'direct' as const,
        searchScore: list.length - index,
      }))

    logger.info('Search bar result', {
      search,
      projectIds: matched.map((r) => r.id),
      type: 'address',
    })
    return matched.map(formatSearchResult)
  }

  const tokenEntries = getSearchBarTokenEntries(tokens)

  const result = searchEntries(search, [...searchBarEntries, ...tokenEntries], {
    limit: 15,
    scoreMultiplier: (entry) => (entry.category === 'zkCatalog' ? 0.9 : 1),
  }).map(formatSearchResult)

  logger.info('Search bar result', {
    search,
    resultIds: result.map((r) => r.id),
    type: 'name',
  })
  return result
}
