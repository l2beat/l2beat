import { assertUnreachable } from '@l2beat/shared-pure'
import { Command as CommandPrimitive } from 'cmdk'
import fuzzysort from 'fuzzysort'
import groupBy from 'lodash/groupBy'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandInputActionButton,
  CommandItem,
  CommandList,
} from '~/components/core/Command'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useGlobalShortcut } from '~/hooks/useGlobalShortcut'
import { useOnClickOutside } from '~/hooks/useOnClickOutside'
import { useRouter } from '~/hooks/useRouter'
import { useTracking } from '~/hooks/useTracking'
import type { SearchBarProject } from '~/server/features/projects/search-bar/types'
import { api } from '~/trpc/React'
import { Skeleton } from '../core/Skeleton'
import { useSearchBarContext } from './SearchBarContext'
import type { SearchBarCategory } from './searchBarCategories'
import { searchBarCategories } from './searchBarCategories'
import { searchBarPages } from './searchBarPages'
import type { AnySearchBarEntry } from './types'

interface Props {
  recentlyAdded: SearchBarProject[]
}

export function SearchBarDialog({ recentlyAdded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { track } = useTracking()
  const [value, setValue] = useState('')
  const debouncedValue = useDebouncedValue(value, 200)
  const { open, setOpen } = useSearchBarContext()
  const router = useRouter()

  useGlobalShortcut('/', () => setOpen((open) => !open))

  const { data: allProjects, isFetching } = api.projects.searchBar.useQuery(
    debouncedValue,
    {
      enabled: debouncedValue !== '',
    },
  )

  useEffect(() => {
    if (debouncedValue === '') return
    track('searchBarSearched', {
      props: { value: debouncedValue },
    })
  }, [debouncedValue, track])

  const filteredPages = useMemo(
    () =>
      fuzzysort
        .go(debouncedValue, searchBarPages, {
          keys: ['name', (e) => e.tags?.join() ?? ''],
        })
        .flatMap((match) => match.obj)
        .sort((a, b) => a.index - b.index),

    [debouncedValue],
  )

  const grouped = useMemo(() => {
    if (!allProjects) return []
    return Object.entries(
      groupBy([...allProjects, ...filteredPages], (p) => p.category),
    )
  }, [allProjects, filteredPages])

  const onEscapeKeyDown = (e?: KeyboardEvent) => {
    e?.preventDefault()
    if (value !== '') {
      setValue('')
      return
    }
    setOpen(false)
  }

  function onItemSelect(item: SearchBarProject | AnySearchBarEntry) {
    setOpen(false)
    setValue('')
    router.push(item.href)
    track('searchBarProjectSelected', {
      props: {
        name: item.name,
      },
    })
  }

  // Hide virtual keyboard on touch start
  useOnClickOutside(inputRef, () => inputRef.current?.blur(), 'touchstart')

  return (
    <CommandDialog
      title="Search"
      description="Search for projects by name"
      open={open}
      onOpenChange={setOpen}
      onEscapeKeyDown={onEscapeKeyDown}
      fullScreenMobile
    >
      <Command shouldFilter={false} className="rounded-none">
        <CommandInput
          ref={inputRef}
          placeholder="Search for projects"
          value={value}
          onValueChange={setValue}
        >
          <CommandInputActionButton onClick={() => onEscapeKeyDown()}>
            {value !== '' ? 'Clear' : 'Close'}
          </CommandInputActionButton>
        </CommandInput>
        <CommandList className="max-h-screen supports-[height:100dvh]:max-h-dvh md:h-[270px] md:max-h-[270px]">
          {((value !== debouncedValue && value !== '') || isFetching) && (
            <CommandPrimitive.Loading>
              <CommandGroup>
                <div className="flex h-8 items-center px-2 py-3">
                  <Skeleton className="h-4 w-[150px] rounded-sm" />
                </div>
                <SearchBarItemSkeleton />
                <SearchBarItemSkeleton />
                <SearchBarItemSkeleton />
                <SearchBarItemSkeleton />
                <SearchBarItemSkeleton />
                <SearchBarItemSkeleton />
              </CommandGroup>
            </CommandPrimitive.Loading>
          )}
          <CommandEmpty>No results found.</CommandEmpty>

          {value === '' && (
            <CommandGroup heading="Recently added projects">
              {recentlyAdded.map((project) => {
                return (
                  <SearchBarItem
                    key={project.id}
                    onSelect={() => onItemSelect(project)}
                    label={entryToLabel(project)}
                  >
                    <img
                      src={project.iconUrl}
                      alt={`${project.name} logo`}
                      className="rounded-sm"
                      width={20}
                      height={20}
                    />
                    <div className="flex flex-col">
                      <div className="font-medium text-sm leading-none tracking-[-1%]">
                        {project.name}
                      </div>
                      {project.scalingCategory && (
                        <div className="font-medium text-2xs text-secondary leading-none tracking-[-1%]">
                          {project.isUpcoming
                            ? 'Upcoming'
                            : project.scalingCategory}
                        </div>
                      )}
                    </div>
                  </SearchBarItem>
                )
              })}
            </CommandGroup>
          )}
          {value === debouncedValue &&
            value !== '' &&
            grouped.length > 0 &&
            grouped.map(([group, items], groupIndex) => (
              <CommandGroup
                heading={searchBarCategories[group as SearchBarCategory].name}
                key={group}
              >
                {items.map((item, index) => {
                  return (
                    <SearchBarItem
                      key={item.href}
                      onSelect={() => onItemSelect(item)}
                      label={entryToLabel(item)}
                      value={
                        // I know it looks ugly but there is a bug in CMDK that scrolls to wrong item sometimes.
                        // For example try to search "nea" without this hack.
                        // It will scroll to "Neva" but highlight "Rainbow Bridge" (highlight is correct cuz near is tag for it)
                        // Using '-' as value makes first item always selected.
                        // https://github.com/pacocoursey/cmdk/issues/171#issuecomment-1775421795
                        groupIndex === 0 && index === 0
                          ? '-'
                          : entryToValue(item)
                      }
                    >
                      {item.type === 'project' && (
                        <img
                          src={item.iconUrl}
                          alt={`${item.name} logo`}
                          className="rounded-sm"
                          width={20}
                          height={20}
                        />
                      )}
                      <div className="flex flex-col">
                        <div className="font-medium text-sm leading-none tracking-[-1%]">
                          {item.name}
                        </div>
                        {item.type === 'project' && item.scalingCategory && (
                          <div className="font-medium text-2xs text-secondary leading-none tracking-[-1%]">
                            {item.isUpcoming
                              ? 'Upcoming'
                              : item.scalingCategory}
                          </div>
                        )}
                      </div>
                    </SearchBarItem>
                  )
                })}
              </CommandGroup>
            ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

function SearchBarItem({
  onSelect,
  children,
  label,
  value,
}: {
  onSelect: () => void
  children: React.ReactNode
  label?: string
  value?: string
}) {
  return (
    <CommandItem
      className="cursor-pointer gap-2 rounded-lg"
      onSelect={onSelect}
      value={value}
    >
      {children}
      {label && (
        <div className="ml-auto text-secondary text-xs leading-none">
          {label}
        </div>
      )}
    </CommandItem>
  )
}

function SearchBarItemSkeleton() {
  return (
    <div className="flex h-11 items-center justify-between px-2 py-3">
      <div className="flex items-center gap-2">
        <Skeleton className="size-5 rounded-sm" />
        <Skeleton className="h-[15px] w-20 rounded-sm" />
      </div>
      <Skeleton className="h-3.5 w-[45px] rounded-sm" />
    </div>
  )
}

function entryToValue(entry: AnySearchBarEntry) {
  if (entry.type === 'page') {
    return `${entry.category}-${entry.name}-${entry.type}`
  }

  return `${entry.category}-${entry.id}-${entry.type}-${entry.kind}`
}

function entryToLabel(entry: AnySearchBarEntry) {
  if (entry.type === 'page') return 'Page'
  switch (entry.kind) {
    case 'layer2':
      return 'Layer 2'
    case 'layer3':
      return 'Layer 3'
    case 'bridge':
      return 'Bridge'
    case 'da':
      return 'DA Layer'
    case 'zkCatalog':
      return 'ZK Project'
    case 'ecosystem':
      return 'Ecosystem'
    default:
      assertUnreachable(entry.kind)
  }
}
