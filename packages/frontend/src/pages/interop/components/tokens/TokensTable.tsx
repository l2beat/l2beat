import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { api } from '~/trpc/React'
import { getTopTokensColumns, type TokenRow } from './columns'
import {
  InfiniteScrollTrigger,
  LoadingMoreText,
  useInfiniteScrollTrigger,
} from './infiniteScroll'

export type TokensQueryInput = {
  id: ProjectId | undefined
  from: string[]
  to: string[]
  type?: KnownInteropBridgeType
  protocolIds?: string[]
}

export function TokensTable({
  queryInput,
  showNetMintedValueColumn,
  showTopProtocolColumn,
  showFlowsColumn,
}: {
  queryInput: TokensQueryInput
  showNetMintedValueColumn?: boolean
  showTopProtocolColumn?: boolean
  showFlowsColumn?: boolean
}) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.interop.tokensInfinite.useInfiniteQuery(queryInput, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    })
  const rows = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  )

  const loadMoreRef = useInfiniteScrollTrigger({
    canLoadMore: !!hasNextPage && !isLoading && !isFetchingNextPage,
    loadMore: fetchNextPage,
  })

  const columns = useMemo(
    () =>
      getTopTokensColumns({
        showNetMintedValueColumn,
        showTopProtocolColumn,
        showFlowsColumn,
      }),
    [showNetMintedValueColumn, showTopProtocolColumn, showFlowsColumn],
  )

  const table = useTable<TokenRow>({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      columnPinning: { left: ['icon'] },
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
        <LoadingMoreText>Loading more tokens...</LoadingMoreText>
      )}
    </>
  )
}
