'use client'

import { assertUnreachable } from '@l2beat/shared-pure'
import fuzzysort from 'fuzzysort'
import { groupBy } from 'lodash'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { type Entries } from 'type-fest'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandInputActionButton,
  CommandItem,
  CommandList,
} from '~/components/core/command'
import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import { useRouterWithProgressBar } from '../progress-bar'
import {
  type SearchBarCategory,
  searchBarCategories,
} from './search-bar-categories'
import { useSearchBarContext } from './search-bar-context'
import {
  type AnySearchBarEntry,
  type SearchBarProject,
} from './search-bar-entry'
import { searchBarPages } from './search-bar-pages'
interface Props {
  allProjects: SearchBarProject[]
  recentlyAdded: SearchBarProject[]
}

export function SearchBarDialog({ recentlyAdded, allProjects }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const { open, setOpen } = useSearchBarContext()
  const router = useRouterWithProgressBar()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [setOpen])

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
    ) as Entries<Record<SearchBarCategory, AnySearchBarEntry[]>>
  }, [filteredProjects, filteredPages])

  const onEscapeKeyDown = (e?: KeyboardEvent) => {
    e?.preventDefault()
    if (value !== '') {
      setValue('')
      return
    }
    setOpen(false)
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
    >
      <Command shouldFilter={false} sidebar className="rounded-none">
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
        <CommandList className="max-h-screen md:h-[270px] md:max-h-[270px] [@supports(height:100dvh)]:max-h-dvh">
          <CommandEmpty>No results found.</CommandEmpty>

          {filteredProjects.length > 0 && value === '' && (
            <CommandGroup heading="Recently added projects">
              {filteredProjects.map((project) => {
                return (
                  <SearchBarItem
                    key={project.id}
                    onSelect={() => {
                      setOpen(false)
                      setValue('')
                      router.push(project.href)
                    }}
                    label={entryToLabel(project)}
                  >
                    <Image
                      src={project.iconUrl}
                      alt={`${project.name} logo`}
                      className="rounded-sm"
                      width={20}
                      height={20}
                    />
                    {project.name}
                  </SearchBarItem>
                )
              })}
            </CommandGroup>
          )}
          {value !== '' &&
            grouped.length > 0 &&
            grouped.map(([group, items], groupIndex) => (
              <CommandGroup
                heading={searchBarCategories[group].name}
                key={group}
              >
                {items.map((item, index) => {
                  return (
                    <SearchBarItem
                      key={item.href}
                      onSelect={() => {
                        setOpen(false)
                        setValue('')
                        router.push(item.href)
                      }}
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
                        <Image
                          src={item.iconUrl}
                          alt={`${item.name} logo`}
                          className="rounded-sm"
                          width={20}
                          height={20}
                        />
                      )}
                      {item.name}
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
      {label && <div className="ml-auto text-xs text-secondary">{label}</div>}
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
