import type { KnownInteropBridgeType, ProjectId } from '@l2beat/shared-pure'
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
import { BasicTable } from '~/components/table/BasicTable'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useTable } from '~/hooks/useTable'
import type { TokenData } from '~/server/features/scaling/interop/types'
import type { TopItems } from '~/server/features/scaling/interop/utils/getTopItems'
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { getTopItemsColumns, type TopItemRow } from './columns'
import { InteropTopItems } from './TopItems'

export function TopTokensCell({
  topItems,
  type,
  protocol,
  showNetMintedValueColumn,
}: {
  topItems: TopItems<TokenData>
  type: KnownInteropBridgeType | undefined
  protocol: {
    id: ProjectId
    name: string
    iconUrl: string
  }
  showNetMintedValueColumn?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const utils = api.useUtils()
  const { selectedChains } = useInteropSelectedChains()

  return (
    <>
      <InteropTopItems
        topItems={{
          items: topItems.items.map((token) => ({
            id: token.id,
            displayName: token.symbol,
            iconUrl: token.iconUrl,
            volume: token.volume,
            transferCount: token.transferCount,
            avgDuration: token.avgDuration,
            avgValue: token.avgValue,
            netMintedValue: token.netMintedValue,
          })),
          remainingCount: topItems.remainingCount,
        }}
        onMouseEnter={() =>
          utils.interop.tokens.prefetch({
            selectedChainsIds: [
              selectedChains.first?.id ?? null,
              selectedChains.second?.id ?? null,
            ],
            id: protocol.id,
            type,
          })
        }
        setIsOpen={setIsOpen}
      />
      <TopTokensContent
        type={type}
        protocol={protocol}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        showNetMintedValueColumn={showNetMintedValueColumn}
      />
    </>
  )
}

function TopTokensContent({
  type,
  protocol,
  isOpen,
  setIsOpen,
  showNetMintedValueColumn,
}: {
  type: KnownInteropBridgeType | undefined
  protocol: { id: ProjectId; name: string; iconUrl: string }
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  showNetMintedValueColumn?: boolean
}) {
  const breakpoint = useBreakpoint()
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.tokens.useQuery(
    {
      selectedChainsIds: [
        selectedChains.first?.id ?? null,
        selectedChains.second?.id ?? null,
      ],
      id: protocol.id,
      type,
    },
    {
      enabled: isOpen,
    },
  )

  const tableData = useMemo(
    () =>
      data?.map((chain) => ({
        id: chain.id,
        displayName: chain.symbol,
        iconUrl: chain.iconUrl,
        volume: chain.volume,
        transferCount: chain.transferCount,
        avgDuration: chain.avgDuration,
        avgValue: chain.avgValue,
        netMintedValue: chain.netMintedValue,
      })) ?? [],
    [data],
  )

  const columns = useMemo(() => {
    return getTopItemsColumns('tokens', showNetMintedValueColumn)
  }, [showNetMintedValueColumn])

  const table = useTable<TopItemRow>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    initialState: {
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
          <DrawerHeader>
            <DrawerTitle className="text-xl">
              <span>Top tokens by volume for </span>
              <img
                src={protocol.iconUrl}
                alt={protocol.name}
                className="relative bottom-px mx-1 inline-block size-6"
              />
              <span>{protocol.name}</span>
            </DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[60vh] overflow-auto">
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
      <DialogContent className="max-h-[450px] w-[800px] max-w-[calc(100%-1rem)] gap-0 overflow-y-auto bg-surface-primary px-0 pt-0 pb-3">
        <DialogHeader className="fade-out-to-bottom-3 sticky top-0 z-10 bg-surface-primary px-6 pt-6 pb-4">
          <DialogTitle>
            <span>Top tokens by volume for </span>
            <img
              src={protocol.iconUrl}
              alt={protocol.name}
              className="relative bottom-0.5 mx-1 inline-block size-6"
            />
            <span>{protocol.name}</span>
          </DialogTitle>
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
