import type { ProjectId } from '@l2beat/shared-pure'
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
  data: InteropProtocolDashboardData
  interopChains: InteropChainWithIcon[]
}

export function InteropTransfersSection({
  projectId,
  apiSelection,
  data,
  interopChains,
  ...sectionProps
}: InteropTransfersSectionProps) {
  const entry = data.entry

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
  const pageCount = loadedPageCount + (hasNextPage ? 1 : 0)

  const table = useTable<TransferRow>({
    data: fetchedItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    manualFiltering: true,
    pageCount,
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
  const paginationItems = useMemo(
    () => getPaginationItems(pageCount, currentPage),
    [pageCount, currentPage],
  )

  const isEmptySelection = selectedFrom.length === 0 || selectedTo.length === 0
  const isInitialLoading =
    !isEmptySelection && isTransfersLoading && fetchedItems.length === 0

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
      {!isEmptySelection && fetchedItems.length > 0 && pageCount > 1 && (
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
                    className={
                      item.index >= loadedPageCount && isFetchingNextPage
                        ? 'pointer-events-none opacity-40'
                        : undefined
                    }
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
