'use client'

import { assertUnreachable } from '@l2beat/shared-pure'
import fuzzysort from 'fuzzysort'
import Image from 'next/image'
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
} from '~/components/core/command'
import { useOnClickOutside } from '~/hooks/use-on-click-outside'
import { useRouterWithProgressBar } from '../progress-bar'
import { useSearchBarContext } from './search-bar-context'
import { type SearchBarPage, searchBarPages } from './search-bar-pages'
import { type SearchBarProject } from './search-bar-projects'
import { groupBy } from 'lodash'
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
              keys: ['name', (e) => e.tags.join()],
              scoreFn: (match) =>
                match.score * (match.obj.type === 'zk-catalog' ? 0.9 : 1),
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
      groupBy([...filteredProjects, ...filteredPages], (p) =>
        typeToGroup(p.type),
      ),
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
                const label = typeToLabel(project.type)
                return (
                  <SearchBarItem
                    key={project.id}
                    onSelect={() => {
                      setOpen(false)
                      setValue('')
                      router.push(project.href)
                    }}
                    label={label}
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
            grouped.map(([group, items]) => (
              <CommandGroup heading={group} key={group}>
                {items.map((page) => {
                  const label = typeToLabel(page.type)
                  return (
                    <SearchBarItem
                      key={page.href}
                      onSelect={() => {
                        setOpen(false)
                        setValue('')
                        router.push(page.href)
                      }}
                      label={label}
                    >
                      {'iconUrl' in page && (
                        <Image
                          src={page.iconUrl}
                          alt={`${page.name} logo`}
                          className="rounded-sm"
                          width={20}
                          height={20}
                        />
                      )}
                      {page.name}
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
}: { onSelect: () => void; children: React.ReactNode; label?: string }) {
  return (
    <CommandItem
      className="cursor-pointer gap-2 rounded-lg"
      onSelect={onSelect}
    >
      {children}
      {label && <div className="ml-auto text-xs text-secondary">{label}</div>}
    </CommandItem>
  )
}

function typeToGroup(type: SearchBarProject['type'] | SearchBarPage['type']) {
  switch (type) {
    case 'layer2':
    case 'layer3':
    case 'scaling':
      return 'Scaling'
    case 'bridge':
    case 'bridges':
      return 'Bridges'
    case 'da':
      return 'Data Availability'
    case 'zk-catalog':
      return 'ZK Catalog'
    case undefined:
      return undefined
    default:
      assertUnreachable(type)
  }
}

function typeToLabel(type: SearchBarProject['type'] | SearchBarPage['type']) {
  switch (type) {
    case 'layer2':
      return 'Layer 2'
    case 'layer3':
      return 'Layer 3'
    case 'bridge':
      return 'Bridge'
    case 'da':
      return 'DA'
    case 'zk-catalog':
      return 'ZK Catalog'
    case 'bridges':
      return 'Bridges'
    case 'scaling':
      return 'Scaling'
    case undefined:
      return undefined
    default:
      assertUnreachable(type)
  }
}
