import React, { useCallback } from 'react'
import { CheckIcon } from '~/icons/check'
import { ChevronIcon } from '~/icons/chevron'
import { cn } from '~/utils/cn'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandInputActionButton,
  CommandItem,
  CommandList,
} from './core/command'
import { Popover, PopoverContent, PopoverTrigger } from './core/popover'

interface Props {
  projects: string[]
  setProjects: (values: string[]) => void
  allProjects: string[]
  className?: string
}

export function ProjectCombobox({
  allProjects,
  projects,
  setProjects,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false)

  const onSelect = useCallback(
    (project: string) => {
      if (projects.includes(project)) {
        setProjects(projects.filter((p) => p !== project))
      } else {
        setProjects([...projects, project])
      }
    },
    [projects, setProjects],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn('group/popover-trigger h-8 justify-between', className)}
      >
        {projects.length > 1
          ? `${projects.length} projects selected`
          : projects.length === 1
            ? projects[0]
            : 'Select projects'}
        <ChevronIcon className="size-3 shrink-0 transition-transform group-data-[state=open]/popover-trigger:rotate-180" />
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search for project...">
            <CommandInputActionButton
              onClick={projects.length > 0 ? () => setProjects([]) : undefined}
            >
              {projects.length > 0 ? 'Clear' : undefined}
            </CommandInputActionButton>
          </CommandInput>
          <CommandList>
            <CommandEmpty>No projects found</CommandEmpty>
            <CommandGroup>
              {allProjects.map((project) => (
                <CommandItem key={project} value={project} onSelect={onSelect}>
                  <CheckIcon
                    className={cn(
                      'mr-2 size-5 shrink-0',
                      projects.includes(project) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <span className="text-sm font-bold">{project}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
