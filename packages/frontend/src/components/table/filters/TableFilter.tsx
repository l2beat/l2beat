import { CommandDialog } from '~/components/core/Command'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
  popoverTriggerClasses,
} from '~/components/core/Popover'
import { VerticalSeparator } from '~/components/core/VerticalSeparator'
import { useIsMobile } from '~/hooks/useIsMobile'
import { CloseIcon } from '~/icons/Close'
import { cn } from '~/utils/cn'
import type { FilterableValueId } from './filterableValue'
import { filterIdToLabel } from './filterableValue'
import { useTableFilterContext } from './TableFilterContext'
import {
  TableFilterInternalContextProvider,
  useTableFilterInternalContext,
} from './TableFilterInternalContext'
import { TableFilterValue } from './TableFilterValue'
import { TableFilterValueMenu } from './TableFilterValueMenu'
import type { FilterValue } from './UseFilterState'

interface Filter extends FilterValue {
  id: FilterableValueId
}

interface Props {
  filter: Filter
  possibleValues: string[]
}

export function TableFilter({ filter, possibleValues }: Props) {
  const { dispatch } = useTableFilterContext()

  return (
    <div
      className={cn(
        'flex h-8 w-max select-none items-center rounded-lg bg-surface-primary primary-card:bg-surface-secondary font-medium text-xs leading-none md:text-sm',
        'fade-in-0 zoom-in-95 slide-in-from-left-2 animate-in',
      )}
    >
      <div className="flex h-full items-center justify-center pr-2 pl-2.5">
        {filterIdToLabel[filter.id]}
      </div>
      <VerticalSeparator className="h-[30px]" />
      <button
        className="flex h-full items-center justify-center rounded-none px-2 font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:ring-inset"
        onClick={() => {
          dispatch({
            type: 'setInversed',
            payload: { id: filter.id, value: !filter.inversed },
          })
        }}
      >
        {operatorLabel(filter)}
      </button>
      <VerticalSeparator className="h-[30px]" />
      <TableFilterInternalContextProvider>
        <TableFilterValuePart filter={filter} possibleValues={possibleValues} />
      </TableFilterInternalContextProvider>
      <VerticalSeparator className="h-[30px]" />
      <button
        className="h-full rounded-r-lg pr-2.5 pl-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-inset"
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
  const { open, setOpen, onEscapeKeyDown } = useTableFilterInternalContext()
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className={cn(popoverTriggerClasses, 'h-8')}
        >
          <TableFilterValue values={filter.values} filterId={filter.id} />
        </button>
        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          title={'Filters'}
          description={'Select filters to apply'}
        >
          <TableFilterValueMenu filterId={filter.id} values={possibleValues} />
        </CommandDialog>
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor className="h-full" />
      <PopoverTrigger className="flex h-full items-center justify-center rounded-none px-2 font-medium">
        <TableFilterValue values={filter.values} filterId={filter.id} />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-0"
        side="bottom"
        onEscapeKeyDown={onEscapeKeyDown}
      >
        <TableFilterValueMenu filterId={filter.id} values={possibleValues} />
      </PopoverContent>
    </Popover>
  )
}

function operatorLabel(filter: Filter) {
  if (filter.inversed) {
    return 'is not'
  }

  return filter.values.length > 1 ? 'is any of' : 'is'
}
