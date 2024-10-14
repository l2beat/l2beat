'use client'

import Image from 'next/image'
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

  const filteredProjects =
    value === ''
      ? recentlyAdded
      : allProjects.filter((p) =>
          p.name.toLowerCase().includes(value.toLowerCase()),
        )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command shouldFilter={false}>
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
