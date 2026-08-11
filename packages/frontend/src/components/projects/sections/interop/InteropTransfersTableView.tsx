import { useInfiniteQuery } from '@tanstack/react-query'
import { getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import {
  getPaginationItems,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '~/components/Pagination'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import {
  getTransferColumns,
  type TransferRow,
} from '~/pages/interop/components/table/transfer-count-cell/columns'
import type { InteropScope } from '~/server/features/layer2s/interop/types'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'

const TRANSFERS_PER_PAGE = 8

export function InteropTransfersTableView({
  scope,
  from,
  to,
  snapshotTimestamp,
  isSnapshotLoading = false,
}: {
  scope: InteropScope
  from: string[]
  to: string[]
  snapshotTimestamp: number | undefined
  isSnapshotLoading?: boolean
}) {
  const trpc = useTRPC()

  const {
    data: transfersData,
    isLoading: isTransfersLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    trpc.interop.transfers.infiniteQueryOptions(
      {
        from,
        to,
        scope,
        snapshotTimestamp: snapshotTimestamp ?? 0,
        limit: TRANSFERS_PER_PAGE,
      },
      {
        enabled:
          !!snapshotTimestamp &&
          scopeHasTargets(scope) &&
          from.length > 0 &&
          to.length > 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  )

  const fetchedItems = useMemo(
    () => transfersData?.pages.flatMap((page) => page.items) ?? [],
    [transfersData],
  )
  const fetchedPageCount = Math.ceil(fetchedItems.length / TRANSFERS_PER_PAGE)
  const loadedPageCount = Math.max(1, fetchedPageCount)
  const pageCount = loadedPageCount + (hasNextPage ? 1 : 0)

  const columns = useMemo(() => getTransferColumns({ from, to }), [from, to])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: TRANSFERS_PER_PAGE,
  })
  const selectionKey = JSON.stringify({ from, to, scope, snapshotTimestamp })
  const [prevSelectionKey, setPrevSelectionKey] = useState(selectionKey)
  if (prevSelectionKey !== selectionKey) {
    setPrevSelectionKey(selectionKey)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  const table = useTable<TransferRow>({
    data: fetchedItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    manualFiltering: true,
    pageCount,
    state: { pagination },
    onPaginationChange: setPagination,
  })

  const currentPage = pagination.pageIndex
  const paginationItems = useMemo(
    () => getPaginationItems(pageCount, currentPage),
    [pageCount, currentPage],
  )

  const isEmptySelection = from.length === 0 || to.length === 0
  const isInitialLoading =
    !isEmptySelection &&
    (isTransfersLoading || isSnapshotLoading) &&
    fetchedItems.length === 0

  const handlePageClick = async (pageIndex: number) => {
    if (pageIndex < loadedPageCount) {
      table.setPageIndex(pageIndex)
      return
    }
    if (pageIndex !== loadedPageCount || !hasNextPage || isFetchingNextPage) {
      return
    }

    const result = await fetchNextPage()
    const nextItemCount =
      result.data?.pages.reduce((sum, page) => sum + page.items.length, 0) ?? 0
    const nextLoadedPageCount = Math.max(
      1,
      Math.ceil(nextItemCount / TRANSFERS_PER_PAGE),
    )

    if (pageIndex < nextLoadedPageCount) {
      table.setPageIndex(pageIndex)
    }
  }

  if (isEmptySelection) {
    return <EmptySelectionNotice />
  }

  return (
    <>
      <BasicTable
        skeletonCount={TRANSFERS_PER_PAGE}
        table={table}
        tableWrapperClassName="pb-0"
        isLoading={isInitialLoading}
      />
      {fetchedItems.length > 0 && pageCount > 1 && (
        <div className="mt-4">
          <Pagination className="min-w-full px-1">
            <PaginationContent className="justify-center">
              {paginationItems.map((item) =>
                item.type === 'ellipsis' ? (
                  <PaginationItem key={item.key}>
                    <PaginationEllipsis className="text-secondary" />
                  </PaginationItem>
                ) : (
                  <PaginationLink
                    key={item.index}
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      void handlePageClick(item.index)
                    }}
                    isActive={currentPage === item.index}
                    className={cn(
                      item.index >= loadedPageCount &&
                        isFetchingNextPage &&
                        'pointer-events-none opacity-40',
                    )}
                  >
                    {item.index + 1}
                  </PaginationLink>
                ),
              )}
              {hasNextPage && (
                <PaginationItem>
                  <PaginationEllipsis className="text-secondary" />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  )
}

function scopeHasTargets(scope: InteropScope): boolean {
  return scope.type === 'project' || scope.protocolIds.length > 0
}

function EmptySelectionNotice() {
  return (
    <div className="mb-3 flex items-center gap-2 rounded-lg bg-surface-secondary px-3 py-2 font-medium text-paragraph-12 text-secondary">
      Select at least one source and destination chain to display transfers.
    </div>
  )
}
