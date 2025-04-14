import { notUndefined } from '@l2beat/shared-pure'
import { uniq, uniqBy } from 'lodash'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  popoverTriggerClasses,
} from '~/components/core/popover'
import { useGlobalShortcut } from '~/hooks/use-global-shortcut'
import { useIsMobile } from '~/hooks/use-is-mobile'
import { useTracking } from '~/hooks/use-tracking'
import { FilterIcon } from '~/icons/filter'
import { PlusIcon } from '~/icons/plus'
import { cn } from '~/utils/cn'
import type { FilterableEntry } from './filterable-value'
import {
  emptyStateLabel,
  filterIdToLabel,
  inputPlaceholder,
} from './filterable-value'
import { useTableFilterContext } from './table-filter-context'
import {
  TableFilterInternalContextProvider,
  useTableFilterInternalContext,
} from './table-filter-internal-context'
import { TableFilterValueMenuItems } from './table-filter-value-menu'

export function TableFilterSelector({
  entries,
}: { entries: FilterableEntry[] }) {
  const isMobile = useIsMobile()

  return (
    <TableFilterInternalContextProvider>
      {isMobile ? (
        <MobileFilters entries={entries} />
      ) : (
        <DesktopFilters entries={entries} />
      )}
    </TableFilterInternalContextProvider>
  )
}

function MobileFilters({
  entries,
}: {
  entries: FilterableEntry[]
}) {
  const { open, setOpen } = useTableFilterInternalContext()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(popoverTriggerClasses, 'h-8 gap-0')}
      >
        <Trigger />
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={'Filters'}
        description={'Select filters to apply'}
      >
        <Content entries={entries} />
      </CommandDialog>
    </>
  )
}

function DesktopFilters({
  entries,
}: {
  entries: FilterableEntry[]
}) {
  const { open, setOpen, onEscapeKeyDown } = useTableFilterInternalContext()

  useGlobalShortcut('f', () => {
    if (!open) {
      setOpen(true)
    }
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-8 gap-0">
        <Trigger />
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        side="bottom"
        onEscapeKeyDown={onEscapeKeyDown}
      >
        <Content entries={entries} />
      </PopoverContent>
    </Popover>
  )
}

function Trigger() {
  const { state } = useTableFilterContext()

  return (
    <>
      <FilterIcon />
      {Object.keys(state).length === 0 ? (
        <>
          <span className="ml-1.5 text-xs font-medium md:text-sm">Filters</span>
          <kbd className="ml-1.5 flex size-4 select-none items-center justify-center rounded bg-icon-secondary font-mono text-3xs font-bold text-primary-invert max-md:hidden">
            F
          </kbd>
        </>
      ) : (
        <PlusIcon className="ml-0.5 size-4" />
      )}
    </>
  )
}

function Content({
  entries,
}: {
  entries: FilterableEntry[]
}) {
  const { track } = useTracking()
  const uniqFilterablesIds = uniqBy(
    entries.flatMap((e) => e.filterable),
    'id',
  )
    .filter(notUndefined)
    .map((f) => f.id)

  const { selectedId, setSelectedId, search, setSearch } =
    useTableFilterInternalContext()

  return (
    <Command>
      <CommandInput
        placeholder={inputPlaceholder(selectedId)}
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>{emptyStateLabel(selectedId)}</CommandEmpty>
        {selectedId ? (
          <TableFilterValueMenuItems
            filterId={selectedId}
            values={uniq(
              entries.map(
                (e) => e.filterable?.find((f) => f.id === selectedId)!.value,
              ),
            ).filter(notUndefined)}
          />
        ) : (
          <CommandGroup>
            {uniqFilterablesIds.map((id) => (
              <CommandItem
                className="font-medium"
                key={id}
                value={id}
                onSelect={() => {
                  setSelectedId(id)
                  track('filterIdSelected', {
                    props: { name: id },
                  })
                }}
              >
                {filterIdToLabel[id]}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  )
}
