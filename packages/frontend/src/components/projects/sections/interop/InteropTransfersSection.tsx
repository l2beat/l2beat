import type { ProjectId } from '@l2beat/shared-pure'
import { getCoreRowModel } from '@tanstack/react-table'
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
  const [pageIndex, setPageIndex] = useState(0)

  const entry = protocolData?.entry
  const resolvedType =
    entry?.bridgeTypes.length === 1 ? entry.bridgeTypes[0] : undefined

  const isTransfersQueryEnabled =
    !!entry?.snapshotTimestamp && (entry.transferCount ?? 0) > 0

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
      expectedTransferCount: entry?.transferCount ?? 0,
      expectedVolume: entry?.volume ?? 0,
      snapshotTimestamp: entry?.snapshotTimestamp ?? 0,
    },
    {
      enabled: isTransfersQueryEnabled,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  )

  const fetchedItems = useMemo(
    () => transfersData?.pages.flatMap((page) => page.items) ?? [],
    [transfersData],
  )
  const hasIntegrityMismatch = !!transfersData?.pages[0]?.hasIntegrityMismatch
  const pageStart = pageIndex * TRANSFERS_PER_PAGE
  const pageEnd = Math.min(
    pageStart + TRANSFERS_PER_PAGE,
    entry?.transferCount ?? 0,
  )
  const needsMoreRows =
    !hasIntegrityMismatch &&
    pageEnd > 0 &&
    fetchedItems.length < pageEnd &&
    !!hasNextPage

  useEffect(() => {
    if (!isTransfersQueryEnabled || !needsMoreRows || isFetchingNextPage) {
      return
    }

    void fetchNextPage()
  }, [
    fetchNextPage,
    isFetchingNextPage,
    isTransfersQueryEnabled,
    needsMoreRows,
  ])

  const isLoading =
    isProtocolLoading ||
    ((isTransfersLoading || hasIntegrityMismatch) &&
      fetchedItems.length === 0) ||
    needsMoreRows
  const tableData = useMemo(
    () => fetchedItems.slice(pageStart, pageStart + TRANSFERS_PER_PAGE),
    [fetchedItems, pageStart],
  )

  const table = useTable<TransferRow>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
  })

  const pageCount = Math.ceil((entry?.transferCount ?? 0) / TRANSFERS_PER_PAGE)
  const paginationItems = useMemo(
    () => getPaginationItems(pageCount, pageIndex),
    [pageCount, pageIndex],
  )

  return (
    <ProjectSection {...sectionProps}>
      <BetweenChainsInfo className="mb-3" />
      {hasIntegrityMismatch && <TransfersResyncNotice />}
      <BasicTable
        skeletonCount={TRANSFERS_PER_PAGE}
        table={table}
        tableWrapperClassName="pb-0"
        isLoading={isLoading}
      />
      {!isLoading && !hasIntegrityMismatch && pageCount > 1 && (
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
                      setPageIndex(item.index)
                    }}
                    isActive={pageIndex === item.index}
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
    <div className="mb-3 flex items-center gap-2 rounded-lg bg-surface-secondary px-3 py-2 text-paragraph-12 text-secondary">
      <div className="size-2 shrink-0 animate-pulse rounded-full bg-branding-primary" />
      <span className="font-medium">
        Transfer data is resyncing. It will be available soon.
      </span>
    </div>
  )
}
