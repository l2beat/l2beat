import { EthereumAddress } from '@l2beat/shared-pure'
import { searchEntries } from '~/components/search-bar/searchBarResults'
import { getActiveInteropAbstractTokens } from '~/server/features/scaling/interop/token/getInteropAbstractTokens'
import { ps } from '~/server/projects'
import { getLogger } from '../../../utils/logger'
import type { SearchBarProjectEntry, SearchBarTokenEntry } from './types'
import { getSearchBarProjectEntries } from './utils/getSearchBarProjectEntries'
import { getSearchBarTokenEntries } from './utils/getSearchBarTokenEntries'

type SearchBarSearchEntry = (SearchBarProjectEntry | SearchBarTokenEntry) & {
  searchMatchKind: 'direct' | 'fuzzy'
  searchScore: number
}

function formatSearchResult(entry: SearchBarSearchEntry) {
  if (entry.type === 'token') {
    return {
      category: entry.category,
      name: entry.name,
      href: entry.href,
      type: entry.type,
      id: entry.id,
      iconUrl: entry.iconUrl,
      issuer: entry.issuer,
      searchMatchKind: entry.searchMatchKind,
      searchScore: entry.searchScore,
    }
  }

  return {
    category: entry.category,
    name: entry.name,
    href: entry.href,
    type: entry.type,
    id: entry.id,
    iconUrl: entry.iconUrl,
    kind: entry.kind,
    scalingCategory: entry.scalingCategory,
    searchMatchKind: entry.searchMatchKind,
    searchScore: entry.searchScore,
  }
}

export async function getSearchBarProjects(search: string) {
  const logger = getLogger().for('getSearchBarProjects')

  const projects = await ps.getProjects({
    optional: [
      'scalingInfo',
      'daLayer',
      'daBridge',
      'ecosystemConfig',
      'interopConfig',
      'zkCatalogInfo',
      'privacyInfo',
      'contracts',
      'permissions',
      'aliases',
    ],
  })

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

    logger.info('Search bar projects result', {
      search,
      projectIds: matched.map((r) => r.id),
      type: 'address',
    })
    return matched.map(formatSearchResult)
  }

  const tokens = await getActiveInteropAbstractTokens()
  const tokenEntries = getSearchBarTokenEntries(tokens)

  const result = searchEntries(search, [...searchBarEntries, ...tokenEntries], {
    limit: 15,
    scoreMultiplier: (entry) => (entry.category === 'zkCatalog' ? 0.9 : 1),
  }).map(formatSearchResult)

  logger.info('Search bar projects result', {
    search,
    resultIds: result.map((r) => r.id),
    type: 'name',
  })
  return result
}
