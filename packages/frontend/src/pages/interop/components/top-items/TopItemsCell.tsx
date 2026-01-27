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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { BasicTable } from '~/components/table/BasicTable'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useTable } from '~/hooks/useTable'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import {
  getTopItemsColumns,
  type TopItem,
  type TopItemRow,
  type TopItemType,
} from './columns'

type InteropTopItemsCellProps = {
  items: TopItem[]
  itemType: TopItemType
  protocol: {
    name: string
    iconUrl: string
  }
}

export function InteropTopItemsCell({
  items,
  itemType,
  protocol,
}: InteropTopItemsCellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const breakpoint = useBreakpoint()
  const topItems = items.slice(0, 3)
  const restItems = items.slice(3)

  const columns = useMemo(() => {
    return getTopItemsColumns(itemType)
  }, [itemType])

  const table = useTable<TopItemRow>({
    data: items,
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

  return (
    <>
      <button
        className="group/dialog-trigger grid grid-cols-[46px_30px] items-center gap-1"
        onClick={() => setIsOpen(true)}
      >
        <div className="-space-x-1.5 flex items-center">
          {topItems.map((item, i) => (
            <ItemIconWithTooltip key={item.id} item={item} index={i} />
          ))}
        </div>
        {restItems.length > 0 && (
          <span className="font-bold text-label-value-13 group-hover/dialog-trigger:underline">
            +{restItems.length}
          </span>
        )}
      </button>
      {breakpoint === 'xs' || breakpoint === 'sm' ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-xl">
                <span>Top {itemType} by volume for </span>
                <img
                  src={protocol.iconUrl}
                  alt={protocol.name}
                  className="relative bottom-px mx-1 inline-block size-6"
                />
                <span>{protocol.name}</span>
              </DrawerTitle>
            </DrawerHeader>
            <div className="max-h-[60vh] overflow-auto">
              <BasicTable table={table} tableWrapperClassName="pb-0" />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-h-[450px] w-[800px] max-w-[calc(100%-1rem)] gap-0 overflow-y-auto bg-surface-primary px-0 pt-0 pb-3">
            <DialogHeader className="fade-out-to-bottom-3 sticky top-0 z-10 bg-surface-primary px-6 pt-6 pb-4">
              <DialogTitle>
                <span>Top {itemType} by volume for </span>
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
                <BasicTable table={table} tableWrapperClassName="pb-0" />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

function ItemIconWithTooltip({
  item,
  index,
}: {
  item: TopItem
  index: number
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <img
          key={item.id}
          src={item.iconUrl}
          alt={item.displayName}
          className="relative size-5 min-w-5 rounded-full bg-white shadow"
          style={{ zIndex: 5 - index }}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-bold text-label-value-15">{item.displayName}</p>
        <p className="text-label-value-13 text-secondary">
          {formatCurrency(item.volume, 'usd')}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
