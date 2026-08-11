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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CheckIcon } from '~/icons/Check'
import { CloseIcon } from '~/icons/Close'
import { PlusIcon } from '~/icons/Plus'
import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import { cn } from '~/utils/cn'
import type { CompareMetric } from '../metrics/types'
import { useCompareSeries } from './CompareSeriesContext'

interface Props {
  allProjects: CompareProjectEntry[]
  /**
   * The active metric, for marking projects it has no data for. The chips
   * double as the chart legend, so the "no data" note lives here (as a
   * tooltip on the dimmed chip) instead of an empty series in the chart.
   */
  metric: CompareMetric
  /**
   * The effective selection shown on the chart: the explicit URL selection,
   * or the top-N defaults when nothing is selected. Editing it always emits
   * the full explicit slug list, so the first edit materializes the defaults
   * into the URL.
   */
  selectedProjects: CompareProjectEntry[]
  /** True when the chips show the top-N defaults instead of a user selection. */
  isDefaultSelection: boolean
  onChange: (slugs: string[]) => void
  className?: string
}

export function CompareProjectPicker({
  allProjects,
  metric,
  selectedProjects,
  isDefaultSelection,
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
  const hasMetricData = metric.hasData ?? (() => true)
  const noDataLabel = metric.noDataLabel ?? 'No data'

  const filteredProjects = useMemo(() => {
    const pinned = new Set(pinnedSlugs)
    const sorted = [...allProjects].sort(
      (a, b) => Number(pinned.has(b.slug)) - Number(pinned.has(a.slug)),
    )
    const query = search.trim().toLowerCase()
    if (!query) return sorted
    return sorted.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.shortName?.toLowerCase().includes(query),
    )
  }, [allProjects, search, pinnedSlugs])

  const toggleProject = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      onChange(selectedSlugs.filter((selected) => selected !== slug))
      return
    }
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
        // The tooltip trigger is disabled when the metric has data, so the
        // "no data" explanation only appears on the dimmed chips.
        <Tooltip key={project.slug}>
          <TooltipTrigger asChild disabled={hasMetricData(project)}>
            {/* Focus and blur bubble in React, so keyboard-focusing the remove
                button highlights the series the same way hovering the chip does. */}
            <div
              onMouseEnter={() => setHoveredProjectId(project.id)}
              onMouseLeave={() => setHoveredProjectId(undefined)}
              onFocus={() => setHoveredProjectId(project.id)}
              onBlur={() => setHoveredProjectId(undefined)}
              className="flex h-7 items-center gap-1.5 rounded-full border border-divider bg-surface-primary primary-card:bg-surface-secondary py-1 pr-1.5 pl-1"
              // The ring makes the chip strip double as the chart's color key,
              // so it must show exactly the series color the chart uses - and no
              // color at all when the metric has no series for the project.
              style={
                hasMetricData(project)
                  ? { borderColor: colors[project.id] }
                  : undefined
              }
            >
              <img
                src={project.iconUrl}
                alt=""
                width={18}
                height={18}
                className={cn(
                  'size-[18px] rounded-full',
                  !hasMetricData(project) && 'opacity-50',
                )}
              />
              <span
                className={cn(
                  'font-medium text-sm leading-none',
                  !hasMetricData(project) && 'text-secondary',
                )}
              >
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
          </TooltipTrigger>
          <TooltipContent>{noDataLabel}</TooltipContent>
        </Tooltip>
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
          <CommandList className="max-h-screen p-1.5 supports-[height:100dvh]:max-h-dvh md:h-[330px] md:max-h-[330px]">
            <CommandEmpty>No projects found.</CommandEmpty>
            {filteredProjects.map((project) => {
              const isSelected = selectedSlugs.includes(project.slug)
              return (
                <CommandItem
                  key={project.slug}
                  value={project.slug}
                  onSelect={() => toggleProject(project.slug)}
                  className="cursor-pointer gap-2 rounded-lg"
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
                  {!hasMetricData(project) && (
                    <span className="ml-auto font-medium text-2xs text-secondary">
                      {noDataLabel}
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
