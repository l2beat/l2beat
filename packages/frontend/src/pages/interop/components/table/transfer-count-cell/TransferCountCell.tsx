import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
import { getCoreRowModel } from '@tanstack/react-table'
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import {
  Dialog,
  DialogClose,
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
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../../utils/InteropSelectedChainsContext'
import { BetweenChainsInfo } from '../../BetweenChainsInfo'
import { columns, type TransferRow } from './columns'

const SCROLL_LOAD_THRESHOLD_PX = 120

export function TransferCountCell({
  transferCount,
  snapshotTimestamp,
  type,
  protocol,
}: {
  transferCount: number
  snapshotTimestamp: number | undefined
  type: KnownInteropBridgeType | undefined
  protocol: {
    id: ProjectId
    name: string
    slug: string
    iconUrl: string
  }
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { selectionForApi } = useInteropSelectedChains()

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
        snapshotTimestamp={snapshotTimestamp}
        selectionForApi={selectionForApi}
        subtitle={<BetweenChainsInfo className="md:mt-1" />}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}

export function TransferDetailsDialog({
  protocol,
  type,
  tokenId,
  snapshotTimestamp,
  selectionForApi,
  subtitle,
  isOpen,
  setIsOpen,
}: {
  protocol: {
    id: ProjectId
    name: string
    slug: string
    iconUrl: string
  }
  type: KnownInteropBridgeType | undefined
  tokenId?: string
  snapshotTimestamp: number | undefined
  selectionForApi: { from: string[]; to: string[] }
  subtitle?: ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const breakpoint = useBreakpoint()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.interop.transfers.useInfiniteQuery(
      {
        ...selectionForApi,
        id: protocol.id,
        type,
        tokenId,
        snapshotTimestamp: snapshotTimestamp ?? 0,
      },
      {
        enabled: isOpen && snapshotTimestamp !== undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

  const transferRows = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  )
  const canLoadMore =
    isOpen && !!hasNextPage && !isLoading && !isFetchingNextPage

  function handleScroll(scrollContainer: HTMLDivElement) {
    if (!canLoadMore) {
      return
    }

    const distanceToBottom =
      scrollContainer.scrollHeight -
      scrollContainer.scrollTop -
      scrollContainer.clientHeight
    if (distanceToBottom <= SCROLL_LOAD_THRESHOLD_PX) {
      fetchNextPage()
    }
  }

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer || !canLoadMore) {
      return
    }

    if (scrollContainer.scrollHeight <= scrollContainer.clientHeight + 1) {
      fetchNextPage()
    }
  }, [canLoadMore, fetchNextPage])

  const table = useTable<TransferRow>({
    data: transferRows,
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
              <a href={`/interop/protocols/${protocol.slug}`}>
                <img
                  src={protocol.iconUrl}
                  alt={protocol.name}
                  className="relative bottom-px mx-1 inline-block size-6"
                />
                <span>{protocol.name}</span>
              </a>
            </DrawerTitle>
            {subtitle}
          </DrawerHeader>
          <div
            ref={scrollContainerRef}
            onScroll={(e) => handleScroll(e.currentTarget)}
            className="max-h-[60vh] overflow-x-auto overflow-y-auto"
          >
            <BasicTable
              table={table}
              isLoading={isLoading}
              skeletonCount={8}
              tableWrapperClassName="pb-0"
            />
            {isFetchingNextPage && (
              <div className="px-4 py-2 text-center font-medium text-label-value-14 text-secondary">
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
      <DialogContent className="max-h-[560px] w-max max-w-[calc(100vw-1rem)] gap-0 overflow-hidden bg-surface-primary px-0 pt-0 pb-3 md:w-[920px]">
        <DialogClose />
        <DialogHeader className="fade-out-to-bottom-3 sticky top-0 z-10 bg-surface-primary px-6 pt-6 pb-4">
          <DialogTitle>
            <span>Transfers for </span>
            <a href={`/interop/protocols/${protocol.slug}`}>
              <img
                src={protocol.iconUrl}
                alt={protocol.name}
                className="relative bottom-0.5 mx-1 inline-block size-6"
              />
              <span>{protocol.name}</span>
            </a>
          </DialogTitle>
          {subtitle}
        </DialogHeader>
        <div
          ref={scrollContainerRef}
          onScroll={(e) => handleScroll(e.currentTarget)}
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
              <div className="py-2 text-center font-medium text-label-value-14 text-secondary">
                Loading more transfers...
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
