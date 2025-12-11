import type { Column } from '@tanstack/react-table'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import { SlidersIcon } from '~/icons/Sliders'
import { cn } from '~/utils/cn'

interface Props<T> {
  columns: Column<T>[]
}

export function ColumnsControls<T>({ columns }: Props<T>) {
  const trigger = (
    <div className="mb-1 flex h-8 w-fit items-center gap-1.5 rounded-lg bg-surface-secondary p-2 font-semibold text-base hover:bg-surface-tertiary">
      <SlidersIcon className="fill-secondary" />
      <span className="text-label-value-16">Columns</span>
    </div>
  )
  const flattedColumns = columns.flatMap((column) =>
    column.columns.length > 0 ? column.columns : [column],
  )

  return (
    <>
      <Popover>
        <PopoverTrigger className="max-md:hidden" asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent
          className="!bg-surface-primary max-w-66 px-3.5 pb-3.5"
          align="start"
          side="bottom"
        >
          <span className="text-secondary text-subtitle-11 uppercase">
            Columns
          </span>
          <div className="flex flex-wrap gap-1">
            {flattedColumns
              .filter((column) => column.getCanHide())
              .map((column) => (
                <ColumnControl key={column.id} column={column} />
              ))}
          </div>
        </PopoverContent>
      </Popover>
      <Drawer>
        <DrawerTrigger className="bg-surface-secondary md:hidden" asChild>
          {trigger}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="mb-3 gap-0">
            <DrawerTitle className="mb-0 text-lg text-primary">
              Columns
            </DrawerTitle>
            <DrawerDescription className="font-semibold text-secondary text-xs">
              Select chips to display columns.
            </DrawerDescription>
          </DrawerHeader>
          <div className="mb-5 flex flex-wrap gap-1">
            {flattedColumns
              .filter((column) => column.getCanHide())
              .map((column) => (
                <ColumnControl key={column.id} column={column} />
              ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

function ColumnControl<T>({ column }: { column: Column<T> }) {
  const isVisible = column.getIsVisible()
  return (
    <div
      key={column.id}
      className={cn(
        'flex h-8 cursor-pointer select-none items-center rounded-sm border border-divider bg-surface-secondary px-2.5 py-2 font-medium text-label-value-16 capitalize transition-all md:h-6 md:px-2 md:py-1.5 md:text-label-value-13',
        isVisible && 'border-brand bg-brand/15',
      )}
      onClick={() => column.toggleVisibility(!isVisible)}
    >
      {typeof column.columnDef.header === 'string'
        ? column.columnDef.header
        : column.id}
    </div>
  )
}
