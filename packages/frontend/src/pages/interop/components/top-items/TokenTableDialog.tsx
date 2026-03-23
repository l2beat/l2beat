import { getCoreRowModel, getSortedRowModel } from '@tanstack/react-table'
import { type ReactNode, useMemo } from 'react'
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
import { BetweenChainsInfo } from '../BetweenChainsInfo'
import { getTopItemsColumns, type TopItemRow } from './columns'

interface TokenTableModalProps {
  data: TokenData[] | undefined
  isLoading: boolean
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  title: ReactNode
  showNetMintedValueColumn?: boolean
}

export function TokenTableDialog({
  data,
  isLoading,
  isOpen,
  setIsOpen,
  title,
  showNetMintedValueColumn,
}: TokenTableModalProps) {
  const breakpoint = useBreakpoint()

  const tableData = useMemo(
    () =>
      data?.map((token) => ({
        ...token,
        displayName: token.symbol,
      })) ?? [],
    [data],
  )

  const columns = useMemo(
    () => getTopItemsColumns('tokens', showNetMintedValueColumn),
    [showNetMintedValueColumn],
  )

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
            <DrawerTitle className="mb-0 text-xl">{title}</DrawerTitle>
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
      <DialogContent className="max-h-[450px] w-[960px] max-w-[calc(100vw-1rem)] gap-0 overflow-y-auto bg-surface-primary px-0 pt-0 pb-3">
        <DialogHeader className="fade-out-to-bottom-3 sticky top-0 z-20 bg-surface-primary px-6 pt-6 pb-4">
          <DialogTitle>{title}</DialogTitle>
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
