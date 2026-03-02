import {
  formatSeconds,
  type KnownInteropBridgeType,
  type ProjectId,
} from '@l2beat/shared-pure'
import { createColumnHelper, getCoreRowModel } from '@tanstack/react-table'
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
import { BasicTable, type BasicTableRow } from '~/components/table/BasicTable'
import { EM_DASH } from '~/consts/characters'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useTable } from '~/hooks/useTable'
import type {
  InteropProtocolTransferDetailsItem,
  InteropProtocolTransferStats,
} from '~/server/features/scaling/interop/types'
import { api } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatNumberWithCommas } from '~/utils/number-format/formatNumber'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { BetweenChainsInfo } from '../BetweenChainsInfo'

const VALUE_TOLERANCE_RATIO = 0.01
const MIN_VALUE_TOLERANCE = 0.01
const INITIAL_RENDERED_ROWS = 100
const RENDERED_ROWS_STEP = 100
const SCROLL_LOAD_THRESHOLD_PX = 120

type TransferRow = InteropProtocolTransferDetailsItem & BasicTableRow

const columnHelper = createColumnHelper<TransferRow>()

const columns = [
  columnHelper.accessor('timestamp', {
    header: 'Timestamp',
    enableSorting: false,
    cell: (ctx) => (
      <span className="font-medium text-label-value-14 text-primary">
        {formatTimestamp(ctx.row.original.timestamp, { mode: 'datetime' })}
      </span>
    ),
    meta: {
      headClassName: 'text-2xs',
    },
  }),
  columnHelper.accessor('srcAmount', {
    header: 'Source token',
    enableSorting: false,
    cell: (ctx) => {
      const { srcAmount, srcSymbol } = ctx.row.original
      return <TokenAmount amount={srcAmount} symbol={srcSymbol} />
    },
    meta: {
      headClassName: 'text-2xs',
      align: 'right',
    },
  }),
  columnHelper.accessor('dstAmount', {
    header: 'Destination token',
    enableSorting: false,
    cell: (ctx) => {
      const { dstAmount, dstSymbol } = ctx.row.original
      return <TokenAmount amount={dstAmount} symbol={dstSymbol} />
    },
    meta: {
      headClassName: 'text-2xs',
      align: 'right',
    },
  }),
  columnHelper.accessor('valueUsd', {
    header: 'Value',
    enableSorting: false,
    cell: (ctx) => {
      const { valueUsd } = ctx.row.original
      if (valueUsd === undefined) return EM_DASH
      return (
        <span className="font-medium text-label-value-14 text-primary">
          {formatCurrency(valueUsd, 'usd')}
        </span>
      )
    },
    meta: {
      headClassName: 'text-2xs',
      align: 'right',
    },
  }),
  columnHelper.accessor('duration', {
    header: 'Transfer time',
    enableSorting: false,
    cell: (ctx) => (
      <span className="font-medium text-label-value-14 text-primary">
        {formatSeconds(ctx.row.original.duration)}
      </span>
    ),
    meta: {
      headClassName: 'text-2xs',
      align: 'right',
    },
  }),
  columnHelper.accessor('srcChain', {
    header: 'Source chain',
    enableSorting: false,
    cell: (ctx) => (
      <div className="font-medium text-label-value-14 capitalize">
        {ctx.row.original.srcChain}
      </div>
    ),
    meta: {
      headClassName: 'text-2xs',
    },
  }),
  columnHelper.accessor('srcTxHash', {
    header: 'Source tx hash',
    enableSorting: false,
    cell: (ctx) => (
      <TxHashCell
        hash={ctx.row.original.srcTxHash}
        href={ctx.row.original.srcTxHashHref}
      />
    ),
    meta: {
      headClassName: 'text-2xs',
    },
  }),
  columnHelper.accessor('dstChain', {
    header: 'Destination chain',
    enableSorting: false,
    cell: (ctx) => (
      <div className="font-medium text-label-value-14 capitalize">
        {ctx.row.original.dstChain}
      </div>
    ),
    meta: {
      headClassName: 'text-2xs',
    },
  }),
  columnHelper.accessor('dstTxHash', {
    header: 'Destination tx hash',
    enableSorting: false,
    cell: (ctx) => (
      <TxHashCell
        hash={ctx.row.original.dstTxHash}
        href={ctx.row.original.dstTxHashHref}
      />
    ),
    meta: {
      headClassName: 'text-2xs',
    },
  }),
]

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

function shortenHash(hash: string): string {
  if (hash.length <= 12) return hash
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

function TxHashCell({ hash, href }: { hash: string; href: string }) {
  const content = shortenHash(hash)
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="font-medium text-label-value-14 text-link hover:underline"
    >
      {content}
    </a>
  )
}

function TokenAmount({
  amount,
  symbol,
}: {
  amount: number | undefined
  symbol: string | undefined
}) {
  if (amount === undefined) return EM_DASH
  const formattedAmount = formatNumberWithCommas(amount, 4)
  return (
    <span className="font-medium text-label-value-14 text-primary">
      {symbol ? `${formattedAmount} ${symbol}` : formattedAmount}
    </span>
  )
}
