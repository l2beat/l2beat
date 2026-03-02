import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { getCoreRowModel } from '@tanstack/react-table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/core/Dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '~/components/core/Drawer'
import { BasicTable } from '~/components/table/BasicTable'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useTable } from '~/hooks/useTable'
import type { InteropProtocolTransferStats } from '~/server/features/scaling/interop/types'
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../../utils/InteropSelectedChainsContext'
import { BetweenChainsInfo } from '../../BetweenChainsInfo'
import { columns, type TransferRow } from './columns'

const VALUE_TOLERANCE_RATIO = 0.01
const MIN_VALUE_TOLERANCE = 0.01
const INITIAL_RENDERED_ROWS = 100
const RENDERED_ROWS_STEP = 100
const SCROLL_LOAD_THRESHOLD_PX = 120

export function TransferCountCell({
  transferCount,
  expectedTransferCount,
  expectedVolume,
  type,
  protocol,
}: {
  transferCount: number
  expectedTransferCount: number
  expectedVolume: number
  type: KnownInteropBridgeType | undefined
  protocol: {
    id: ProjectId
    name: string
    iconUrl: string
  }
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="cursor-pointer font-medium text-label-value-15 text-primary hover:underline"
        onClick={() => setIsOpen(true)}
      >
        {transferCount}
      </button>
      <TransferDetailsDialog
        protocol={protocol}
        type={type}
        expectedTransferCount={expectedTransferCount}
        expectedVolume={expectedVolume}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}

function TransferDetailsDialog({
  protocol,
  type,
  expectedTransferCount,
  expectedVolume,
  isOpen,
  setIsOpen,
}: {
  protocol: {
    id: ProjectId
    name: string
    iconUrl: string
  }
  type: KnownInteropBridgeType | undefined
  expectedTransferCount: number
  expectedVolume: number
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const breakpoint = useBreakpoint()
  const { selectionForApi } = useInteropSelectedChains()
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(
    null,
  )
  const [visibleCount, setVisibleCount] = useState(INITIAL_RENDERED_ROWS)

  const { data, isLoading } = api.interop.transfers.useQuery(
    {
      ...selectionForApi,
      id: protocol.id,
      type,
    },
    {
      enabled: isOpen,
    },
  )

  const transferRows = data?.items ?? []
  const transferStats = data?.transferStats
  const hasIntegrityMismatch = hasTransferStatsMismatch(
    transferStats,
    expectedTransferCount,
    expectedVolume,
  )
  const hasMoreRows = visibleCount < transferRows.length

  const loadMoreRows = useCallback(() => {
    setVisibleCount((prev) =>
      Math.min(prev + RENDERED_ROWS_STEP, transferRows.length),
    )
  }, [transferRows.length])

  const maybeLoadMoreRows = useCallback(() => {
    const element = scrollContainer
    if (
      !element ||
      !hasMoreRows ||
      hasIntegrityMismatch ||
      isLoading ||
      isOpen === false
    ) {
      return
    }

    const distanceToBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight
    if (distanceToBottom <= SCROLL_LOAD_THRESHOLD_PX) {
      loadMoreRows()
    }
  }, [
    hasMoreRows,
    hasIntegrityMismatch,
    isLoading,
    isOpen,
    loadMoreRows,
    scrollContainer,
  ])

  useEffect(() => {
    if (!isOpen) {
      return
    }
    setVisibleCount(Math.min(INITIAL_RENDERED_ROWS, transferRows.length))
  }, [isOpen, transferRows.length])

  useEffect(() => {
    const element = scrollContainer
    if (
      !isOpen ||
      !element ||
      !hasMoreRows ||
      hasIntegrityMismatch ||
      isLoading
    ) {
      return
    }

    if (element.scrollHeight <= element.clientHeight + 1) {
      loadMoreRows()
    }
  }, [
    isOpen,
    hasMoreRows,
    hasIntegrityMismatch,
    isLoading,
    loadMoreRows,
    scrollContainer,
  ])

  const shouldRenderRows = isOpen || scrollContainer !== null
  const visibleRows = useMemo(
    () => (shouldRenderRows ? transferRows.slice(0, visibleCount) : []),
    [shouldRenderRows, transferRows, visibleCount],
  )

  const tableData = useMemo(
    () =>
      visibleRows.map((row) => ({
        ...row,
        slug: `${row.transferId}-${row.timestamp}`,
      })),
    [visibleRows],
  )

  const table = useTable<TransferRow>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
  })

  if (breakpoint === 'xs' || breakpoint === 'sm') {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader className="mb-2">
            <DrawerTitle className="mb-0 text-xl">
              <span>Transfers for </span>
              <img
                src={protocol.iconUrl}
                alt={protocol.name}
                className="relative bottom-px mx-1 inline-block size-6"
              />
              <span>{protocol.name}</span>
            </DrawerTitle>
            <BetweenChainsInfo />
          </DrawerHeader>
          {hasIntegrityMismatch ? (
            <div className="px-4 pb-4 font-medium text-label-value-14 text-secondary">
              Data is currently resyncing and will be available soon
            </div>
          ) : (
            <div
              ref={setScrollContainer}
              onScroll={maybeLoadMoreRows}
              className="max-h-[60vh] overflow-x-auto overflow-y-auto"
            >
              <BasicTable
                table={table}
                isLoading={isLoading}
                skeletonCount={8}
                tableWrapperClassName="pb-0"
              />
            </div>
          )}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[560px] w-max max-w-[calc(100vw-1rem)] gap-0 overflow-hidden bg-surface-primary px-0 pt-0 pb-3">
        <DialogHeader className="fade-out-to-bottom-3 sticky top-0 z-10 bg-surface-primary px-6 pt-6 pb-4">
          <DialogTitle>
            <span>Transfers for </span>
            <img
              src={protocol.iconUrl}
              alt={protocol.name}
              className="relative bottom-0.5 mx-1 inline-block size-6"
            />
            <span>{protocol.name}</span>
          </DialogTitle>
          <BetweenChainsInfo className="mt-1" />
        </DialogHeader>
        {hasIntegrityMismatch ? (
          <div className="mx-6 py-4 font-medium text-label-value-14 text-secondary">
            Data is currently resyncing and will be available soon
          </div>
        ) : (
          <div
            ref={setScrollContainer}
            onScroll={maybeLoadMoreRows}
            className="max-h-[460px] overflow-x-auto overflow-y-auto"
          >
            <div className="mx-6">
              <BasicTable
                table={table}
                isLoading={isLoading}
                skeletonCount={8}
                tableWrapperClassName="pb-0"
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function hasTransferStatsMismatch(
  transferStats: InteropProtocolTransferStats | undefined,
  expectedTransferCount: number,
  expectedVolume: number,
): boolean {
  if (!transferStats) {
    return false
  }

  if (transferStats.transferCount !== expectedTransferCount) {
    return true
  }

  // Note: We are not summing transfers in exactly the same way as the backend aggregates do.
  // To avoid duplicating all aggregation logic here, we use a simplified calculation on the frontend
  // and add this 1% difference check to allow for minor discrepancies between methods.
  const difference = Math.abs(transferStats.volume - expectedVolume)
  const tolerance = Math.max(
    Math.abs(expectedVolume) * VALUE_TOLERANCE_RATIO,
    MIN_VALUE_TOLERANCE,
  )
  return difference > tolerance
}
