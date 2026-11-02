import {
  type QueryKey,
  type UseQueryOptions,
  useQuery,
} from '@tanstack/react-query'
import { useMemo } from 'react'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import {
  decodeFilterables,
  type L2Tab,
  type LazyTabbedL2Entries,
} from './lazyL2Tabs'

/**
 * The filterable values of every tab, loaded or not, for `TableFilters`;
 * each tab's entry count after filtering, for its label; and the table rows
 * those entries render, for the skeleton of a tab that is loading.
 */
export function useLazyL2TabFilters<T>(lazy: LazyTabbedL2Entries<T>) {
  const filterEntries = useFilterEntries()
  const filterables = useMemo(
    () => decodeFilterables(lazy.filterables),
    [lazy.filterables],
  )

  const allFilterables = useMemo(
    () => [
      ...filterables.rollups,
      ...filterables.validiumsAndOptimiums,
      ...filterables.others,
    ],
    [filterables],
  )

  const countTab = (tab: L2Tab) => {
    let count = 0
    let rowCount = 0
    filterables[tab].forEach((entry, i) => {
      if (filterEntries(entry)) {
        count++
        rowCount += lazy.rowCounts[tab][i] ?? 1
      }
    })
    return { count, rowCount }
  }
  const counts: Record<L2Tab, { count: number; rowCount: number }> = {
    rollups: countTab('rollups'),
    validiumsAndOptimiums: countTab('validiumsAndOptimiums'),
    others: countTab('others'),
  }

  return { allFilterables, counts }
}

/**
 * A tab's entries: from the SSR data for the tab the page opened on,
 * otherwise fetched with `queryOptions`. Call it from inside the tab's
 * content, which mounts only once the tab is open, so a hidden tab costs
 * nothing until clicked.
 */
export function useLazyL2TabEntries<T, TError, TKey extends QueryKey>(
  lazy: LazyTabbedL2Entries<T>,
  tab: L2Tab,
  queryOptions: UseQueryOptions<T[], TError, T[], TKey>,
): {
  entries: T[]
  isLoading: boolean
  /** Separate from an empty tab, which would read as "no results". */
  isFailed: boolean
  retry: () => void
} {
  const isInitialTab = tab === lazy.initialTab
  const query = useQuery({ ...queryOptions, enabled: !isInitialTab })

  if (isInitialTab) {
    return {
      entries: lazy.initialEntries,
      isLoading: false,
      isFailed: false,
      retry: () => {},
    }
  }
  // A retry keeps the error until it settles, so it shows the skeleton. A
  // failed background refetch keeps the entries it already has.
  const isFailed =
    query.isError && query.fetchStatus === 'idle' && query.data === undefined
  return {
    entries: query.data ?? [],
    isLoading: query.data === undefined && !isFailed,
    isFailed,
    retry: () => void query.refetch(),
  }
}
