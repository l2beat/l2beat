import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { useInfiniteQuery } from '@tanstack/react-query'
import { functionalUpdate, getCoreRowModel } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import type {
  InteropTopItemsSort,
  InteropTopItemsSorting,
} from '~/server/features/layer2s/interop/types'
import { useTRPC } from '~/trpc/React'
import type { InteropSelection } from '../../utils/types'
import { getTopTokensColumns, type TokenRow } from './columns'
import {
  InfiniteScrollTrigger,
  LoadingMoreText,
  useInfiniteScrollTrigger,
} from './infiniteScroll'

const DEFAULT_SORTING: InteropTopItemsSorting = [
  {
    id: 'volume',
    desc: true,
  },
]

export type TokensQueryInput = {
  id: ProjectId | undefined
  from: string[]
  to: string[]
  type?: KnownInteropBridgeType
  protocolIds?: string[]
  anchorChain?: string
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
  const trpc = useTRPC()
  const selectedChains = useMemo<InteropSelection>(
    () => ({ from: queryInput.from, to: queryInput.to }),
    [queryInput],
  )
  const [sorting, setSorting] =
    useState<InteropTopItemsSorting>(DEFAULT_SORTING)
  const queryInputWithSort = useMemo(
    () => ({
      ...queryInput,
      sort: sorting,
    }),
    [queryInput, sorting],
  )
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.interop.tokens.infiniteQueryOptions(queryInputWithSort, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }),
    )
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
        selectedChains,
      }),
    [
      showNetMintedValueColumn,
      showTopProtocolColumn,
      showFlowsColumn,
      selectedChains,
    ],
  )

  const table = useTable<TokenRow>({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualSorting: true,
    state: {
      sorting,
    },
    onSortingChange: (updater) => {
      const nextSorting = functionalUpdate(updater, sorting)
      const nextSingleSorting = nextSorting.slice(0, 1).map((nextSort) => ({
        id: nextSort.id as InteropTopItemsSort['id'],
        desc: nextSort.desc,
      }))
      setSorting(
        nextSingleSorting.length > 0 ? nextSingleSorting : DEFAULT_SORTING,
      )
    },
    initialState: {
      columnPinning: { left: ['icon'] },
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
