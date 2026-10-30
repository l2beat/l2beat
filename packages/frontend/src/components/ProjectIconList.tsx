import type { Stage } from '@l2beat/config'
import { useState } from 'react'
import { useDevice } from '~/hooks/useDevice'
import { useRouter } from '~/hooks/useRouter'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { StageBadge } from './badge/StageBadge'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './core/Command'
import { Popover, PopoverContent, PopoverTrigger } from './core/Popover'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/Tooltip'

export interface ProjectIconListItem {
  id: string
  name: string
  iconUrl: string
  href?: string
  /** A line under the name in the list, e.g. the project's category. */
  description?: string
  stage?: Stage
}

interface Props {
  projects: ProjectIconListItem[]
  /** Heads the list, e.g. "Privacy projects on Arbitrum One". */
  title: string
  className?: string
}

// Short lists are scanned faster than searched.
const MIN_SEARCHABLE_PROJECTS = 7

/**
 * A single project as its icon; more as a pill of stacked icons and the count
 * that opens the full list.
 */
export function ProjectIconList({ projects, title, className }: Props) {
  const [open, setOpen] = useState(false)
  const { isDesktop } = useDevice()

  if (projects.length === 0) return null
  if (projects.length === 1 && projects[0]) {
    return <SingleProject project={projects[0]} className={className} />
  }

  const pill = <IconStackPill icons={projects} count={projects.length} />
  const list = (
    <ProjectList
      projects={projects}
      title={title}
      onSelect={() => setOpen(false)}
    />
  )

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(iconStackPillClasses, className)}
          aria-label={title}
        >
          {pill}
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          {list}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <>
      <button
        type="button"
        className={cn(iconStackPillClasses, className)}
        aria-label={title}
        onClick={() => setOpen(true)}
      >
        {pill}
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={title}
      >
        {list}
      </CommandDialog>
    </>
  )
}

export const iconStackPillClasses =
  'inline-flex h-6 w-fit shrink-0 items-center gap-1.5 rounded-full bg-surface-secondary py-0.5 pr-2 pl-0.5 font-bold text-label-value-14 text-primary transition-colors hover:bg-surface-tertiary data-[state=open]:bg-surface-tertiary'

const MAX_STACKED_ICONS = 4

/** Up to four stacked icons, the count, and a chevron when the pill opens a list. */
export function IconStackPill({
  icons,
  count,
  chevron = true,
}: {
  icons: { iconUrl: string; name: string }[]
  count: number
  chevron?: boolean
}) {
  const stacked = icons.slice(0, MAX_STACKED_ICONS)
  return (
    <>
      <span className="-space-x-1.5 flex items-center">
        {stacked.map((icon, index) => (
          <img
            key={`${icon.name}-${index}`}
            width={20}
            height={20}
            src={icon.iconUrl}
            alt=""
            className="relative size-5 min-w-5 rounded-full bg-white shadow"
            style={{ zIndex: stacked.length - index }}
          />
        ))}
      </span>
      <span className="tabular-nums leading-none">{count}</span>
      {chevron && <ChevronIcon className="size-2.5 fill-secondary" />}
    </>
  )
}

function SingleProject({
  project,
  className,
}: {
  project: ProjectIconListItem
  className?: string
}) {
  const image = (
    <img
      width={20}
      height={20}
      src={project.iconUrl}
      alt={`${project.name} logo`}
      className="size-5 min-w-5 rounded-full bg-white shadow"
    />
  )
  return (
    <Tooltip>
      {project.href ? (
        <TooltipTrigger asChild disabledOnMobile>
          <a href={project.href} className={cn('size-5', className)}>
            {image}
          </a>
        </TooltipTrigger>
      ) : (
        <TooltipTrigger className={className}>{image}</TooltipTrigger>
      )}
      <TooltipContent>
        <p className="font-bold">{project.name}</p>
        {project.description && (
          <p className="text-secondary text-xs">{project.description}</p>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

function ProjectList({
  projects,
  title,
  onSelect,
}: {
  projects: ProjectIconListItem[]
  title: string
  onSelect: () => void
}) {
  const router = useRouter()

  return (
    <Command className="rounded-[inherit]">
      <div className="flex items-center justify-between gap-2 border-divider border-b px-4 py-2.5 font-medium text-label-value-12 text-secondary">
        <span>{title}</span>
        <span className="font-bold tabular-nums">{projects.length}</span>
      </div>
      {projects.length >= MIN_SEARCHABLE_PROJECTS && (
        <CommandInput placeholder="Search..." />
      )}
      <CommandList>
        <CommandEmpty>Nothing found.</CommandEmpty>
        <CommandGroup>
          {projects.map((project) => (
            <CommandItem
              key={project.id}
              value={`${project.name} ${project.id}`}
              className="flex items-center gap-2.5 py-2"
              onSelect={() => {
                if (!project.href) return
                onSelect()
                router.push(project.href)
              }}
            >
              <img
                src={project.iconUrl}
                alt=""
                width={24}
                height={24}
                className="size-6 min-w-6 rounded-full bg-white"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-bold text-label-value-14">
                  {project.name}
                </span>
                {project.description && (
                  <span className="truncate text-label-value-12 text-secondary">
                    {project.description}
                  </span>
                )}
              </span>
              {project.stage && (
                <StageBadge
                  stage={project.stage}
                  isAppchain={false}
                  className="shrink-0"
                />
              )}
              {project.href && (
                <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary" />
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
