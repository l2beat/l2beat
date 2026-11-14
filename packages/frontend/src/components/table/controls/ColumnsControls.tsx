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
import { CloseIcon } from '~/icons/Close'
import { SlidersIcon } from '~/icons/Sliders'
import { cn } from '~/utils/cn'

interface Props<T> {
  columns: Column<T>[]
}

export function ColumnsControls<T>({ columns }: Props<T>) {
  const pickerColumns = columns
    .flatMap((column) => column.getLeafColumns())
    .filter((column) => column.getCanHide())
  const hiddenColumns = pickerColumns.filter((column) => !column.getIsVisible())

  const trigger = (
    <div className="mb-1 flex h-8 w-fit items-center rounded-lg bg-surface-secondary font-medium">
      <div className="flex h-full items-center gap-1.5 px-2">
        <SlidersIcon className="size-4 fill-secondary" />
        <span className="text-label-value-14 md:text-label-value-15">
          Columns
        </span>
      </div>
      {hiddenColumns.length > 0 && (
        <HiddenColumnsSegment hiddenColumns={hiddenColumns} />
      )}
    </div>
  )

  return (
    <>
      <Popover>
        {/* PopoverTrigger's own padding and gap are cleared here rather than on
            the child: Radix Slot concatenates class names without tailwind-merge,
            so overrides on the child lose to CSS order. */}
        <PopoverTrigger className="gap-0 p-0 max-md:hidden" asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent
          className="!bg-surface-primary max-w-66 px-3.5 pb-3.5"
          // Focus the panel, not its first chip: a mouse click would
          // otherwise ring that chip. Tab still reaches every chip.
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            if (event.currentTarget instanceof HTMLElement) {
              event.currentTarget.focus()
            }
          }}
          align="start"
          side="bottom"
        >
          <span className="text-secondary text-subtitle-11 uppercase">
            Columns
          </span>
          <div className="flex flex-wrap gap-1">
            {pickerColumns.map((column) => (
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
            {pickerColumns.map((column) => (
              <ColumnControl key={column.id} column={column} />
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

function HiddenColumnsSegment<T>({
  hiddenColumns,
}: {
  hiddenColumns: Column<T>[]
}) {
  return (
    <div className="h-full overflow-hidden">
      <div className="fade-in-0 slide-in-from-left-4 flex h-full animate-in items-center gap-1 whitespace-nowrap border-divider border-l pr-1 pl-2 font-medium text-label-value-13 text-secondary">
        <span>{hiddenColumns.length} hidden</span>
        <button
          type="button"
          aria-label="Show all columns"
          className="after:-inset-1 relative flex size-4 items-center justify-center rounded-sm transition-colors duration-150 ease-out after:absolute after:content-[''] hover:bg-surface-tertiary hover:text-primary"
          // Radix's trigger listens for pointerdown, so stopping only click
          // would still open the picker.
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            hiddenColumns.forEach((column) => column.toggleVisibility(true))
          }}
        >
          <CloseIcon className="size-2" />
        </button>
      </div>
    </div>
  )
}

function ColumnControl<T>({ column }: { column: Column<T> }) {
  const isVisible = column.getIsVisible()
  const header = column.columnDef.header
  return (
    <button
      type="button"
      key={column.id}
      aria-pressed={isVisible}
      className={cn(
        'flex h-8 cursor-pointer select-none items-center rounded-sm border border-divider bg-surface-secondary px-2.5 py-2 font-medium text-label-value-16 transition-colors md:h-6 md:px-2 md:py-1.5 md:text-label-value-13',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        isVisible && 'border-brand bg-brand/10 text-primary',
      )}
      onClick={() => column.toggleVisibility(!isVisible)}
    >
      {typeof header === 'string' ? header : sentenceCase(column.id)}
    </button>
  )
}

/** A fallback label from a column id, e.g. `pastDayUops` → "Past day uops". */
function sentenceCase(id: string) {
  const words = id.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}
