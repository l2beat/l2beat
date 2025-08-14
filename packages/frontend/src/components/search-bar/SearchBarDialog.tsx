import { assertUnreachable } from '@l2beat/shared-pure'
import fuzzysort from 'fuzzysort'
import groupBy from 'lodash/groupBy'
import { useMemo, useRef, useState } from 'react'
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
import { useGlobalShortcut } from '~/hooks/useGlobalShortcut'
import { useOnClickOutside } from '~/hooks/useOnClickOutside'
import { useRouter } from '~/hooks/useRouter'
import { useTracking } from '~/hooks/useTracking'
import { useSearchBarContext } from './SearchBarContext'
import type { AnySearchBarEntry, SearchBarProject } from './SearchBarEntry'
import type { SearchBarCategory } from './searchBarCategories'
import { searchBarCategories } from './searchBarCategories'
import { searchBarPages } from './searchBarPages'

interface Props {
  allProjects: SearchBarProject[]
  recentlyAdded: SearchBarProject[]
}

export function SearchBarDialog({ recentlyAdded, allProjects }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { track } = useTracking()
  const [value, setValue] = useState('')
  const { open, setOpen } = useSearchBarContext()
  const router = useRouter()

  useGlobalShortcut('/', () => setOpen((open) => !open))

  const filteredProjects = useMemo(
    () =>
      value === ''
        ? recentlyAdded
        : fuzzysort
            .go(value, allProjects, {
              limit: 15,
              keys: ['name', (e) => e.tags?.join() ?? ''],
              scoreFn: (match) =>
                match.score * (match.obj.category === 'zkCatalog' ? 0.9 : 1),
            })
            .map((match) => match.obj),
    [value, recentlyAdded, allProjects],
  )

  const filteredPages = useMemo(
    () =>
      fuzzysort
        .go(value, searchBarPages, {
          keys: ['name', (e) => e.tags?.join() ?? ''],
        })
        .flatMap((match) => match.obj)
        .sort((a, b) => a.index - b.index),

    [value],
  )

  const grouped = useMemo(() => {
    return Object.entries(
      groupBy([...filteredProjects, ...filteredPages], (p) => p.category),
    )
  }, [filteredProjects, filteredPages])

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
          <CommandEmpty>No results found.</CommandEmpty>

          {filteredProjects.length > 0 && value === '' && (
            <CommandGroup heading="Recently added projects">
              {filteredProjects.map((project) => {
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
          {value !== '' &&
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
                          : `${item.category}-${item.name}-${item.type}${'kind' in item ? `-${item.kind}` : ''}`
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
      {label && <div className="ml-auto text-secondary text-xs">{label}</div>}
    </CommandItem>
  )
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
      return undefined
    default:
      assertUnreachable(entry.kind)
  }
}
