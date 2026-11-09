import { EthereumAddress } from '@l2beat/shared-pure'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTRPC } from '~/trpc/React'
import { searchBarPages } from './searchBarPages'
import {
  groupSearchResults,
  searchEntries,
  searchProjectsAndTokens,
} from './searchBarResults'
import { decodeSearchIndex, SearchIndex } from './searchIndex'

export type SearchProblem = 'offline' | 'failed'

/**
 * Names are searched in the browser on every keystroke, against an index
 * fetched once. Addresses go to the server once typing pauses.
 */
export function useSearchBarResults(options: {
  value: string
  debouncedValue: string
  searchIndexPath: string
  open: boolean
}) {
  const { value, debouncedValue, searchIndexPath, open } = options
  const trpc = useTRPC()
  const isAddress = EthereumAddress.checkIgnoringCase(value.trim())
  const isDebouncedAddress = EthereumAddress.checkIgnoringCase(
    debouncedValue.trim(),
  )

  const index = useQuery({
    ...searchIndexQueryOptions(searchIndexPath),
    enabled: open,
  })
  const address = useQuery(
    trpc.searchBar.searchByAddress.queryOptions(debouncedValue, {
      enabled: isDebouncedAddress,
    }),
  )
  const source = isAddress ? address : index

  // Both leave the list empty, which would otherwise read as "No results
  // found". A paused query runs by itself on the browser's `online` event.
  const isOffline = source.fetchStatus === 'paused'
  const isFailed = source.isError && source.fetchStatus === 'idle'
  const isSettled = !isAddress || value === debouncedValue
  const problem: SearchProblem | undefined =
    value === '' || !isSettled
      ? undefined
      : isOffline
        ? 'offline'
        : isFailed
          ? 'failed'
          : undefined

  const groups = useMemo(() => {
    const results = isAddress
      ? address.data
      : index.data && searchProjectsAndTokens(value, index.data)
    // Pages are searched locally, so they can still be listed when the
    // projects and tokens can't be.
    if (!results && !isOffline && !isFailed) return []
    return groupSearchResults([
      ...(results ?? []),
      ...searchEntries(value, searchBarPages),
    ])
  }, [isAddress, address.data, index.data, value, isOffline, isFailed])

  return {
    groups,
    showsResults: value !== '' && isSettled,
    isLoading: value !== '' && (!isSettled || source.isFetching),
    problem,
    retry: () => void source.refetch(),
  }
}

export function searchIndexQueryOptions(path: string) {
  return queryOptions({
    queryKey: ['search-index', path],
    queryFn: () => fetchSearchIndex(path),
    // The path changes with the contents, so a fetched index never goes stale.
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  })
}

async function fetchSearchIndex(path: string) {
  const response = await fetch(path, { cache: 'default' })
  if (!response.ok) {
    throw new Error('Search index request failed', {
      cause: { status: response.status },
    })
  }
  return decodeSearchIndex(SearchIndex.parse(await response.json()))
}
