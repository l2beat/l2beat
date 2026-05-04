import type { ProjectId } from '@l2beat/shared-pure'
import { getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { Button } from '~/components/core/Button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '~/components/Pagination'
import { BasicTable } from '~/components/table/BasicTable'
import { useTable } from '~/hooks/useTable'
import { ChevronIcon } from '~/icons/Chevron'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import {
  columns,
  type TransferRow,
} from '~/pages/interop/components/table/transfer-count-cell/columns'
import type { InteropSelection } from '~/pages/interop/utils/types'
import type { InteropProtocolDashboardData } from '~/server/features/scaling/interop/getInteropProtocolData'
import { api } from '~/trpc/React'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { ChainMultiSelect } from './ChainMultiSelect'

const TRANSFERS_PER_PAGE = 8

export interface InteropTransfersSectionProps extends ProjectSectionProps {
  projectId: ProjectId
  apiSelection: InteropSelection
  protocolData: InteropProtocolDashboardData
  interopChains: InteropChainWithIcon[]
}

export function InteropTransfersSection({
  projectId,
  apiSelection,
  protocolData,
  interopChains,
  ...sectionProps
}: InteropTransfersSectionProps) {
  const entry = protocolData.entry

  const [selectedFrom, setSelectedFrom] = useState<string[]>(apiSelection.from)
  const [selectedTo, setSelectedTo] = useState<string[]>(apiSelection.to)

  const {
    data: transfersData,
    isLoading: isTransfersLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.interop.transfers.useInfiniteQuery(
    {
      from: selectedFrom,
      to: selectedTo,
      id: projectId,
      snapshotTimestamp: entry?.snapshotTimestamp ?? 0,
      limit: TRANSFERS_PER_PAGE,
    },
    {
      enabled:
        !!entry?.snapshotTimestamp &&
        (entry?.transferCount ?? 0) > 0 &&
        selectedFrom.length > 0 &&
        selectedTo.length > 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  const fetchedItems = useMemo(
    () => transfersData?.pages.flatMap((page) => page.items) ?? [],
    [transfersData],
  )
  const fetchedPageCount = Math.ceil(fetchedItems.length / TRANSFERS_PER_PAGE)
  const loadedPageCount = Math.max(1, fetchedPageCount)

  const table = useTable<TransferRow>({
    data: fetchedItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    manualFiltering: true,
    pageCount: Math.max(
      loadedPageCount,
      fetchedPageCount + (hasNextPage ? 1 : 0),
    ),
    initialState: {
      pagination: {
        pageSize: TRANSFERS_PER_PAGE,
        pageIndex: 0,
      },
    },
  })

  const handleFromChange = (next: string[]) => {
    setSelectedFrom(next)
    table.setPageIndex(0)
  }
  const handleToChange = (next: string[]) => {
    setSelectedTo(next)
    table.setPageIndex(0)
  }

  const currentPage = table.getState().pagination.pageIndex

  const isEmptySelection = selectedFrom.length === 0 || selectedTo.length === 0
  const isInitialLoading =
    !isEmptySelection && isTransfersLoading && fetchedItems.length === 0
  const canGoPrevious = currentPage > 0
  const canGoNext = currentPage < loadedPageCount - 1 || !!hasNextPage

  const handlePreviousPage = () => {
    if (canGoPrevious) {
      table.setPageIndex(currentPage - 1)
    }
  }

  const handleNextPage = async () => {
    if (currentPage < loadedPageCount - 1) {
      table.setPageIndex(currentPage + 1)
      return
    }

    if (!hasNextPage || isFetchingNextPage) {
      return
    }

    const previousPageCount = loadedPageCount
    const result = await fetchNextPage()
    const nextItemCount =
      result.data?.pages.reduce((sum, page) => sum + page.items.length, 0) ?? 0
    const nextPageCount = Math.ceil(nextItemCount / TRANSFERS_PER_PAGE)

    if (nextPageCount > previousPageCount) {
      table.setPageIndex(currentPage + 1)
    }
  }

  return (
    <ProjectSection {...sectionProps}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <ChainMultiSelect
          label="From"
          chains={interopChains}
          selected={selectedFrom}
          onChange={handleFromChange}
        />
        <ChainMultiSelect
          label="To"
          chains={interopChains}
          selected={selectedTo}
          onChange={handleToChange}
        />
      </div>
      {isEmptySelection ? (
        <EmptySelectionNotice />
      ) : (
        <BasicTable
          skeletonCount={TRANSFERS_PER_PAGE}
          table={table}
          tableWrapperClassName="pb-0"
          isLoading={isInitialLoading}
        />
      )}
      {!isEmptySelection && fetchedItems.length > 0 && (
        <div className="mt-4">
          <Pagination className="min-w-full px-1">
            <PaginationContent className="justify-center gap-2">
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canGoPrevious || isFetchingNextPage}
                  onClick={handlePreviousPage}
                  className="h-7 rounded-md px-2 font-medium text-label-value-12 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronIcon className="mr-1 size-2.5 rotate-90 fill-current" />
                  Previous
                </Button>
              </PaginationItem>
              <PaginationItem>
                <span className="flex h-7 items-center px-2 font-medium text-label-value-12 text-secondary">
                  Page {currentPage + 1}
                </span>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canGoNext || isFetchingNextPage}
                  onClick={handleNextPage}
                  className="h-7 rounded-md px-2 font-medium text-label-value-12 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Next'}
                  <ChevronIcon className="-rotate-90 ml-1 size-2.5 fill-current" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </ProjectSection>
  )
}

function EmptySelectionNotice() {
  return (
    <div className="mb-3 flex items-center gap-2 rounded-lg bg-surface-secondary px-3 py-2 font-medium text-paragraph-12 text-secondary">
      Select at least one source and destination chain to display transfers.
    </div>
  )
}
