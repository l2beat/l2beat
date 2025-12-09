import type { Column } from '@tanstack/react-table'
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
  return (
    <Popover>
      <PopoverTrigger className="flex h-8 gap-1.5">
        <SlidersIcon className="fill-secondary" />
        <span className="text-label-value-16">Columns</span>
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
          {columns
            .filter((column) => column.getCanHide())
            .map((column) => {
              const isVisible = column.getIsVisible()
              return (
                <div
                  key={column.id}
                  className={cn(
                    'cursor-pointer select-none rounded-sm border border-divider bg-surface-secondary px-2 py-1.5 font-medium text-label-value-13 capitalize',
                    isVisible && 'border-brand bg-brand/15',
                  )}
                  onClick={() => column.toggleVisibility(!isVisible)}
                >
                  {typeof column.columnDef.header === 'string'
                    ? column.columnDef.header
                    : column.id}
                </div>
              )
            })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
