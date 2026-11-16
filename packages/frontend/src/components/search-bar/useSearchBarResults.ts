import { EthereumAddress } from '@l2beat/shared-pure'
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useTRPC } from '~/trpc/React'
import { searchBarPages } from './searchBarPages'
import {
  groupSearchResults,
  searchEntries,
  searchProjectsAndTokens,
} from './searchBarResults'
import {
  decodeSearchIndex,
  SEARCH_INDEX_PATH,
  SearchIndex,
} from './searchIndex'

export type SearchProblem = 'offline' | 'failed'

/**
 * Names are searched in the browser on every keystroke, against an index
 * fetched when the dialog opens. Addresses go to the server once typing pauses.
 */
export function useSearchBarResults(options: {
  value: string
  debouncedValue: string
  open: boolean
}) {
  const { value, debouncedValue, open } = options
  const trpc = useTRPC()
  const isAddress = EthereumAddress.checkIgnoringCase(value.trim())
  const isDebouncedAddress = EthereumAddress.checkIgnoringCase(
    debouncedValue.trim(),
  )

  const index = useQuery({ ...searchIndexQueryOptions(), enabled: open })
  const address = useQuery(
    trpc.searchBar.searchByAddress.queryOptions(debouncedValue, {
      enabled: isDebouncedAddress,
    }),
  )
  const source = isAddress ? address : index
  // A loaded index keeps answering while it revalidates in the background,
  // so only a missing one shows the skeleton or a problem.
  const hasIndex = !isAddress && index.data !== undefined

  // Both leave the list empty, which would otherwise read as "No results
  // found". A paused query runs by itself on the browser's `online` event.
  const isOffline = !hasIndex && source.fetchStatus === 'paused'
  const isFailed = !hasIndex && source.isError && source.fetchStatus === 'idle'
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
    recentlyAdded: index.data?.recentlyAdded,
    showsResults: value !== '' && isSettled,
    isLoading: value !== '' && !hasIndex && (!isSettled || source.isFetching),
    problem,
    retry: () => void source.refetch(),
  }
}

/**
 * Few visitors search, so the index loads on intent: hovering or focusing a
 * search button gives the dialog a head start.
 */
export function usePrefetchSearchIndex() {
  const queryClient = useQueryClient()
  return useCallback(() => {
    void queryClient.prefetchQuery(searchIndexQueryOptions())
  }, [queryClient])
}

// Matches the index's HTTP max-age, past which the browser revalidates it.
const SEARCH_INDEX_STALE_TIME_MS = 5 * 60 * 1000

function searchIndexQueryOptions() {
  return queryOptions({
    queryKey: ['search-index', SEARCH_INDEX_PATH],
    queryFn: fetchSearchIndex,
    staleTime: SEARCH_INDEX_STALE_TIME_MS,
  })
}

async function fetchSearchIndex() {
  const response = await fetch(SEARCH_INDEX_PATH, { cache: 'default' })
  if (!response.ok) {
    throw new Error('Search index request failed', {
      cause: { status: response.status },
    })
  }
  return decodeSearchIndex(SearchIndex.parse(await response.json()))
}
