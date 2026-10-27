import type { ApiCodeSearchResponse } from '../../../api/types'
import { buildCodeItems, type Searchable, type SearchItem } from './items'
import { NO_MATCH, rankSearchTerms, toSearchQuery } from './rank'
import { SCOPE_INFO, type SearchScope } from './scopes'

export const GROUP_LIMIT_MIXED = 6
export const GROUP_LIMIT_SCOPED = 100
export const RECENT_LIMIT = 8

export interface SearchGroup {
  key: string
  label: string
  items: SearchItem[]
  total: number
}

export interface SearchSources {
  contracts: Searchable[]
  fields: Searchable[]
  projects: Searchable[]
  commands: Searchable[]
}

type ListScope = Exclude<SearchScope, 'all' | 'code'>

export function buildSearchGroups(input: {
  scope: Exclude<SearchScope, 'code'>
  text: string
  sources: SearchSources
  recentAddresses: string[]
}): SearchGroup[] {
  const query = toSearchQuery(input.text)
  if (input.scope !== 'all') {
    const { items, total } = filterSearchables(
      input.sources[input.scope],
      query,
      GROUP_LIMIT_SCOPED,
    )
    return nonEmpty([groupOf(input.scope, items, total)])
  }

  if (query.tokens.length === 0) {
    return nonEmpty([
      buildRecentGroup(input.sources.contracts, input.recentAddresses),
      groupOf(
        'commands',
        input.sources.commands.map((s) => s.item),
        input.sources.commands.length,
      ),
    ])
  }

  const scopes: ListScope[] = ['contracts', 'fields', 'projects', 'commands']
  return nonEmpty(
    scopes.map((scope) => {
      const { items, total } = filterSearchables(
        input.sources[scope],
        query,
        GROUP_LIMIT_MIXED,
      )
      if (total > items.length) {
        items.push(showAllItem(scope, total))
      }
      return groupOf(scope, items, total)
    }),
  )
}

export function filterSearchables(
  searchables: Searchable[],
  query: ReturnType<typeof toSearchQuery>,
  limit: number,
): { items: SearchItem[]; total: number } {
  if (query.tokens.length === 0) {
    return {
      items: searchables.slice(0, limit).map((s) => s.item),
      total: searchables.length,
    }
  }

  const ranked: { item: SearchItem; rank: number; index: number }[] = []
  for (const [index, searchable] of searchables.entries()) {
    const rank = rankSearchTerms(searchable.terms, query)
    if (rank === NO_MATCH) continue
    ranked.push({ item: searchable.item, rank, index })
  }
  ranked.sort((a, b) => b.rank - a.rank || a.index - b.index)
  return {
    items: ranked.slice(0, limit).map((r) => r.item),
    total: ranked.length,
  }
}

export function buildCodeGroups(
  response: ApiCodeSearchResponse,
  needleLength: number,
): SearchGroup[] {
  const groups: SearchGroup[] = []
  let budget = GROUP_LIMIT_SCOPED
  for (const match of buildCodeItems(response, needleLength)) {
    if (budget === 0) break
    const items = match.items.slice(0, budget)
    budget -= items.length
    groups.push({
      key: match.key,
      label: match.label,
      items,
      total: match.items.length,
    })
  }
  return groups
}

function buildRecentGroup(
  contracts: Searchable[],
  recentAddresses: string[],
): SearchGroup {
  const items: SearchItem[] = []
  for (const address of recentAddresses) {
    const found = contracts.find(
      (c) => c.item.kind === 'contract' && c.item.address === address,
    )
    if (found !== undefined) items.push(found.item)
    if (items.length === RECENT_LIMIT) break
  }
  return { key: 'recent', label: 'Recent', items, total: items.length }
}

function showAllItem(scope: ListScope, total: number): SearchItem {
  return {
    kind: 'scope',
    key: `scope:${scope}`,
    title: `Show all ${total} ${SCOPE_INFO[scope].label.toLowerCase()}`,
    detail: '',
    trailing: '',
    scope,
  }
}

function groupOf(
  scope: ListScope,
  items: SearchItem[],
  total: number,
): SearchGroup {
  return { key: scope, label: SCOPE_INFO[scope].label, items, total }
}

function nonEmpty(groups: SearchGroup[]): SearchGroup[] {
  return groups.filter((g) => g.items.length > 0)
}

export type SearchRow =
  | { kind: 'label'; key: string; label: string; count: string }
  | { kind: 'item'; key: string; item: SearchItem; index: number }

export function toSearchRows(groups: SearchGroup[]): {
  rows: SearchRow[]
  items: SearchItem[]
} {
  const rows: SearchRow[] = []
  const items: SearchItem[] = []
  for (const group of groups) {
    const shown = group.items.filter((i) => i.kind !== 'scope').length
    rows.push({
      kind: 'label',
      key: `label:${group.key}`,
      label: group.label,
      count: shown === group.total ? `${shown}` : `${shown} of ${group.total}`,
    })
    for (const item of group.items) {
      rows.push({ kind: 'item', key: item.key, item, index: items.length })
      items.push(item)
    }
  }
  return { rows, items }
}
