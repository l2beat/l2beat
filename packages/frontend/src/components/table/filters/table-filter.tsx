'use client'
import { useState } from 'react'
import { CommandDialog } from '~/components/core/command'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
  popoverTriggerClasses,
} from '~/components/core/popover'
import { VerticalSeparator } from '~/components/core/vertical-separator'
import { useIsMobile } from '~/hooks/use-breakpoint'
import { CloseIcon } from '~/icons/close'
import { cn } from '~/utils/cn'
import { useTableFilterContext } from './table-filter-context'
import { TableFilterValueMenu } from './table-filter-value-menu'
import type { FilterState } from './use-filter-state'
import { filterIdToLabel, filterIdToValues } from './utils/filter-id-to-label'

interface Props {
  filter: FilterState[number]
  possibleValues: string[]
}

export function TableFilter({ filter, possibleValues }: Props) {
  const { dispatch } = useTableFilterContext()

  return (
    <div className="flex h-8 w-max select-none items-center rounded-lg bg-surface-primary text-xs font-medium leading-none primary-card:bg-surface-secondary md:text-sm">
      <div className="flex h-full items-center justify-center pl-2.5 pr-2">
        {filterIdToLabel[filter.id]}
      </div>
      <VerticalSeparator className="h-[30px]" />
      <button
        className="flex h-full items-center justify-center rounded-none px-2 font-medium focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
        onClick={() => {
          dispatch({
            type: 'setReversed',
            payload: { id: filter.id, value: !filter.reversed },
          })
        }}
      >
        {operatorLabel(filter)}
      </button>
      <VerticalSeparator className="h-[30px]" />
      <TableFilterValuePart filter={filter} possibleValues={possibleValues} />
      <VerticalSeparator className="h-[30px]" />
      <button
        className="h-full rounded-r-lg pl-2 pr-2.5 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand"
        onClick={() => dispatch({ type: 'remove', payload: { id: filter.id } })}
      >
        <div className="inline-flex size-3 items-center justify-center rounded-sm bg-brand">
          <CloseIcon className="size-2.5 fill-white dark:fill-black dark:group-hover:fill-gray-950" />
        </div>
      </button>
    </div>
  )
}

function TableFilterValuePart({ filter, possibleValues }: Props) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  const label =
    filter.values.length > 1
      ? `${filter.values.length} ${filterIdToValues[filter.id]}`
      : filter.values[0]

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className={cn(popoverTriggerClasses, 'h-8')}
        >
          {label}
        </button>
        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          title={'Filters'}
          description={'Select filters to apply'}
        >
          <TableFilterValueMenu
            filterId={filter.id}
            values={possibleValues}
            onSelect={() => setOpen(false)}
          />
        </CommandDialog>
      </>
    )
  }

  return (
    <Popover>
      <PopoverAnchor className="h-full" />
      <PopoverTrigger className="flex h-full items-center justify-center rounded-none px-2 font-medium">
        {label}
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0" side="bottom">
        <TableFilterValueMenu filterId={filter.id} values={possibleValues} />
      </PopoverContent>
    </Popover>
  )
}

function operatorLabel(filter: FilterState[number]) {
  if (filter.reversed) {
    return 'is not'
  }

  return filter.values.length > 1 ? 'is any of' : 'is'
}
