import { EthereumAddress } from '@l2beat/shared-pure'
import { searchEntries } from '~/components/search-bar/searchBarResults'
import { getActiveInteropAbstractTokens } from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import { ps } from '~/server/projects'
import { getLogger } from '../../utils/logger'
import type { SearchBarProjectEntry, SearchBarTokenEntry } from './types'
import { getSearchBarProjectEntries } from './utils/getSearchBarProjectEntries'
import { getSearchBarTokenEntries } from './utils/getSearchBarTokenEntries'
import { toSearchBarProject } from './utils/toSearchBarProject'
import { toSearchBarToken } from './utils/toSearchBarToken'

// Limited per type so that dozens of short token symbols (e.g. ROBA, ROBO for
// "rob") can't outscore and push out a project like "Robinhood Chain".
const PROJECT_RESULTS_LIMIT = 15
const TOKEN_RESULTS_LIMIT = 5

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
    getSearchBarProjectEntries(p),
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

  // Searched together so that direct matches of either type still hide fuzzy ones.
  const matches = searchEntries(
    search,
    [...searchBarEntries, ...tokenEntries],
    {
      scoreMultiplier: (entry) => (entry.category === 'zkCatalog' ? 0.9 : 1),
    },
  )
  const result = [
    ...matches
      .filter((entry) => entry.type !== 'token')
      .slice(0, PROJECT_RESULTS_LIMIT),
    ...matches
      .filter((entry) => entry.type === 'token')
      .slice(0, TOKEN_RESULTS_LIMIT),
  ].map(formatSearchResult)

  logger.info('Search bar result', {
    search,
    resultIds: result.map((r) => r.id),
    type: 'name',
  })
  return result
}
