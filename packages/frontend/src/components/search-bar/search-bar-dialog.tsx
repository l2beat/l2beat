'use client'

import { assertUnreachable } from '@l2beat/shared-pure'
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
import { type SearchBarProject } from './get-search-bar-projects'
import { useSearchBarContext } from './search-bar-context'

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
        : allProjects
            .filter((p) => {
              return (
                p.name.toLowerCase().includes(value.toLowerCase()) ||
                p.matchers.some((m) => m.includes(value.toLowerCase()))
              )
            })
            .sort((a, b) => {
              // Sort filtered pages: exact matches first, then partial matches
              const searchTerm = value.toLowerCase()
              const aName = a.name.toLowerCase()
              const bName = b.name.toLowerCase()

              if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm))
                return -1
              if (!aName.startsWith(searchTerm) && bName.startsWith(searchTerm))
                return 1

              if (aName.includes(searchTerm) && !bName.includes(searchTerm))
                return -1
              if (!aName.includes(searchTerm) && bName.includes(searchTerm))
                return 1

              return a.name.localeCompare(b.name)
            })
            .slice(0, 15),
    [value, allProjects, recentlyAdded],
  )

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
          {filteredProjects.length > 0 && (
            <CommandGroup
              heading={value === '' ? 'Recently added projects' : 'Projects'}
            >
              {filteredProjects.map((project) => {
                return (
                  <CommandItem
                    key={project.id}
                    className="cursor-pointer gap-2 rounded-lg"
                    onSelect={() => {
                      setOpen(false)
                      setValue('')
                      router.push(project.href)
                    }}
                  >
                    <Image
                      src={project.iconUrl}
                      alt={`${project.name} logo`}
                      className="rounded-sm"
                      width={20}
                      height={20}
                    />
                    {project.name}
                    <div className="ml-auto text-xs text-secondary">
                      {typeToLabel(project.type)}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

function typeToLabel(type: SearchBarProject['type']) {
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
    default:
      assertUnreachable(type)
  }
}
