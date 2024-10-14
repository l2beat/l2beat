'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/command'
import { SearchIcon } from '~/icons/search'
import { useRouterWithProgressBar } from './progress-bar'

interface Props {
  allProjects: Project[]
  recentlyAdded: Project[]
}

interface Project {
  id: string
  name: string
  slug: string
}

export function SearchBar({ recentlyAdded, allProjects }: Props) {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
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
  }, [])

  const toShow =
    value === ''
      ? recentlyAdded
      : allProjects.filter((p) =>
          p.name.toLowerCase().startsWith(value.toLowerCase()),
        )

  return (
    <>
      <button
        onClick={() => setOpen((open) => !open)}
        className="flex h-10 w-72 items-center rounded-lg border border-surface-secondary bg-surface-primary p-2.5 text-secondary"
      >
        <SearchIcon className="size-5" />
        <span className="ml-2 text-sm font-medium">Search</span>
        <kbd className="ml-auto flex size-5 select-none items-center justify-center rounded border border-none bg-surface-tertiary px-1.5 font-mono text-2xs font-bold leading-none text-primary">
          /
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search for projects"
            value={value}
            onValueChange={setValue}
          />
          <CommandList className="h-[230px]">
            <CommandEmpty>No results found.</CommandEmpty>
            {toShow.map((project) => {
              return (
                <CommandItem
                  key={project.id}
                  className="gap-2"
                  asChild
                  onSelect={() => {
                    setOpen(false)
                    router.push(`/scaling/projects/${project.slug}`)
                    setValue('')
                  }}
                >
                  <Link href={`/scaling/projects/${project.slug}`}>
                    <Image
                      src={`/icons/${project.slug}.png`}
                      alt={`${project.name} logo`}
                      width={20}
                      height={20}
                    />
                    {project.name}
                  </Link>
                </CommandItem>
              )
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
