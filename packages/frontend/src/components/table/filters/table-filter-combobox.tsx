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
import { useGlobalShortcut } from '~/hooks/use-global-shortcut'
import { useTracking } from '~/hooks/use-tracking'
import { FilterIcon } from '~/icons/filter'
import { PlusIcon } from '~/icons/plus'
import { cn } from '~/utils/cn'
import { useTableFilterContext } from './table-filter-context'
import { TableFilterValueMenuItems } from './table-filter-value-menu'
import type { FilterableEntry, FilterableValueId } from './types'
import {
  emptyStateLabel,
  filterIdToLabel,
  inputPlaceholder,
} from './utils/labels'

export function TableFilterCombobox({
  entries,
}: { entries: FilterableEntry[] }) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()
  const { track } = useTracking()

  useGlobalShortcut('f', () => {
    if (!open) {
      setOpen(true)
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
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<FilterableValueId | undefined>(
    undefined,
  )

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
        <Content
          entries={entries}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          search={search}
          setSearch={setSearch}
        />
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
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<FilterableValueId | undefined>(
    undefined,
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-8 gap-1.5">
        <Trigger />
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        side="bottom"
        onEscapeKeyDown={(e) => {
          if (search) {
            e.preventDefault()
            setSearch('')
            return
          }
          if (selectedId) {
            e.preventDefault()
            setSelectedId(undefined)
          }
        }}
      >
        <Content
          entries={entries}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          search={search}
          setSearch={setSearch}
        />
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
  selectedId,
  setSelectedId,
  search,
  setSearch,
}: {
  entries: FilterableEntry[]
  selectedId: FilterableValueId | undefined
  setSelectedId: Dispatch<SetStateAction<FilterableValueId | undefined>>
  search: string
  setSearch: Dispatch<SetStateAction<string>>
}) {
  const { track } = useTracking()
  const uniqFilterablesIds = uniqBy(
    entries.flatMap((e) => e.filterable),
    'id',
  )
    .filter(notUndefined)
    .map((f) => f.id)

  return (
    <Command className="border border-divider">
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
