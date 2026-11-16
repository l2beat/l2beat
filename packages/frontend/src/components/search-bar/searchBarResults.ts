import { ProjectId } from '@l2beat/shared-pure'
import fuzzysort from 'fuzzysort'
import type {
  SearchBarProjectEntry,
  SearchBarTokenEntry,
} from '~/server/features/search-bar/types'
import {
  type SearchBarCategory,
  type SearchBarCategoryConfig,
  searchBarCategories,
} from './searchBarCategories'
import type { DecodedSearchIndex } from './searchIndex'
import type { SearchBarEntry } from './types'

type SearchableSearchBarEntry = SearchBarEntry & {
  type: string
  index?: number
}

type SearchMetadata = {
  searchMatchKind: 'direct' | 'fuzzy'
  searchScore: number
}

type SearchResult<T extends SearchableSearchBarEntry> = T & SearchMetadata

interface SearchEntriesOptions<T extends SearchableSearchBarEntry> {
  limit?: number
  scoreMultiplier?: (entry: T) => number
}

export function searchEntries<T extends SearchableSearchBarEntry>(
  query: string,
  entries: T[],
  options?: SearchEntriesOptions<T>,
): SearchResult<T>[] {
  if (query === '') return []

  const searched = fuzzysort
    .go(query, entries, {
      limit: entries.length,
      keys: ['name', (entry) => entry.tags?.join(' ') ?? ''],
    })
    .map((match) => {
      const scoreMultiplier = options?.scoreMultiplier?.(match.obj) ?? 1
      const searchMatchKind = isDirectMatch(query, match.obj)
        ? ('direct' as const)
        : ('fuzzy' as const)

      return {
        ...match.obj,
        searchMatchKind,
        searchScore: match.score * scoreMultiplier,
      }
    })

  return rankSearchResults(searched, options?.limit)
}

// Limited per type so that dozens of short token symbols (e.g. ROBA, ROBO for
// "rob") can't outscore and push out a project like "Robinhood Chain".
const PROJECT_RESULTS_LIMIT = 15
const TOKEN_RESULTS_LIMIT = 5

export function searchProjectsAndTokens(
  query: string,
  index: Pick<DecodedSearchIndex, 'projects' | 'tokens'>,
) {
  // Searched together so that direct matches of either type still hide fuzzy ones.
  const matches = searchEntries<SearchBarProjectEntry | SearchBarTokenEntry>(
    query,
    [...index.projects, ...index.tokens],
    {
      scoreMultiplier: (entry) => (entry.category === 'zkCatalog' ? 0.9 : 1),
    },
  )
  rankVersionsTogether(matches)
  if (isEthereumPrefix(query)) {
    // Ranked first, so "eth" or "ethere" never shows Ethereal above it.
    for (const entry of matches) {
      if (entry.type === 'project' && entry.id === ProjectId.ETHEREUM) {
        entry.searchScore = Number.POSITIVE_INFINITY
      }
    }
  }
  const ranked = rankSearchResults(matches)
  return [
    ...ranked
      .filter((entry) => entry.type !== 'token')
      .slice(0, PROJECT_RESULTS_LIMIT),
    ...ranked
      .filter((entry) => entry.type === 'token')
      .slice(0, TOKEN_RESULTS_LIMIT),
  ]
}

// Far below the gap between any two fuzzysort scores.
const VERSION_SCORE_STEP = 1e-9

/**
 * Versions of a project score as their best match and list the latest first.
 * Otherwise an older version with a shorter slug outscores the latest one.
 */
function rankVersionsTogether(
  matches: SearchResult<SearchBarProjectEntry | SearchBarTokenEntry>[],
) {
  const bestScores = new Map<string, number>()
  const versioned = matches.flatMap((entry) => {
    if (entry.type !== 'project' || !entry.version) return []
    const key = `${entry.category}:${entry.version.group}`
    const best = bestScores.get(key) ?? Number.NEGATIVE_INFINITY
    bestScores.set(key, Math.max(best, entry.searchScore))
    return [{ entry, key, rank: entry.version.rank }]
  })
  for (const { entry, key, rank } of versioned) {
    const best = bestScores.get(key) ?? entry.searchScore
    entry.searchScore = best - rank * VERSION_SCORE_STEP
  }
}

function isEthereumPrefix(query: string): boolean {
  const normalized = normalize(query)
  return normalized !== '' && ProjectId.ETHEREUM.startsWith(normalized)
}

function rankSearchResults<T extends SearchableSearchBarEntry>(
  entries: SearchResult<T>[],
  limit?: number,
): SearchResult<T>[] {
  const directEntries = entries.filter(
    (entry) => entry.searchMatchKind === 'direct',
  )
  const filtered = directEntries.length > 0 ? directEntries : entries

  const sorted = [...filtered].sort((a, b) => {
    if (a.searchScore !== b.searchScore) {
      return b.searchScore - a.searchScore
    }

    if (a.type === 'page' && b.type === 'page') {
      const pageDifference =
        (a.index ?? Number.POSITIVE_INFINITY) -
        (b.index ?? Number.POSITIVE_INFINITY)
      if (pageDifference !== 0) return pageDifference
    }

    return a.name.localeCompare(b.name)
  })

  return limit ? sorted.slice(0, limit) : sorted
}

export function groupSearchResults<T extends SearchableSearchBarEntry>(
  entries: SearchResult<T>[],
): Array<[SearchBarCategory, SearchResult<T>[]]> {
  const grouped = new Map<SearchBarCategory, SearchResult<T>[]>()

  for (const entry of rankSearchResults(entries)) {
    const current = grouped.get(entry.category)
    if (current) {
      current.push(entry)
      continue
    }

    grouped.set(entry.category, [entry])
  }

  return [...grouped.entries()].sort(
    ([left], [right]) => pinRank(left) - pinRank(right),
  )
}

function pinRank(category: SearchBarCategory): number {
  const config: SearchBarCategoryConfig = searchBarCategories[category]
  return config.pinToBottom ? 1 : 0
}

export function isDirectMatch(
  query: string,
  entry: Pick<SearchBarEntry, 'name' | 'tags'>,
): boolean {
  const normalizedQuery = normalize(query)
  if (normalizedQuery === '') return false

  return [entry.name, ...(entry.tags ?? [])]
    .map(normalize)
    .some((value) => isStrongMatch(normalizedQuery, value))
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function isStrongMatch(query: string, value: string): boolean {
  if (value === query) return true

  return value.split(' ').some((token) => token.startsWith(query))
}
