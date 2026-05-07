import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { functionalUpdate, getCoreRowModel } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type {
  InteropTopItemsSort,
  InteropTopItemsSorting,
} from '~/server/features/scaling/interop/types'
import { api } from '~/trpc/React'
import { getTopTokensPairsColumns, type TokensPairRow } from './columns'
import {
  InfiniteScrollTrigger,
  LoadingMoreText,
  useInfiniteScrollTrigger,
} from './infiniteScroll'

export type TokensPairsQueryInput = {
  id: ProjectId | undefined
  from: string[]
  to: string[]
  type?: KnownInteropBridgeType
  protocolIds?: string[]
}

export function TokensPairsTable({
  queryInput,
  hideSameToken,
  showTopProtocolColumn,
  showFlowsColumn,
}: {
  queryInput: TokensPairsQueryInput
  hideSameToken?: boolean
  showTopProtocolColumn?: boolean
  showFlowsColumn?: boolean
}) {
  const [sorting, setSorting] = useState<InteropTopItemsSorting>([
    {
      id: 'volume',
      desc: true,
    },
  ])
  const queryInputWithSort = useMemo(
    () => ({
      ...queryInput,
      sort: sorting,
    }),
    [queryInput, sorting],
  )
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.interop.tokensPairs.useInfiniteQuery(queryInputWithSort, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

  const filteredData = useMemo(() => {
    const rows = data?.pages.flatMap((page) => page.items) ?? []
    if (!hideSameToken) return rows
    return rows.filter((row) => row.tokenA.symbol !== row.tokenB.symbol)
  }, [data, hideSameToken])
  const loadMoreRef = useInfiniteScrollTrigger({
    canLoadMore: !!hasNextPage && !isLoading && !isFetchingNextPage,
    loadMore: fetchNextPage,
  })
  const columns = useMemo(
    () => getTopTokensPairsColumns({ showTopProtocolColumn, showFlowsColumn }),
    [showTopProtocolColumn, showFlowsColumn],
  )

  const table = useTable<TokensPairRow>({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualSorting: true,
    state: {
      sorting,
    },
    onSortingChange: (updater) => {
      const nextSorting = functionalUpdate(updater, sorting)
      setSorting(
        nextSorting.slice(0, 1).map((nextSort) => ({
          id: nextSort.id as InteropTopItemsSort['id'],
          desc: nextSort.desc,
        })),
      )
    },
  })

  return (
    <>
      <BasicTable
        skeletonCount={6}
        table={table}
        tableWrapperClassName="pb-0"
        isLoading={isLoading}
      />
      {hasNextPage && <InfiniteScrollTrigger triggerRef={loadMoreRef} />}
      {isFetchingNextPage && (
        <LoadingMoreText>Loading more token pairs...</LoadingMoreText>
      )}
    </>
  )
}
