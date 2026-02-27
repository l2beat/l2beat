import {
  formatSeconds,
  type KnownInteropBridgeType,
  type ProjectId,
} from '@l2beat/shared-pure'
import { createColumnHelper, getCoreRowModel } from '@tanstack/react-table'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  InteropProtocolTransfersResponse,
} from '~/server/features/scaling/interop/types'
import { api } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatNumberWithCommas } from '~/utils/number-format/formatNumber'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { BetweenChainsInfo } from '../BetweenChainsInfo'

const PAGE_SIZE = 50
const FETCH_NEXT_THRESHOLD_PX = 120

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
  columnHelper.accessor('amount', {
    header: 'Amount',
    enableSorting: false,
    cell: (ctx) => {
      const { amount, symbol } = ctx.row.original
      if (amount === undefined) return EM_DASH
      const formattedAmount = formatNumberWithCommas(amount, 4)
      return (
        <span className="font-medium text-label-value-14 text-primary">
          {symbol ? `${formattedAmount} ${symbol}` : formattedAmount}
        </span>
      )
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
    cell: (ctx) => ctx.row.original.srcChain,
    meta: {
      headClassName: 'text-2xs',
    },
  }),
  columnHelper.accessor('srcTxHash', {
    header: 'Source tx hash',
    enableSorting: false,
    cell: (ctx) => shortenHash(ctx.row.original.srcTxHash),
    meta: {
      headClassName: 'text-2xs',
    },
  }),
  columnHelper.accessor('dstChain', {
    header: 'Destination chain',
    enableSorting: false,
    cell: (ctx) => ctx.row.original.dstChain,
    meta: {
      headClassName: 'text-2xs',
    },
  }),
  columnHelper.accessor('dstTxHash', {
    header: 'Destination tx hash',
    enableSorting: false,
    cell: (ctx) => shortenHash(ctx.row.original.dstTxHash),
    meta: {
      headClassName: 'text-2xs',
    },
  }),
]

export function TransferCountCell({
  transferCount,
  type,
  protocol,
}: {
  transferCount: number
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
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}

function TransferDetailsDialog({
  protocol,
  type,
  isOpen,
  setIsOpen,
}: {
  protocol: {
    id: ProjectId
    name: string
    iconUrl: string
  }
  type: KnownInteropBridgeType | undefined
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const breakpoint = useBreakpoint()
  const { selectionForApi } = useInteropSelectedChains()
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    api.interop.transfers.useInfiniteQuery(
      {
        ...selectionForApi,
        id: protocol.id,
        type,
        limit: PAGE_SIZE,
      },
      {
        enabled: isOpen,
        getNextPageParam: (lastPage: InteropProtocolTransfersResponse) =>
          lastPage.nextCursor,
      },
    )

  const transferRows = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  )

  const tableData = useMemo(
    () =>
      transferRows.map((row) => ({
        ...row,
        slug: `${row.transferId}-${row.timestamp}`,
      })),
    [transferRows],
  )

  const table = useTable<TransferRow>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
  })

  const fetchMoreIfNeeded = useCallback(() => {
    const element = scrollContainerRef.current
    if (!element || !hasNextPage || isFetchingNextPage) {
      return
    }

    const distanceToBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight

    if (distanceToBottom <= FETCH_NEXT_THRESHOLD_PX) {
      void fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    const element = scrollContainerRef.current
    if (!isOpen || !element) {
      return
    }

    const listener = () => fetchMoreIfNeeded()
    element.addEventListener('scroll', listener)

    return () => {
      element.removeEventListener('scroll', listener)
    }
  }, [isOpen, fetchMoreIfNeeded])

  useEffect(() => {
    const element = scrollContainerRef.current
    if (
      !isOpen ||
      !element ||
      !hasNextPage ||
      isFetchingNextPage ||
      isLoading
    ) {
      return
    }

    if (element.scrollHeight <= element.clientHeight + 1) {
      void fetchNextPage()
    }
  }, [isOpen, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage])

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
          <div
            ref={scrollContainerRef}
            className="max-h-[60vh] overflow-x-auto overflow-y-auto"
          >
            <BasicTable
              table={table}
              isLoading={isLoading}
              skeletonCount={8}
              tableWrapperClassName="pb-0"
            />
            {isFetchingNextPage && (
              <div className="p-3 text-center font-medium text-secondary text-xs">
                Loading more transfers...
              </div>
            )}
          </div>
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
        <div
          ref={scrollContainerRef}
          className="max-h-[460px] overflow-x-auto overflow-y-auto"
        >
          <div className="mx-6">
            <BasicTable
              table={table}
              isLoading={isLoading}
              skeletonCount={8}
              tableWrapperClassName="pb-0"
            />
            {isFetchingNextPage && (
              <div className="p-3 text-center font-medium text-secondary text-xs">
                Loading more transfers...
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function shortenHash(hash: string): string {
  if (hash.length <= 12) return hash
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}
