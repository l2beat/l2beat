import type { Stage } from '@l2beat/config'
import { useCommandState } from 'cmdk'
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
import { DialogClose } from './core/Dialog'
import { Popover, PopoverContent, PopoverTrigger } from './core/Popover'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/Tooltip'

export interface ProjectIconListItem {
  id: string
  name: string
  iconUrl: string
  href?: string
  /** A line under the name, e.g. the project's category. */
  description?: string
  stage?: Stage
}

interface Props {
  projects: ProjectIconListItem[]
  /** Heads the full list, e.g. "Privacy projects on Arbitrum One". */
  title: string
  className?: string
}

export const MAX_VISIBLE_PROJECTS = 5
// Short lists are scanned faster than searched.
const MIN_SEARCHABLE_PROJECTS = 7

/**
 * Overlapping project icons, each linking to its project. When they don't
 * all fit, a "+N" button opens the full list.
 */
export function ProjectIconList({ projects, title, className }: Props) {
  if (projects.length === 0) return null

  const visible =
    projects.length > MAX_VISIBLE_PROJECTS
      ? projects.slice(0, MAX_VISIBLE_PROJECTS - 1)
      : projects
  const hiddenCount = projects.length - visible.length

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="-space-x-1.5 flex items-center">
        {visible.map((project, index) => (
          <ProjectIcon
            key={project.id}
            project={project}
            zIndex={visible.length - index}
          />
        ))}
      </div>
      {hiddenCount > 0 && (
        <FullList projects={projects} title={title} hiddenCount={hiddenCount} />
      )}
    </div>
  )
}

// The page background, cards and shaded table columns all differ, so the
// button keeps a light fill and a border on each, including inside cards.
// It matches the icons' size and takes taps from a larger invisible area.
export const overflowCountClasses =
  "relative inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full border border-divider bg-surface-primary px-1.5 font-bold text-label-value-12 text-primary tabular-nums leading-none transition-colors after:absolute after:-inset-1.5 after:content-[''] primary-card:bg-surface-primary hover:border-brand focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-1 focus-visible:outline-solid focus-visible:ring-0 data-[state=open]:border-brand md:text-label-value-12"

const iconFocusClasses =
  'rounded-full focus-visible:z-10! focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

function ProjectIcon({
  project,
  zIndex,
}: {
  project: ProjectIconListItem
  zIndex: number
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
          <a
            href={project.href}
            className={cn(
              "after:-inset-y-1.5 hover:-translate-y-0.5 relative size-5 transition-transform after:absolute after:inset-x-0 after:content-[''] hover:z-10!",
              iconFocusClasses,
            )}
            style={{ zIndex }}
          >
            {image}
          </a>
        </TooltipTrigger>
      ) : (
        <TooltipTrigger
          className={cn('relative size-5', iconFocusClasses)}
          style={{ zIndex }}
        >
          {image}
        </TooltipTrigger>
      )}
      <TooltipContent>
        <p className="font-bold text-label-value-15">{project.name}</p>
        {project.description && (
          <p className="text-label-value-13 text-secondary">
            {project.description}
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

function FullList({
  projects,
  title,
  hiddenCount,
}: {
  projects: ProjectIconListItem[]
  title: string
  hiddenCount: number
}) {
  const [open, setOpen] = useState(false)
  const { isDesktop } = useDevice()
  const label = `Show all ${projects.length}: ${title}`
  const list = (
    <ProjectList
      projects={projects}
      title={title}
      inDialog={!isDesktop}
      onSelect={() => setOpen(false)}
    />
  )

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className={overflowCountClasses} aria-label={label}>
          +{hiddenCount}
        </PopoverTrigger>
        <PopoverContent
          className="w-80 primary-card:bg-surface-primary p-0"
          align="start"
        >
          {list}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <>
      <button
        type="button"
        className={overflowCountClasses}
        aria-label={label}
        onClick={() => setOpen(true)}
      >
        +{hiddenCount}
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={title}
        // Centred, so a long list grows evenly and stays on screen.
        contentClassName="max-md:top-1/2"
      >
        {list}
      </CommandDialog>
    </>
  )
}

function ProjectList({
  projects,
  title,
  inDialog,
  onSelect,
}: {
  projects: ProjectIconListItem[]
  title: string
  inDialog: boolean
  onSelect: () => void
}) {
  const router = useRouter()
  const searchable = projects.length >= MIN_SEARCHABLE_PROJECTS

  return (
    <Command className="rounded-[inherit] primary-card:bg-surface-primary">
      {/* Title, search and rows share a 14 px left edge. */}
      <div className="border-divider border-b">
        <div
          className={cn(
            'flex items-center justify-between gap-2 px-3.5',
            searchable ? 'pt-3.5 pb-2.5' : 'py-3',
          )}
        >
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-heading-16 text-primary">
              {title}
            </span>
            <CountChip total={projects.length} />
          </span>
          {inDialog && (
            <DialogClose className="-my-2 -mr-3 static flex size-10 items-center justify-center [&_svg]:size-3.5 [&_svg]:fill-secondary hover:[&_svg]:fill-primary" />
          )}
        </div>
        {searchable && (
          <CommandInput
            placeholder={`Search ${projects.length} projects…`}
            wrapperClassName="mx-1.5 mb-2 h-9 rounded-md border border-divider bg-surface-primary px-2 focus-within:border-brand"
            // 16 px on phones, or iOS Safari zooms in on focus.
            className="h-9 py-0 font-normal text-label-value-14 max-md:text-label-value-16"
          />
        )}
      </div>
      <CommandList
        className={cn(
          inDialog && 'max-h-[min(520px,60dvh)]',
          // Lists long enough to search can scroll: fade the cut-off row and
          // let the real last row scroll clear of the fade.
          searchable &&
            'mask-[linear-gradient(to_bottom,black_calc(100%-16px),transparent)]',
        )}
      >
        <CommandEmpty>Nothing found.</CommandEmpty>
        <CommandGroup className={cn(searchable && 'pb-4')}>
          {projects.map((project) => (
            <CommandItem
              key={project.id}
              value={`${project.name} ${project.id}`}
              className={cn(
                'group flex items-center gap-2.5 rounded-md primary-card:data-[selected=true]:bg-surface-secondary',
                inDialog ? 'min-h-12 py-3' : 'py-2',
                // Touch has no keyboard cursor, so the first row is not marked.
                inDialog &&
                  'active:bg-surface-secondary data-[selected=true]:bg-transparent primary-card:data-[selected=true]:bg-transparent',
              )}
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
                <span className="truncate font-semibold text-label-value-14">
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
                <ChevronIcon
                  className={cn(
                    '-rotate-90 size-2.5 shrink-0 fill-secondary',
                    // Pointers see the arrow on the row they are on.
                    !inDialog &&
                      'opacity-0 group-data-[selected=true]:opacity-100',
                  )}
                />
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

/** The list's size, or how many match while searching. */
function CountChip({ total }: { total: number }) {
  const matching = useCommandState((state) => state.filtered.count)
  const searching = useCommandState((state) => state.search !== '')
  return (
    <span className="inline-flex h-5 shrink-0 items-center rounded-full bg-surface-secondary px-1.5 font-bold text-label-value-12 text-secondary tabular-nums">
      {searching ? `${matching} / ${total}` : total}
    </span>
  )
}
