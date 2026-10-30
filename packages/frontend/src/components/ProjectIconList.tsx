import type { Stage } from '@l2beat/config'
import { useCommandState } from 'cmdk'
import { type ReactNode, useRef, useState } from 'react'
import { useDevice } from '~/hooks/useDevice'
import { useIsTouch } from '~/hooks/useIsTouch'
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
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from './core/tooltip/Tooltip'

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
 *
 * On touch a logo has no tooltip and a middle one is 14 px wide, so tapping
 * any of them opens the named list instead of guessing. A single icon still
 * links straight to its project.
 */
export function ProjectIconList({ projects, title, className }: Props) {
  const isTouch = useIsTouch()
  if (projects.length === 0) return null

  const visible =
    projects.length > MAX_VISIBLE_PROJECTS
      ? projects.slice(0, MAX_VISIBLE_PROJECTS - 1)
      : projects
  const hiddenCount = projects.length - visible.length

  if (isTouch && projects.length > 1) {
    return (
      <FullList
        projects={projects}
        title={title}
        triggerClassName={cn(touchTriggerClasses, className)}
      >
        <IconRow projects={visible} linked={false} />
        {hiddenCount > 0 ? (
          <span className={overflowCountClasses}>+{hiddenCount}</span>
        ) : (
          <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary" />
        )}
      </FullList>
    )
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <IconRow projects={visible} linked />
      {hiddenCount > 0 && (
        <FullList
          projects={projects}
          title={title}
          triggerClassName={overflowCountClasses}
        >
          +{hiddenCount}
        </FullList>
      )}
    </div>
  )
}

/**
 * White behind the logos keeps transparent ones legible in dark mode. It
 * stops 1 px short of the edge, or it shows through the edge of logos that
 * fill the circle as a thin white ring.
 */
export const iconBackdropClasses =
  'bg-[radial-gradient(closest-side,white_calc(100%-1px),transparent_calc(100%-1px))]'

// The whole stack is one button, at least 44 px tall, that does not paint
// over the card or table it sits in until pressed.
const touchTriggerClasses =
  '-mx-2 inline-flex min-h-11 items-center gap-1 rounded-md bg-transparent px-2 transition-colors focus-visible:outline-2 focus-visible:outline-brand active:bg-surface-secondary primary-card:bg-transparent'

// The page background, cards and shaded table columns all differ, so the
// button keeps a light fill and a border on each, including inside cards.
// It matches the icons' size and takes taps from a larger invisible area.
export const overflowCountClasses =
  "relative inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full border border-divider bg-surface-primary px-1.5 font-bold text-label-value-12 text-primary tabular-nums leading-none transition-colors after:absolute after:-inset-1.5 after:content-[''] primary-card:bg-surface-primary hover:border-brand focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-1 focus-visible:outline-solid focus-visible:ring-0 data-[state=open]:border-brand md:text-label-value-12"

// Each icon overlaps the previous one by its own margin rather than through
// space-x on the row, which keys on :last-child and so shifts when anything
// is added after an icon. Focus shows a ring above the neighbours.
const iconClasses =
  '-ml-1.5 first:ml-0 rounded-full focus-visible:z-10! focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

function IconRow({
  projects,
  linked,
}: {
  projects: ProjectIconListItem[]
  linked: boolean
}) {
  return (
    <span className="flex items-center">
      {projects.map((project, index) => {
        const zIndex = projects.length - index
        return linked ? (
          <ProjectIcon key={project.id} project={project} zIndex={zIndex} />
        ) : (
          <span
            key={project.id}
            className={cn('relative size-5', iconClasses)}
            style={{ zIndex }}
          >
            <IconImage project={project} />
          </span>
        )
      })}
    </span>
  )
}

function IconImage({ project }: { project: ProjectIconListItem }) {
  return (
    <img
      width={20}
      height={20}
      src={project.iconUrl}
      alt={`${project.name} logo`}
      className={cn('size-5 min-w-5 rounded-full shadow', iconBackdropClasses)}
    />
  )
}

function ProjectIcon({
  project,
  zIndex,
}: {
  project: ProjectIconListItem
  zIndex: number
}) {
  const image = <IconImage project={project} />
  return (
    // Short enough to feel instant on purpose, long enough that sweeping the
    // cursor across a table column does not flash every row's tooltip.
    <Tooltip delayDuration={100}>
      {project.href ? (
        <TooltipTrigger asChild disabledOnMobile>
          <a
            href={project.href}
            className={cn(
              "after:-inset-y-1.5 hover:-translate-y-0.5 relative size-5 transition-transform after:absolute after:inset-x-0 after:content-[''] hover:z-10!",
              iconClasses,
            )}
            style={{ zIndex }}
          >
            {image}
          </a>
        </TooltipTrigger>
      ) : (
        <TooltipTrigger
          className={cn('relative size-5', iconClasses)}
          style={{ zIndex }}
        >
          {image}
        </TooltipTrigger>
      )}
      {/* Portalled: rendered inline, the content would become a sibling of the
          icon and change the row's width while open. */}
      <TooltipPortal>
        <TooltipContent>
          <p className="font-bold text-label-value-15">{project.name}</p>
          {project.description && (
            <p className="text-label-value-13 text-secondary">
              {project.description}
            </p>
          )}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

function FullList({
  projects,
  title,
  triggerClassName,
  children,
}: {
  projects: ProjectIconListItem[]
  title: string
  triggerClassName: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const { isDesktop } = useDevice()
  const isTouch = useIsTouch()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const label = `Show all ${projects.length}: ${title}`
  const list = (
    <ProjectList
      projects={projects}
      title={title}
      inDialog={!isDesktop}
      onNavigate={() => setOpen(false)}
    />
  )
  // Focusing the search field on touch raises the keyboard over the list, so
  // focus the panel itself instead.
  const onOpenAutoFocus = isTouch
    ? (event: Event) => {
        event.preventDefault()
        if (event.currentTarget instanceof HTMLElement) {
          event.currentTarget.focus()
        }
      }
    : undefined

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={triggerClassName}
          aria-label={label}
          aria-haspopup="dialog"
        >
          {children}
        </PopoverTrigger>
        <PopoverContent
          className="w-80 primary-card:bg-surface-primary p-0"
          align="start"
          onOpenAutoFocus={onOpenAutoFocus}
        >
          {list}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={title}
        // Centred, so a long list grows evenly and stays on screen.
        contentClassName="max-md:top-1/2"
        onOpenAutoFocus={onOpenAutoFocus}
        // A tap does not focus the button, so Radix would return focus to the
        // page; send it back to the button that opened the list.
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          triggerRef.current?.focus()
        }}
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
  onNavigate,
}: {
  projects: ProjectIconListItem[]
  title: string
  inDialog: boolean
  onNavigate: () => void
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
                'group rounded-md p-0 primary-card:data-[selected=true]:bg-surface-secondary',
                // Touch has no keyboard cursor, so the first row is not marked.
                inDialog &&
                  'data-[selected=true]:bg-transparent primary-card:data-[selected=true]:bg-transparent',
                inDialog && project.href && 'active:bg-surface-secondary',
              )}
              // Enter on the keyboard cursor; clicks go through the link.
              onSelect={() => {
                if (!project.href) return
                onNavigate()
                router.push(project.href)
              }}
            >
              <ProjectRow
                project={project}
                className={cn(
                  'flex w-full items-center gap-2.5 px-2',
                  inDialog ? 'min-h-12 py-3' : 'py-2',
                )}
                onNavigate={onNavigate}
              >
                <img
                  src={project.iconUrl}
                  alt=""
                  width={24}
                  height={24}
                  className={cn(
                    'size-6 min-w-6 rounded-full',
                    iconBackdropClasses,
                  )}
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
              </ProjectRow>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

/**
 * A row with a link is a real link, so opening it in a new tab or from a
 * long press works. The plain click closes the list; modified clicks leave it
 * open for the next one.
 */
function ProjectRow({
  project,
  className,
  onNavigate,
  children,
}: {
  project: ProjectIconListItem
  className: string
  onNavigate: () => void
  children: ReactNode
}) {
  if (!project.href) {
    return <div className={className}>{children}</div>
  }
  return (
    <a
      href={project.href}
      className={className}
      // cmdk also selects the item on click; the link already navigates.
      onClick={(event) => {
        event.stopPropagation()
        const modified =
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
        if (!modified) onNavigate()
      }}
    >
      {children}
    </a>
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
