import type { Column } from '@tanstack/react-table'
import { useEffect, useRef, useState } from 'react'
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
import { EyeOffIcon } from '~/icons/EyeOff'
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
    <div className="mb-1 flex h-8 w-fit items-center rounded-lg bg-surface-secondary font-semibold text-base">
      <div className="flex h-full items-center gap-1.5 px-2">
        <SlidersIcon className="size-4 fill-secondary" />
        <span className="text-label-value-14 md:text-label-value-15">
          Columns
        </span>
      </div>
      <HiddenColumnsSegment hiddenColumns={hiddenColumns} />
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

/**
 * Stays mounted while empty so the segment can slide out from under the
 * "Columns" label and back, both on toggle and when persisted visibility
 * arrives after hydration. The animated grid track drives the width; the
 * content translates so it appears to emerge from behind the left segment.
 */
function HiddenColumnsSegment<T>({
  hiddenColumns,
}: {
  hiddenColumns: Column<T>[]
}) {
  const isOpen = useOpenAfterPaint(hiddenColumns.length > 0)
  const lastCount = useLastNonZero(hiddenColumns.length)

  return (
    <div
      inert={!isOpen}
      aria-hidden={!isOpen}
      className={cn(
        'grid h-full ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:transition-[grid-template-columns] motion-reduce:transition-opacity',
        isOpen
          ? 'duration-200 [grid-template-columns:1fr] motion-reduce:opacity-100'
          : 'duration-150 [grid-template-columns:0fr] motion-reduce:opacity-0',
      )}
    >
      <div className="min-w-0 overflow-hidden">
        <div
          className={cn(
            'flex h-8 w-max items-center gap-1 whitespace-nowrap border-divider border-l pr-1 pl-2 font-medium text-label-value-13 text-secondary ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:transition-transform',
            isOpen
              ? 'translate-x-0 duration-200'
              : '-translate-x-full duration-150',
          )}
        >
          <span className="flex items-center gap-1.5">
            <EyeOffIcon className="size-3.5" />
            {lastCount} hidden
          </span>
          <button
            type="button"
            aria-label="Show all columns"
            tabIndex={isOpen ? 0 : -1}
            className="flex size-4 items-center justify-center rounded-sm transition-colors duration-150 ease-out hover:bg-surface-tertiary hover:text-primary"
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
    </div>
  )
}

/**
 * Opening waits for two frames so the transition starts once the browser is
 * painting again. When persisted visibility lands during hydration, React keeps
 * the main thread busy longer than the animation lasts, so a transition started
 * in that same task finishes before its first frame is ever drawn. Closing is
 * immediate so the reset feels instant.
 */
function useOpenAfterPaint(wantOpen: boolean) {
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    if (!wantOpen) {
      setIsOpen(false)
      return
    }
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setIsOpen(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [wantOpen])
  return isOpen
}

/** Keeps the last real count on screen while the segment collapses. */
function useLastNonZero(count: number) {
  const last = useRef(count)
  if (count > 0) last.current = count
  return last.current
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
