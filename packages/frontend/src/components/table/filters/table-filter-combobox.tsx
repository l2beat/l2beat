import { notUndefined } from '@l2beat/shared-pure'
import { uniq, uniqBy } from 'lodash'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
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
import { useTracking } from '~/hooks/use-custom-event'
import { useEventListener } from '~/hooks/use-event-listener'
import { FilterIcon } from '~/icons/filter'
import { PlusIcon } from '~/icons/plus'
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
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()
  const { track } = useTracking()

  useEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') {
      e.preventDefault()
      setOpen((open) => !open)
    }
  })

  useEffect(() => {
    if (open) {
      track('filtersOpened')
    }
  }, [open, track])

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
  open,
  setOpen,
}: {
  entries: FilterableEntry[]
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-8 gap-1.5">
        <Trigger />
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start" side="bottom">
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
      {state.length === 0 ? (
        <>
          <span className="text-xs font-medium md:text-sm">Filters</span>
          <kbd className="flex size-4 select-none items-center justify-center rounded bg-icon-secondary font-mono text-3xs font-bold text-primary-invert max-md:hidden">
            F
          </kbd>
        </>
      ) : (
        <PlusIcon className="size-4" />
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
