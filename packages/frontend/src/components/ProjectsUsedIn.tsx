import type { UsedInProject } from '@l2beat/config'
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { useRouter } from '~/hooks/useRouter'
import { cn } from '~/utils/cn'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './core/Command'

export interface UsedInProjectWithIcon extends UsedInProject {
  icon: string
  url: string
}
interface Props {
  usedIn: UsedInProjectWithIcon[]
  className?: string
  noL2ClassName?: string
  maxProjects?: number
  noTooltip?: boolean
  noLink?: boolean
}

export function ProjectsUsedIn({
  usedIn,
  className,
  noL2ClassName,
  maxProjects = 5,
  noTooltip,
  noLink,
}: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  if (usedIn.length === 0) {
    return (
      <Tooltip>
        <TooltipTrigger className={noL2ClassName}>No L2 😔</TooltipTrigger>
        <TooltipContent>
          There are no scaling projects listed on L2BEAT that use this solution.
        </TooltipContent>
      </Tooltip>
    )
  }

  const cappedProjects = usedIn.slice(0, maxProjects)

  const rest = usedIn.slice(maxProjects)

  function onItemSelect(item: UsedInProjectWithIcon) {
    setOpen(false)
    router.push(item.url)
  }

  return (
    <div
      className={cn(
        'flex shrink-0 flex-row flex-nowrap items-center gap-1.5',
        className,
      )}
    >
      {cappedProjects.map((project) => {
        return (
          <Tooltip key={project.slug}>
            {noLink ? (
              <TooltipTrigger>
                <img
                  width={20}
                  height={20}
                  src={project.icon}
                  alt={`${project.name} logo`}
                />
              </TooltipTrigger>
            ) : (
              <a href={project.url} className="size-5">
                <TooltipTrigger>
                  <img
                    width={20}
                    height={20}
                    src={project.icon}
                    alt={`${project.name} logo`}
                  />
                </TooltipTrigger>
              </a>
            )}
            <TooltipContent>
              <p className="font-bold">{project.name}</p>
              <p className="text-secondary text-xs">
                Click to view project page
              </p>
            </TooltipContent>
          </Tooltip>
        )
      })}
      {rest.length > 0 && (
        <>
          <button
            className="text-2xs hover:underline"
            onClick={(e) => {
              e.preventDefault()
              setOpen(true)
            }}
          >
            +{rest.length} more
          </button>
          <CommandDialog
            open={open}
            onOpenChange={setOpen}
            title="Projects used in"
            description="Search for projects used in"
          >
            <Command className="rounded-none">
              <CommandInput placeholder="Start typing to find project..." />
              <CommandList>
                <CommandEmpty>No projects found.</CommandEmpty>
                <CommandGroup>
                  {usedIn.map((project) => (
                    <CommandItem
                      key={project.slug}
                      className="flex items-center gap-3"
                      onSelect={() => onItemSelect(project)}
                    >
                      <img
                        src={project.icon}
                        alt={project.name}
                        width={20}
                        height={20}
                        className="size-5"
                      />
                      <span className="font-bold text-label-value-15">
                        {project.name}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </CommandDialog>
        </>
      )}
    </div>
  )
}
