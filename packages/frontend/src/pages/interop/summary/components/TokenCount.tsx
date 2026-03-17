import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
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
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useTable } from '~/hooks/useTable'
import type { TokenData } from '~/server/features/scaling/interop/types'
import type { TopItems } from '~/server/features/scaling/interop/utils/getTopItems'
import { api } from '~/trpc/React'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { BetweenChainsInfo } from '../../components/BetweenChainsInfo'
import {
  getTopItemsColumns,
  type TopItemRow,
} from '../../components/top-items/columns'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'

export function TokenCount({
  isLoading,
  tokenCount,
  topItems,
}: {
  isLoading: boolean
  tokenCount: number | undefined
  topItems: TopItems<TokenData> | undefined
}) {
  const [isOpen, setIsOpen] = useState(false)
  const utils = api.useUtils()
  const { selectionForApi } = useInteropSelectedChains()
  const hasTokens =
    (tokenCount ?? 0) > 0 && !!topItems && topItems.items.length > 0

  return (
    <PrimaryCard className="flex flex-col border-transparent max-md:border-b max-md:border-b-divider md:border-t-4">
      <div className="flex h-[34px] shrink-0 items-center gap-2">
        <h2 className="font-bold text-heading-20 md:text-heading-24">
          Count of all tokens
        </h2>
      </div>
      <div className="mt-1 font-medium text-label-value-12 text-secondary md:text-label-value-14">
        Count of unique abstract tokens transferred{' '}
        <div className="inline-block">
          <BetweenChainsInfo className="lowercase" />
        </div>
      </div>

      <div className="mt-4 flex min-h-[128px] flex-1 flex-col items-center justify-center rounded-lg border border-divider px-4 py-5">
        {isLoading ? (
          <TokenCountSkeleton />
        ) : (
          <>
            <span className="font-bold text-[44px] leading-none md:text-[56px]">
              {formatInteger(tokenCount ?? 0)}
            </span>
            {hasTokens && topItems ? (
              <button
                className="mt-4 flex items-center gap-2"
                onClick={() => setIsOpen(true)}
                onMouseEnter={() =>
                  utils.interop.summaryTokens.prefetch(selectionForApi)
                }
              >
                <div className="-space-x-2 flex items-center">
                  {topItems.items.map((token, index) => (
                    <TokenIcon key={token.id} token={token} index={index} />
                  ))}
                </div>
                {topItems.remainingCount > 0 && (
                  <span className="font-bold text-label-value-15">
                    +{topItems.remainingCount} more
                  </span>
                )}
              </button>
            ) : null}
          </>
        )}
      </div>
      <TokenCountContent isOpen={isOpen} setIsOpen={setIsOpen} />
    </PrimaryCard>
  )
}

function TokenCountContent({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const breakpoint = useBreakpoint()
  const { selectionForApi } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.summaryTokens.useQuery(
    selectionForApi,
    {
      enabled: isOpen,
    },
  )

  const tableData = useMemo(
    () =>
      data?.map((token) => ({
        ...token,
        displayName: token.symbol,
      })) ?? [],
    [data],
  )

  const columns = useMemo(() => getTopItemsColumns('tokens'), [])

  const table = useTable<TopItemRow>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
      columnPinning: {
        left: ['icon'],
      },
      sorting: [
        {
          id: 'volume',
          desc: true,
        },
      ],
    },
  })

  if (breakpoint === 'xs' || breakpoint === 'sm') {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader className="mb-2">
            <DrawerTitle className="mb-0 text-xl">
              All tokens by volume
            </DrawerTitle>
            <BetweenChainsInfo />
          </DrawerHeader>
          <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden">
            <BasicTable
              skeletonCount={6}
              table={table}
              tableWrapperClassName="pb-0"
              isLoading={isLoading}
            />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[450px] w-max max-w-[calc(100vw-1rem)] gap-0 overflow-y-auto bg-surface-primary px-0 pt-0 pb-3">
        <DialogHeader className="fade-out-to-bottom-3 sticky top-0 z-20 bg-surface-primary px-6 pt-6 pb-4">
          <DialogTitle>All tokens by volume</DialogTitle>
          <BetweenChainsInfo className="mt-1" />
        </DialogHeader>
        <div className="overflow-x-auto">
          <div className="mx-6">
            <BasicTable
              skeletonCount={6}
              table={table}
              tableWrapperClassName="pb-0"
              isLoading={isLoading}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function TokenIcon({ token, index }: { token: TokenData; index: number }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <img
          src={token.iconUrl}
          alt={token.symbol}
          className="relative size-7 rounded-full border border-divider bg-white shadow-sm"
          style={{ zIndex: 5 - index }}
        />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>{token.symbol}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

function TokenCountSkeleton() {
  return (
    <div className="flex w-full flex-col items-center">
      <Skeleton className="h-14 w-24 md:h-16 md:w-28" />
      <div className="mt-4 flex items-center gap-2">
        <div className="-space-x-2 flex items-center">
          {[0, 1, 2, 3, 4].map((index) => (
            <Skeleton
              key={index}
              className="size-7 rounded-full border border-divider"
              style={{ zIndex: 5 - index }}
            />
          ))}
        </div>
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  )
}
