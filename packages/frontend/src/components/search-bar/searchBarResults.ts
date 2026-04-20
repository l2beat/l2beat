import fuzzysort from 'fuzzysort'
import type { SearchBarCategory } from './searchBarCategories'
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

  return [...grouped.entries()]
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
