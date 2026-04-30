import type { ProjectId } from '@l2beat/shared-pure'
import { getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
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

  const isFiltered =
    selectedFrom.length !== apiSelection.from.length ||
    selectedTo.length !== apiSelection.to.length

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
      expectedTransferCount: isFiltered
        ? undefined
        : (entry?.transferCount ?? 0),
      expectedVolume: isFiltered ? undefined : (entry?.volume ?? 0),
      snapshotTimestamp: entry?.snapshotTimestamp ?? 0,
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
  const hasIntegrityMismatch = !!transfersData?.pages[0]?.hasIntegrityMismatch
  const totalCount = transfersData?.pages[0]?.totalCount ?? 0

  const table = useTable<TransferRow>({
    data: fetchedItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    manualFiltering: true,
    pageCount: Math.max(1, Math.ceil(totalCount / TRANSFERS_PER_PAGE)),
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
  const pageCount = table.getPageCount()

  const needsMoreRows =
    !hasIntegrityMismatch &&
    hasNextPage &&
    fetchedItems.length < (currentPage + 1) * TRANSFERS_PER_PAGE

  useEffect(() => {
    if (needsMoreRows && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, isFetchingNextPage, needsMoreRows])

  const isEmptySelection = selectedFrom.length === 0 || selectedTo.length === 0

  const isLoading =
    !isEmptySelection &&
    (((isTransfersLoading || hasIntegrityMismatch) &&
      fetchedItems.length === 0) ||
      needsMoreRows)

  const paginationItems = useMemo(
    () => getPaginationItems(pageCount, currentPage),
    [pageCount, currentPage],
  )

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
      {hasIntegrityMismatch ? (
        <TransfersResyncNotice />
      ) : isEmptySelection ? (
        <EmptySelectionNotice />
      ) : (
        <BasicTable
          skeletonCount={TRANSFERS_PER_PAGE}
          table={table}
          tableWrapperClassName="pb-0"
          isLoading={isLoading}
        />
      )}
      {!hasIntegrityMismatch && !isEmptySelection && pageCount > 1 && (
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
                      table.setPageIndex(item.index)
                    }}
                    isActive={currentPage === item.index}
                  >
                    {item.index + 1}
                  </PaginationLink>
                ),
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </ProjectSection>
  )
}

function TransfersResyncNotice() {
  return (
    <div className="mb-3 flex items-center gap-2 rounded-lg bg-surface-secondary px-3 py-2 font-medium text-paragraph-12 text-secondary">
      Transfer data is resyncing. It will be available soon.
    </div>
  )
}

function EmptySelectionNotice() {
  return (
    <div className="mb-3 flex items-center gap-2 rounded-lg bg-surface-secondary px-3 py-2 font-medium text-paragraph-12 text-secondary">
      Select at least one source and destination chain to display transfers.
    </div>
  )
}
