import { useMemo, useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandInputActionButton,
  CommandItem,
  CommandList,
} from '~/components/core/Command'
import { CheckIcon } from '~/icons/Check'
import { CloseIcon } from '~/icons/Close'
import { PlusIcon } from '~/icons/Plus'
import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import { cn } from '~/utils/cn'
import type { CompareMetric } from '../metrics/types'
import { MAX_COMPARE_PROJECTS } from '../utils/compareChartState'
import { useCompareSeries } from './CompareSeriesContext'

interface Props {
  allProjects: CompareProjectEntry[]
  /**
   * The effective selection shown on the chart: the explicit URL selection,
   * or the top-N defaults when nothing is selected. Editing it always emits
   * the full explicit slug list, so the first edit materializes the defaults
   * into the URL.
   */
  selectedProjects: CompareProjectEntry[]
  /** True when the chips show the top-N defaults instead of a user selection. */
  isDefaultSelection: boolean
  /** The active metric, marking projects it has no data for. */
  metric: CompareMetric
  onChange: (slugs: string[]) => void
  className?: string
}

export function CompareProjectPicker({
  allProjects,
  selectedProjects,
  isDefaultSelection,
  metric,
  onChange,
  className,
}: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { colors, setHoveredProjectId } = useCompareSeries()
  // Selection snapshotted when the dialog opens. Sorting by the snapshot
  // instead of the live selection keeps rows from jumping under the pointer
  // while toggling; the fresh order applies on the next open.
  const [pinnedSlugs, setPinnedSlugs] = useState<string[]>([])

  const selectedSlugs = selectedProjects.map((project) => project.slug)
  const atCap = selectedSlugs.length >= MAX_COMPARE_PROJECTS
  const isAvailable = (project: CompareProjectEntry) =>
    metric.isProjectAvailable?.(project) ?? true

  const filteredProjects = useMemo(() => {
    const pinned = new Set(pinnedSlugs)
    const sorted = [...allProjects].sort(
      (a, b) =>
        Number(pinned.has(b.slug)) - Number(pinned.has(a.slug)) ||
        // Projects the metric has no data for sink below the available ones.
        Number(metric.isProjectAvailable?.(b) ?? true) -
          Number(metric.isProjectAvailable?.(a) ?? true),
    )
    const query = search.trim().toLowerCase()
    if (!query) return sorted
    return sorted.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.shortName?.toLowerCase().includes(query),
    )
  }, [allProjects, search, pinnedSlugs, metric])

  const toggleProject = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      onChange(selectedSlugs.filter((selected) => selected !== slug))
      return
    }
    if (atCap) return
    onChange([...selectedSlugs, slug])
  }

  const onOpenChange = (open: boolean) => {
    setOpen(open)
    // Clear after the dialog's close animation so the list doesn't visibly
    // reset mid-close, mirroring the search bar dialog.
    if (!open) setTimeout(() => setSearch(''), 200)
  }

  const onEscapeKeyDown = (event?: KeyboardEvent) => {
    event?.preventDefault()
    if (search !== '') {
      setSearch('')
      return
    }
    onOpenChange(false)
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {selectedProjects.map((project) => (
        // Focus and blur bubble in React, so keyboard-focusing the remove
        // button highlights the series the same way hovering the chip does.
        <div
          key={project.slug}
          onMouseEnter={() => setHoveredProjectId(project.id)}
          onMouseLeave={() => setHoveredProjectId(undefined)}
          onFocus={() => setHoveredProjectId(project.id)}
          onBlur={() => setHoveredProjectId(undefined)}
          title={isAvailable(project) ? undefined : metric.unavailableReason}
          className={cn(
            'flex h-7 items-center gap-1.5 rounded-full border border-divider bg-surface-primary primary-card:bg-surface-secondary py-1 pr-1.5 pl-1',
            !isAvailable(project) && 'border-dashed opacity-60',
          )}
          // The ring makes the chip strip double as the chart's color key, so
          // a project with no series on this metric keeps the plain border.
          style={
            isAvailable(project)
              ? { borderColor: colors[project.id] }
              : undefined
          }
        >
          <img
            src={project.iconUrl}
            alt=""
            width={18}
            height={18}
            className="size-[18px] rounded-full"
          />
          <span className="font-medium text-sm leading-none">
            {project.shortName ?? project.name}
          </span>
          <button
            type="button"
            aria-label={`Remove ${project.name}`}
            onClick={() => toggleProject(project.slug)}
            className="flex size-4 cursor-pointer items-center justify-center rounded-full hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <CloseIcon className="size-2 fill-secondary" aria-hidden />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          setPinnedSlugs(selectedSlugs)
          setOpen(true)
        }}
        className="flex h-7 cursor-pointer items-center gap-1.5 rounded-full border border-divider border-dashed py-1 pr-2.5 pl-1.5 font-medium text-secondary text-sm leading-none hover:bg-surface-secondary primary-card:hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <PlusIcon className="size-4" />
        Add project
      </button>
      <span className="ml-auto whitespace-nowrap font-medium text-2xs text-secondary tabular-nums">
        {selectedSlugs.length}/{MAX_COMPARE_PROJECTS}
      </span>
      {isDefaultSelection && (
        <p className="w-full font-medium text-2xs text-secondary">
          Showing top projects by default. Add or remove projects to build your
          own comparison.
        </p>
      )}
      <CommandDialog
        title="Add projects to compare"
        description="Search for scaling projects to add to the comparison"
        open={open}
        onOpenChange={onOpenChange}
        onEscapeKeyDown={onEscapeKeyDown}
        fullScreenMobile
      >
        <Command shouldFilter={false} className="rounded-none">
          <CommandInput
            placeholder="Search projects by name"
            value={search}
            onValueChange={setSearch}
          >
            <CommandInputActionButton onClick={() => onEscapeKeyDown()}>
              {search !== '' ? 'Clear' : 'Close'}
            </CommandInputActionButton>
          </CommandInput>
          {atCap && (
            <p className="border-divider border-b px-3 py-2 text-secondary text-xs">
              You&apos;ve selected the maximum of {MAX_COMPARE_PROJECTS}{' '}
              projects. Remove one to add another.
            </p>
          )}
          <CommandList className="max-h-screen p-1.5 supports-[height:100dvh]:max-h-dvh md:h-[330px] md:max-h-[330px]">
            <CommandEmpty>No projects found.</CommandEmpty>
            {filteredProjects.map((project) => {
              const isSelected = selectedSlugs.includes(project.slug)
              const available = isAvailable(project)
              return (
                <CommandItem
                  key={project.slug}
                  value={project.slug}
                  // A selected-but-unavailable project (carried over from
                  // another metric) stays enabled so it can be removed.
                  disabled={!isSelected && (atCap || !available)}
                  onSelect={() => toggleProject(project.slug)}
                  className={cn(
                    'cursor-pointer gap-2 rounded-lg',
                    !available && 'opacity-50',
                  )}
                >
                  <CheckIcon
                    className={cn(
                      'size-4! shrink-0',
                      !isSelected && 'opacity-0',
                    )}
                  />
                  <img
                    src={project.iconUrl}
                    alt={`${project.name} logo`}
                    width={20}
                    height={20}
                    className="rounded-sm"
                  />
                  <span className="font-medium text-sm leading-none tracking-[-1%]">
                    {project.name}
                  </span>
                  {!available && (
                    <span className="ml-auto whitespace-nowrap text-2xs text-secondary">
                      {metric.unavailableReason}
                    </span>
                  )}
                </CommandItem>
              )
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
