import { CommandDialog } from '~/components/core/Command'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
  popoverTriggerClasses,
} from '~/components/core/Popover'
import { VerticalSeparator } from '~/components/core/VerticalSeparator'
import { useDevice } from '~/hooks/useDevice'
import { CloseIcon } from '~/icons/Close'
import { cn } from '~/utils/cn'
import { nameInView, withViewTransition } from '~/utils/viewTransition'
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
      // The chips after a removed one close the gap (nameChips).
      data-filter-chip={filter.id}
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
        className="flex h-full items-center justify-center text-nowrap rounded-none px-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
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
        className="h-full rounded-r-lg pr-2.5 pl-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
        onClick={(event) => {
          const remove = () =>
            dispatch({ type: 'remove', payload: { id: filter.id } })
          // From the keyboard it just goes.
          if (event.detail === 0) remove()
          else withViewTransition('chips', nameChips, remove)
        }}
        aria-label={`Remove ${filterIdToLabel[filter.id]} filter`}
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
  const { isDesktop } = useDevice()

  if (isDesktop) {
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

function operatorLabel(filter: Filter) {
  if (filter.inversed) {
    return 'is not'
  }

  return filter.values.length > 1 ? 'is any of' : 'is'
}

/**
 * The filter chips in view: the removed one shrinks away where it was, the
 * others slide over into its room. The table under them swaps at once.
 */
function nameChips() {
  return nameInView(
    '[data-filter-chip]',
    (el) => el.dataset.filterChip,
    'filter-chip',
  )
}
