import { notUndefined } from '@l2beat/shared-pure'
import { uniq, uniqBy } from 'lodash'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
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
import { useIsMobile } from '~/hooks/use-breakpoint'
import { useEventListener } from '~/hooks/use-event-listener'
import { FilterIcon } from '~/icons/filter'
import { cn } from '~/utils/cn'
import { useTableFilterContext } from './table-filter-context'
import { TableFilterValueMenuItems } from './table-filter-value-menu'
import type { FilterableEntry, FilterableValueId } from './types'
import {
  emtpyStateLabel,
  filterIdToLabel,
  inputPlaceholder,
} from './utils/labels'

export function TableFilterCombobox({
  entries,
}: { entries: FilterableEntry[] }) {
  useTableFilterContext()
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  useEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') {
      e.preventDefault()
      setOpen((open) => !open)
    }
  })

  if (isMobile) {
    return <MobileFilters entries={entries} open={open} setOpen={setOpen} />
  }

  return <DesktopFilters entries={entries} open={open} setOpen={setOpen} />
}

function MobileFilters({
  entries,
  open,
  setOpen,
}: {
  entries: FilterableEntry[]
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(popoverTriggerClasses, 'h-8')}
      >
        <FilterIcon />
        <span className="text-xs font-medium md:text-sm">Filters</span>
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={'Filters'}
        description={'Select filters to apply'}
      >
        <Content entries={entries} onValueSelect={() => setOpen(false)} />
      </CommandDialog>
    </>
  )
}

function DesktopFilters({
  entries,
  open,
  setOpen,
}: {
  entries: FilterableEntry[]
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { state } = useTableFilterContext()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-8 gap-1.5">
        <FilterIcon />
        {state.length === 0 && (
          <>
            <span className="text-xs font-medium md:text-sm">Filters</span>
            <kbd className="flex size-4 items-center justify-center rounded bg-icon-secondary text-3xs text-primary-invert">
              F
            </kbd>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start" side="bottom">
        <Content entries={entries} />
      </PopoverContent>
    </Popover>
  )
}

function Content({
  entries,
  onValueSelect,
}: {
  entries: FilterableEntry[]
  onValueSelect?: (value: string) => void
}) {
  const [selectedId, setSelectedId] = useState<FilterableValueId | undefined>(
    undefined,
  )
  const uniqFilterablesIds = uniqBy(
    entries.flatMap((e) => e.filterable),
    'id',
  )
    .filter(notUndefined)
    .map((f) => f.id)

  return (
    <Command className="border border-divider">
      <CommandInput placeholder={inputPlaceholder(selectedId)} />
      <CommandList>
        <CommandEmpty>{emtpyStateLabel(selectedId)}</CommandEmpty>
        {selectedId ? (
          <TableFilterValueMenuItems
            filterId={selectedId}
            values={uniq(
              entries.map(
                (e) => e.filterable?.find((f) => f.id === selectedId)!.value,
              ),
            ).filter(notUndefined)}
            onSelect={onValueSelect}
          />
        ) : (
          <CommandGroup>
            {uniqFilterablesIds.map((id) => (
              <CommandItem
                className="font-medium"
                key={id}
                value={id}
                onSelect={() => setSelectedId(id)}
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
