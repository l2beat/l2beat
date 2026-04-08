import type { Milestone } from '@l2beat/config'
import { assert, assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import { useEffect, useMemo, useState } from 'react'
import { CustomLink } from '~/components/link/CustomLink'
import { useDevice } from '~/hooks/useDevice'
import { useEventListener } from '~/hooks/useEventListener'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { ChevronIcon } from '~/icons/Chevron'
import { GeneralMilestoneIcon } from '~/icons/GeneralMilestone'
import { IncidentMilestoneIcon } from '~/icons/IncidentMilestone'
import { cn } from '~/utils/cn'
import { formatDate } from '~/utils/dates'
import { Button } from '../Button'
import { DialogTitle } from '../Dialog'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '../Drawer'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { useChart } from './Chart'
import { useChartLegendOnboarding } from './ChartLegendOnboardingContext'

interface Props<T extends { timestamp: number }> {
  data: T[] | undefined
  milestones: Milestone[]
  ref: React.RefObject<HTMLDivElement | null>
}

export function ChartMilestones<T extends { timestamp: number }>({
  data,
  milestones,
  ref,
}: Props<T>) {
  const [width, setWidth] = useState<number>()
  const timestampedMilestones = useMemo(
    () => getTimestampedMilestones(data, milestones),
    [data, milestones],
  )

  useEffect(() => {
    if (!ref.current) return
    setWidth(ref.current.getBoundingClientRect().width)
  }, [ref])

  useEventListener('resize', () => {
    if (!ref.current) return
    setWidth(ref.current.getBoundingClientRect().width)
  })

  if (width === undefined || timestampedMilestones.length < 2) return null

  return (
    <div data-role="milestones">
      {timestampedMilestones.map((data, index) => {
        if (data.milestones.length === 0) return null
        const x = index / (timestampedMilestones.length - 1)

        return (
          <ChartMilestone
            key={data.timestamp}
            left={x * width - 10}
            milestonesAtPoint={data.milestones}
            allMilestones={milestones}
          />
        )
      })}
    </div>
  )
}

function ChartMilestone({
  left,
  milestonesAtPoint,
  allMilestones,
}: {
  left: number
  milestonesAtPoint: Milestone[]
  allMilestones: Milestone[]
}) {
  const { isDesktop } = useDevice()
  const triggerMilestone = milestonesAtPoint[0]
  assert(triggerMilestone)
  const milestoneIndex = allMilestones.indexOf(triggerMilestone)
  assert(milestoneIndex !== -1)
  const { interactiveLegend } = useChart()
  const { hasFinishedOnboardingInitial } = useChartLegendOnboarding()

  const common = cn(
    'absolute bottom-5 flex items-center justify-center group-has-[.recharts-legend-wrapper]:bottom-[34px]',
    !hasFinishedOnboardingInitial &&
      interactiveLegend &&
      !interactiveLegend.disableOnboarding &&
      'group-has-[.recharts-legend-wrapper]:bottom-[46px]',
  )
  if (isDesktop) {
    return (
      <Tooltip delayDuration={0} disableHoverableContent={false}>
        <TooltipTrigger asChild>
          <div className={cn(common, 'cursor-pointer')} style={{ left }}>
            <MilestoneMarker milestones={milestonesAtPoint} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <MilestoneTooltipContent milestones={milestonesAtPoint} />
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className={cn(common, 'scale-75 cursor-pointer')} style={{ left }}>
          <MilestoneMarker milestones={milestonesAtPoint} />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <MilestoneDrawerContent
          milestoneIndex={milestoneIndex}
          allMilestones={allMilestones}
        />
      </DrawerContent>
    </Drawer>
  )
}

function MilestoneMarker({ milestones }: { milestones: Milestone[] }) {
  if (milestones.length > 1) {
    return (
      <div className="flex size-5 items-center justify-center rounded-full bg-brand font-bold text-[10px] text-primary-invert">
        {milestones.length > 9 ? '9+' : milestones.length.toString()}
      </div>
    )
  }

  const milestone = milestones[0]
  assert(milestone)
  return <SingleMilestoneIcon milestone={milestone} />
}

function MilestoneTooltipContent({ milestones }: { milestones: Milestone[] }) {
  const firstMilestone = milestones[0]
  assert(firstMilestone)

  return (
    <>
      <div className="mb-1 whitespace-nowrap">
        {formatDate(firstMilestone.date.slice(0, 10))}
      </div>
      <div className="flex max-w-[216px] flex-col gap-2 text-left">
        {milestones.map((milestone) => (
          <MilestoneTooltipItem
            key={`${milestone.date}-${milestone.title}`}
            milestone={milestone}
            milestonesOnDateCount={milestones.length}
          />
        ))}
      </div>
    </>
  )
}

function MilestoneTooltipItem({
  milestone,
  milestonesOnDateCount,
}: {
  milestone: Milestone
  milestonesOnDateCount: number
}) {
  const useArrowLink = shouldUseArrowLink(milestone, milestonesOnDateCount)
  const label = getMilestoneLinkLabel(milestone)

  return (
    <div className={cn(useArrowLink && 'flex gap-2')}>
      <div className={cn('min-w-0', useArrowLink ? 'flex-1' : 'flex flex-col')}>
        <div className="flex font-bold">
          <MilestoneListIcon milestone={milestone} />
          <span className="ml-1.5">{milestone.title}</span>
        </div>
        {milestone.description && (
          <div className="mt-1 max-w-[216px]">{milestone.description}</div>
        )}
        {!useArrowLink && (
          <CustomLink
            href={milestone.url}
            className="mt-1 ml-auto block w-fit text-[12px]"
          >
            {label}
          </CustomLink>
        )}
      </div>
      {useArrowLink && (
        <CustomLink
          href={milestone.url}
          underline={false}
          className="flex shrink-0 self-center text-[12px]"
          aria-label={label}
        >
          <ArrowRightIcon className="size-3.5" />
        </CustomLink>
      )}
    </div>
  )
}

function MilestoneListIcon({ milestone }: { milestone: Milestone }) {
  return (
    <SingleMilestoneIcon
      milestone={milestone}
      className="mt-px size-3.5 shrink-0"
    />
  )
}

export function MilestoneDrawerContent({
  milestoneIndex,
  allMilestones,
}: {
  milestoneIndex: number
  allMilestones: Milestone[]
}) {
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] =
    useState<number>(milestoneIndex)
  const tooltipMilestone = allMilestones[selectedMilestoneIndex]
  assert(tooltipMilestone)
  const hasNavigation = allMilestones.length > 1

  return (
    <>
      <DrawerHeader>
        <DialogTitle className="flex gap-1.5 font-bold">
          <SingleMilestoneIcon
            milestone={tooltipMilestone}
            className="size-[18px] shrink-0"
          />
          <span>{tooltipMilestone.title}</span>
        </DialogTitle>
        <p className="ml-6 text-secondary text-xs">
          {formatDate(tooltipMilestone.date.slice(0, 10))}
        </p>
        {tooltipMilestone.description && (
          <p className="text-sm leading-[140%]">
            {tooltipMilestone.description}
          </p>
        )}
        <CustomLink href={tooltipMilestone.url} className="mt-2">
          {getMilestoneLinkLabel(tooltipMilestone)}
        </CustomLink>
      </DrawerHeader>
      {hasNavigation && (
        <DrawerFooter className="flex flex-row items-center justify-between px-0 pt-6 pb-8">
          <Button
            size="sm"
            className="h-10 w-[120px] bg-brand px-3 text-primary-invert text-sm disabled:bg-brand/40"
            onClick={() => setSelectedMilestoneIndex((s) => s - 1)}
            aria-label="Previous milestone"
            disabled={selectedMilestoneIndex === 0}
          >
            <ChevronIcon className="mr-1 size-3 rotate-90" />
            Previous
          </Button>
          <div className="text-[13px] text-secondary">
            {selectedMilestoneIndex + 1} of {allMilestones.length}
          </div>
          <Button
            size="sm"
            className="h-10 w-[120px] bg-brand px-3 text-primary-invert text-sm disabled:bg-brand/40"
            onClick={() => setSelectedMilestoneIndex((s) => s + 1)}
            aria-label="Next milestone"
            disabled={selectedMilestoneIndex === allMilestones.length - 1}
          >
            Next
            <ChevronIcon className="-rotate-90 ml-1 size-3" />
          </Button>
        </DrawerFooter>
      )}
    </>
  )
}

type TimestampedMilestone = {
  timestamp: number
  milestones: Milestone[]
}

function ProjectMilestoneIcon({
  project,
  className,
}: {
  project: { name: string; icon: string }
  className?: string
}) {
  return (
    <img
      src={project.icon}
      alt={project.name}
      className={cn('size-5 rounded-full', className)}
    />
  )
}

function SingleMilestoneIcon({
  milestone,
  className,
}: {
  milestone: Milestone
  className?: string
}) {
  switch (milestone.type) {
    case 'project':
      return (
        <ProjectMilestoneIcon
          project={milestone.project}
          className={className}
        />
      )
    case 'general':
      return <GeneralMilestoneIcon className={className} />
    case 'incident':
      return <IncidentMilestoneIcon className={className} />
    default:
      assertUnreachable(milestone)
  }
}

function getTimestampedMilestones<T extends { timestamp: number }>(
  data: T[] | undefined,
  milestones: Milestone[],
): TimestampedMilestone[] {
  if (!data || data.length < 2) return []

  const mappedMilestones = mapMilestones(milestones)
  return data.map((point) => ({
    timestamp: point.timestamp,
    milestones: mappedMilestones[point.timestamp] ?? [],
  }))
}

function mapMilestones(milestones: Milestone[]): Record<number, Milestone[]> {
  const result: Record<number, Milestone[]> = {}

  for (const milestone of milestones) {
    const timestamp = UnixTime.toStartOf(
      UnixTime.fromDate(new Date(milestone.date)),
      'day',
    )
    result[timestamp] ??= []
    result[timestamp].push(milestone)
  }

  return result
}

function getMilestoneLinkLabel(milestone: { linkLabel?: string }) {
  return milestone.linkLabel ?? 'Learn more'
}

function shouldUseArrowLink(
  milestone: Pick<Milestone, 'type'>,
  milestonesOnDateCount: number,
) {
  return milestone.type === 'project' || milestonesOnDateCount > 1
}
