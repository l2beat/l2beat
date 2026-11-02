import { EthereumAddress } from '@l2beat/shared-pure'
import { searchEntries } from '~/components/search-bar/searchBarResults'
import { selectChainProjects } from '~/server/features/chains/getChainProjects'
import { getActiveInteropAbstractTokens } from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import { ps } from '~/server/projects'
import { getLogger } from '../../utils/logger'
import type { SearchBarProjectEntry, SearchBarTokenEntry } from './types'
import { getAbstractTokensByAddress } from './utils/getAbstractTokensByAddress'
import { getSearchBarChainEntry } from './utils/getSearchBarChainEntry'
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

  const trimmed = search.trim()
  const address = EthereumAddress.checkIgnoringCase(trimmed)
    ? EthereumAddress(trimmed)
    : undefined

  const [tokens, searchBarEntries] = await Promise.all([
    address
      ? getAbstractTokensByAddress(address)
      : getActiveInteropAbstractTokens(),
    // Reading projects blocks the event loop, so it waits a turn to let the
    // token query reach the database first and overlap its round trip.
    new Promise(setImmediate).then(getSearchableProjectEntries),
  ])

  if (address) {
    // Tokens first: a bridge escrow lists the token contracts it holds, but
    // whoever pastes a token address is most likely looking for the token.
    const tokenMatches = getSearchBarTokenEntries(tokens)
    const projectMatches = searchBarEntries.filter((entry) =>
      entry.projectAddresses?.includes(address),
    )
    const matched = [...tokenMatches, ...projectMatches].map(
      (entry, index, list) => ({
        ...entry,
        searchMatchKind: 'direct' as const,
        searchScore: list.length - index,
      }),
    )

    logger.info('Search bar result', {
      search,
      projectIds: projectMatches.map((r) => r.id),
      tokenIds: tokenMatches.map((r) => r.id),
      type: 'address',
    })
    return matched.map(formatSearchResult)
  }

  const tokenEntries = getSearchBarTokenEntries(tokens)

  // Searched together so that direct matches of either type still hide fuzzy ones.
  const matches = searchEntries(
    search,
    [...searchBarEntries, ...tokenEntries],
    { scoreMultiplier },
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

/**
 * Projects only, for pages that suggest where a visitor meant to go (the 404
 * page). Tokens are left out: their query is the costly part of a search.
 */
export async function getSearchBarProjectMatches(
  search: string,
  limit: number,
) {
  const entries = await getSearchableProjectEntries()
  return searchEntries(search, entries, { scoreMultiplier })
    .slice(0, limit)
    .map(toSearchBarProject)
}

function scoreMultiplier(entry: { category: string }) {
  return entry.category === 'zkCatalog' ? 0.9 : 1
}

async function getSearchableProjectEntries(): Promise<SearchBarProjectEntry[]> {
  const projects = await ps.getProjects({
    optional: [
      'scalingInfo',
      'interopConfig',
      'zkCatalogInfo',
      'privacyInfo',
      'defiInfo',
      'contracts',
      'permissions',
      'aliases',
    ],
  })
  const l2ProjectIds = new Set(
    projects.filter((p) => p.scalingInfo).map((p) => p.id),
  )
  return [
    ...projects.flatMap((p) => getSearchBarProjectEntries(p)),
    ...selectChainProjects(l2ProjectIds).map(getSearchBarChainEntry),
  ]
}
