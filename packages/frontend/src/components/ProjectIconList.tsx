import { useState } from 'react'
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
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/Tooltip'

export interface ProjectIconListItem {
  id: string
  name: string
  iconUrl: string
  href: string
}

export interface ProjectIconListDialog {
  title: string
  description: string
  searchPlaceholder: string
  emptyText: string
}

interface Props {
  projects: ProjectIconListItem[]
  dialog: ProjectIconListDialog
  className?: string
  maxVisibleProjects?: number
  disableIconLinks?: boolean
}

export function ProjectIconList({
  projects,
  dialog,
  className,
  maxVisibleProjects = 5,
  disableIconLinks,
}: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  if (projects.length === 0) return null

  const visibleProjects = projects.slice(0, maxVisibleProjects)
  const overflowProjects = projects.slice(maxVisibleProjects)

  function onItemSelect(project: ProjectIconListItem) {
    setOpen(false)
    router.push(project.href)
  }

  return (
    <div
      className={cn('grid grid-cols-2', className)}
      style={{
        gridTemplateColumns: `${visibleProjects.length === 1 ? 20 : visibleProjects.length * 15}px 30px`,
      }}
    >
      <div className="-space-x-1.5 flex shrink-0 flex-row flex-nowrap items-center">
        {visibleProjects.map((project, index) => {
          const image = (
            <img
              width={20}
              height={20}
              src={project.iconUrl}
              alt={`${project.name} logo`}
              className="relative size-5 min-w-5 rounded-full bg-white shadow"
              style={{ zIndex: maxVisibleProjects - index }}
            />
          )

          return (
            <Tooltip key={project.id}>
              {disableIconLinks ? (
                <TooltipTrigger>{image}</TooltipTrigger>
              ) : (
                <TooltipTrigger asChild disabledOnMobile>
                  <a href={project.href} className="size-5">
                    {image}
                  </a>
                </TooltipTrigger>
              )}
              <TooltipContent>
                <p className="font-bold">{project.name}</p>
                {!disableIconLinks && (
                  <p className="text-secondary text-xs">
                    Click to view project page
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
      {overflowProjects.length > 0 && (
        <>
          <button
            type="button"
            className="font-bold text-label-value-13 hover:underline"
            onClick={(e) => {
              e.preventDefault()
              setOpen(true)
            }}
          >
            +{overflowProjects.length}
          </button>
          <CommandDialog
            open={open}
            onOpenChange={setOpen}
            title={dialog.title}
            description={dialog.description}
          >
            <Command className="rounded-none">
              <CommandInput placeholder={dialog.searchPlaceholder} />
              <CommandList>
                <CommandEmpty>{dialog.emptyText}</CommandEmpty>
                <CommandGroup>
                  {projects.map((project) => (
                    <CommandItem
                      key={project.id}
                      className="flex items-center gap-3"
                      onSelect={() => onItemSelect(project)}
                    >
                      <img
                        src={project.iconUrl}
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
