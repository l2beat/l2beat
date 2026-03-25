import type { ProjectId } from '@l2beat/shared-pure'
import { getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table'
import { useEffect, useMemo } from 'react'
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
import { BetweenChainsInfo } from '~/pages/interop/components/BetweenChainsInfo'
import {
  columns,
  type TransferRow,
} from '~/pages/interop/components/table/transfer-count-cell/columns'
import { useInteropSelectedChains } from '~/pages/interop/utils/InteropSelectedChainsContext'
import { api } from '~/trpc/React'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

const TRANSFERS_PER_PAGE = 8

export interface InteropTransfersSectionProps extends ProjectSectionProps {
  projectId: ProjectId
}

export function InteropTransfersSection({
  projectId,
  ...sectionProps
}: InteropTransfersSectionProps) {
  const { selectionForApi } = useInteropSelectedChains()
  const { data: protocolData, isLoading: isProtocolLoading } =
    api.interop.protocol.useQuery({
      ...selectionForApi,
      id: projectId,
    })
  const entry = protocolData?.entry
  const totalCount = entry?.transferCount ?? 0
  const resolvedType =
    entry?.bridgeTypes.length === 1 ? entry.bridgeTypes[0] : undefined

  const {
    data: transfersData,
    isLoading: isTransfersLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.interop.transfers.useInfiniteQuery(
    {
      ...selectionForApi,
      id: projectId,
      type: resolvedType,
      expectedTransferCount: totalCount,
      expectedVolume: entry?.volume ?? 0,
      snapshotTimestamp: entry?.snapshotTimestamp ?? 0,
    },
    {
      enabled: !!entry?.snapshotTimestamp && totalCount > 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  const fetchedItems = useMemo(
    () => transfersData?.pages.flatMap((page) => page.items) ?? [],
    [transfersData],
  )
  const hasIntegrityMismatch = !!transfersData?.pages[0]?.hasIntegrityMismatch

  const table = useTable<TransferRow>({
    data: fetchedItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    manualFiltering: true,
    pageCount: Math.ceil(totalCount / TRANSFERS_PER_PAGE),
    initialState: {
      pagination: {
        pageSize: TRANSFERS_PER_PAGE,
        pageIndex: 0,
      },
    },
  })

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

  const isLoading =
    isProtocolLoading ||
    ((isTransfersLoading || hasIntegrityMismatch) &&
      fetchedItems.length === 0) ||
    needsMoreRows

  const paginationItems = useMemo(
    () => getPaginationItems(pageCount, currentPage),
    [pageCount, currentPage],
  )

  return (
    <ProjectSection {...sectionProps}>
      <BetweenChainsInfo className="mb-3" />
      {hasIntegrityMismatch ? (
        <TransfersResyncNotice />
      ) : (
        <BasicTable
          skeletonCount={TRANSFERS_PER_PAGE}
          table={table}
          tableWrapperClassName="pb-0"
          isLoading={isLoading}
        />
      )}
      {!hasIntegrityMismatch && pageCount > 1 && (
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
