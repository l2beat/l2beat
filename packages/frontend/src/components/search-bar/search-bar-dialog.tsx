'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/command'
import { useRouterWithProgressBar } from '../progress-bar'
import {
  type SearchBarProject,
  useSearchBarContext,
} from './search-bar-context'

interface Props {
  allProjects: SearchBarProject[]
  recentlyAdded: SearchBarProject[]
}

export function SearchBarDialog({ recentlyAdded, allProjects }: Props) {
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
            .filter((p) => p.name.toLowerCase().includes(value.toLowerCase()))
            .sort((a, b) => {
              // Sort filtered pages: exact matches first, then partial matches
              const searchTerm = value.toLowerCase()
              return (
                (a.name.toLowerCase().startsWith(searchTerm) ? -1 : 1) ||
                (a.name.toLowerCase().includes(searchTerm) ? -1 : 1) ||
                a.name.localeCompare(b.name)
              )
            })
            .slice(0, 15),
    [value, allProjects, recentlyAdded],
  )

  const onEscapeKeyDown = (e: KeyboardEvent) => {
    e.preventDefault()
    if (value !== '') {
      setValue('')
      return
    }
    setOpen(false)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      onEscapeKeyDown={onEscapeKeyDown}
    >
      <Command shouldFilter={false} sidebar>
        <CommandInput
          placeholder="Search for projects"
          value={value}
          onValueChange={setValue}
        />
        <CommandList className="h-[270px]">
          <CommandEmpty>No results found.</CommandEmpty>
          {filteredProjects.length > 0 && (
            <CommandGroup
              heading={value === '' ? 'Recently added projects' : 'Projects'}
            >
              {filteredProjects.map((project) => {
                return (
                  <CommandItem
                    key={project.id}
                    className="gap-2"
                    onSelect={() => {
                      setOpen(false)
                      router.push(project.href)
                    }}
                  >
                    <Image
                      src={project.iconUrl}
                      alt={`${project.name} logo`}
                      width={20}
                      height={20}
                    />
                    {project.name}
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
