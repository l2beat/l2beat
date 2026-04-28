import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
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
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.interop.tokensPairsInfinite.useInfiniteQuery(queryInput, {
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
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      sorting: [{ id: 'volume', desc: true }],
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
