import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getProjects, searchCode } from '../../../api/api'
import type { ApiProjectChain, ApiProjectEntry } from '../../../api/types'
import { useDebounce } from '../../../hooks/useDebounce'
import { useProjectQueryOptions } from '../hooks/projectQuery'
import { usePanelStore } from '../store/panel-store'
import {
  buildCodeGroups,
  buildSearchGroups,
  type SearchGroup,
  type SearchRow,
  type SearchSources,
  toSearchRows,
} from './groups'
import {
  buildCommandSearchables,
  buildContractSearchables,
  buildFieldSearchables,
  buildProjectSearchables,
  type Searchable,
  type SearchItem,
} from './items'
import { toSearchQuery } from './rank'
import type { SearchScope } from './scopes'
import { useSearchStore } from './store'
import { useSearchCommands } from './useRunSearchItem'

const CODE_SEARCH_DEBOUNCE_MS = 250

export interface SearchResults {
  rows: SearchRow[]
  items: SearchItem[]
  needles: string[]
  status: 'pending' | 'error' | 'success'
  isStale: boolean
  isFetching: boolean
}

export function useSearchResults(project: string): SearchResults {
  const scope = useSearchStore((s) => s.scope)
  const text = useSearchStore((s) => s.text)
  const recentAddresses = useSearchStore((s) => s.recentAddresses)
  const { sources, isError, isProjectsError, isProjectsPending } =
    useSearchSources(project)
  const code = useCodeSearch(project)

  const groups = useMemo((): SearchGroup[] | undefined => {
    if (scope === 'code') return code.groups
    if (sources === undefined) return undefined
    return buildSearchGroups({ scope, text, sources, recentAddresses })
  }, [scope, text, sources, recentAddresses, code.groups])

  const { rows, items } = useMemo(() => toSearchRows(groups ?? []), [groups])
  const needles = scope === 'code' ? [code.needle] : toSearchQuery(text).tokens

  const status = statusFor(scope, {
    code,
    isError,
    isPending: sources === undefined,
    isProjectsError,
    isProjectsPending,
  })
  const isFetching = code.isFetching
  if (status !== 'success') {
    return { rows: [], items: [], needles, status, isStale: false, isFetching }
  }
  if (scope === 'code' && code.isStale) {
    return { rows, items: [], needles, status, isStale: true, isFetching }
  }
  return { rows, items, needles, status, isStale: false, isFetching }
}

function statusFor(
  scope: SearchScope,
  state: {
    code: { isError: boolean }
    isError: boolean
    isPending: boolean
    isProjectsError: boolean
    isProjectsPending: boolean
  },
): SearchResults['status'] {
  if (scope === 'code') return toStatus(state.code.isError, false)
  if (scope === 'projects') {
    return toStatus(
      state.isError || state.isProjectsError,
      state.isPending || state.isProjectsPending,
    )
  }
  return toStatus(state.isError, state.isPending)
}

function toStatus(
  isError: boolean,
  isPending: boolean,
): SearchResults['status'] {
  if (isError) return 'error'
  if (isPending) return 'pending'
  return 'success'
}

const PROJECTS_QUERY = {
  queryKey: ['projects'],
  queryFn: () => getProjects(),
  staleTime: Number.POSITIVE_INFINITY,
}
const NO_PROJECTS: ApiProjectEntry[] = []
const contractCache = new WeakMap<ApiProjectChain[], Searchable[]>()
const fieldCache = new WeakMap<ApiProjectChain[], Searchable[]>()
const projectCache = new WeakMap<ApiProjectEntry[], Searchable[]>()
const deepProjectCache = new WeakMap<ApiProjectEntry[], Searchable[]>()

function cached<K extends object>(
  cache: WeakMap<K, Searchable[]>,
  key: K,
  build: (key: K) => Searchable[],
): Searchable[] {
  let value = cache.get(key)
  if (value === undefined) {
    value = build(key)
    cache.set(key, value)
  }
  return value
}

function useSearchSources(project: string): {
  sources: SearchSources | undefined
  isError: boolean
  isProjectsError: boolean
  isProjectsPending: boolean
} {
  const scope = useSearchStore((s) => s.scope)
  const projectQuery = useQuery(useProjectQueryOptions(project))
  const projectsQuery = useQuery(PROJECTS_QUERY)
  const commands = useSearchCommands()
  const commandSearchables = useMemo(
    () => buildCommandSearchables(commands),
    [commands],
  )

  const chains = projectQuery.data?.entries
  const contracts =
    chains && cached(contractCache, chains, buildContractSearchables)
  const fields = chains && cached(fieldCache, chains, buildFieldSearchables)
  const projects = cached(
    scope === 'projects' ? deepProjectCache : projectCache,
    projectsQuery.data ?? NO_PROJECTS,
    (entries) =>
      buildProjectSearchables(entries, {
        matchContractNames: scope === 'projects',
      }),
  )

  const sources = useMemo(() => {
    if (contracts === undefined || fields === undefined) return undefined
    return { contracts, fields, projects, commands: commandSearchables }
  }, [contracts, fields, projects, commandSearchables])
  return {
    sources,
    isError: projectQuery.isError,
    isProjectsError: projectsQuery.isLoadingError,
    isProjectsPending: projectsQuery.isPending,
  }
}

function useCodeSearch(project: string) {
  const scope = useSearchStore((s) => s.scope)
  const text = useSearchStore((s) => s.text)
  const codeInSelected = useSearchStore((s) => s.codeInSelected)
  const selectedAddress = usePanelStore((s) => s.selected[0])
  const needle = useDebounce(text, CODE_SEARCH_DEBOUNCE_MS)
  const address = codeInSelected ? selectedAddress : undefined
  const enabled =
    scope === 'code' &&
    needle.length > 0 &&
    (!codeInSelected || selectedAddress !== undefined)

  const query = useQuery({
    queryKey: ['search', 'code', project, address, needle],
    queryFn: async () => ({
      project,
      needle,
      address,
      response: await searchCode(project, needle, address),
    }),
    enabled,
    placeholderData: keepPreviousData,
  })

  const groups = useMemo(
    () =>
      enabled && query.data
        ? buildCodeGroups(query.data.response, query.data.needle.length)
        : [],
    [enabled, query.data],
  )
  return {
    groups,
    needle: query.data?.needle ?? needle,
    isStale:
      query.data?.project !== project ||
      query.data.needle !== text ||
      query.data.address !== address,
    isError: query.isError,
    isFetching: enabled && query.isFetching,
  }
}
