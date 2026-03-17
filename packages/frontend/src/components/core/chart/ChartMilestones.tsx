import { assert, UnixTime } from '@l2beat/shared-pure'
import { useEffect, useMemo, useState } from 'react'
import { CustomLink } from '~/components/link/CustomLink'
import { useDevice } from '~/hooks/useDevice'
import { useEventListener } from '~/hooks/useEventListener'
import { ChevronIcon } from '~/icons/Chevron'
import { IncidentIcon } from '~/icons/Incident'
import { MilestoneIcon } from '~/icons/Milestone'
import { cn } from '~/utils/cn'
import { formatDate } from '~/utils/dates'
import type {
  Milestone,
  ProjectMilestone,
} from '../../../../../config/src/types'
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

type MilestoneWithProjectName = Milestone & {
  projectName?: string
}

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

  const sortedMilestones = useMemo(
    () =>
      [...milestones].sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      }),
    [milestones],
  )

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
            allMilestones={sortedMilestones}
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
  milestonesAtPoint: MilestoneWithProjectName[]
  allMilestones: MilestoneWithProjectName[]
}) {
  const { isDesktop } = useDevice()
  const triggerMilestone = milestonesAtPoint[0]
  assert(triggerMilestone)
  const isMerged = milestonesAtPoint.length > 1
  const { interactiveLegend } = useChart()
  const { hasFinishedOnboardingInitial } = useChartLegendOnboarding()
  const milestoneIndex = isMerged
    ? 0
    : allMilestones.findIndex((milestone) => milestone === triggerMilestone)
  const drawerMilestones = isMerged ? milestonesAtPoint : allMilestones
  const countLabel = getCountLabel(milestonesAtPoint.length)
  assert(milestoneIndex !== -1)

  const common = cn(
    'absolute bottom-5 flex items-center justify-center group-has-[.recharts-legend-wrapper]:bottom-[34px]',
    !hasFinishedOnboardingInitial &&
      interactiveLegend &&
      !interactiveLegend.disableOnboarding &&
      'group-has-[.recharts-legend-wrapper]:bottom-[46px]',
  )
  if (isDesktop) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {isMerged ? (
            <div className={cn(common, 'cursor-pointer')} style={{ left }}>
              <MilestoneMarker
                milestones={milestonesAtPoint}
                countLabel={countLabel}
              />
            </div>
          ) : (
            <a
              className={common}
              href={triggerMilestone.url}
              style={{ left }}
              target="_blank"
              rel="noreferrer"
            >
              <MilestoneMarker
                milestones={milestonesAtPoint}
                countLabel={countLabel}
              />
            </a>
          )}
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
          <MilestoneMarker
            milestones={milestonesAtPoint}
            countLabel={countLabel}
          />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <MilestoneDrawerContent
          milestoneIndex={milestoneIndex}
          allMilestones={drawerMilestones}
        />
      </DrawerContent>
    </Drawer>
  )
}

function MilestoneMarker({
  milestones,
  countLabel,
}: {
  milestones: MilestoneWithProjectName[]
  countLabel: string
}) {
  if (milestones.length > 1) {
    return (
      <div className="flex size-5 items-center justify-center rounded-full bg-brand font-bold text-[10px] text-primary-invert">
        {countLabel}
      </div>
    )
  }

  const milestone = milestones[0]
  assert(milestone)

  if (isProjectMilestone(milestone)) {
    return <img src={milestone.projectIcon} className="size-5 rounded-full" />
  }

  return milestone.type === 'general' ? <MilestoneIcon /> : <IncidentIcon />
}

function MilestoneTooltipContent({
  milestones,
}: {
  milestones: MilestoneWithProjectName[]
}) {
  const firstMilestone = milestones[0]
  assert(firstMilestone)

  return (
    <>
      <div className="mb-1 whitespace-nowrap">
        {formatDate(firstMilestone.date.slice(0, 10))}
      </div>
      <div className="flex max-w-[216px] flex-col gap-2 text-left">
        {milestones.map((milestone) => (
          <div key={`${milestone.date}-${milestone.title}`}>
            <div className="flex font-bold">
              <MilestoneListIcon milestone={milestone} />
              <span className="ml-1.5">{milestone.title}</span>
            </div>
            {milestone.description && (
              <div className="mt-1 max-w-[216px]">{milestone.description}</div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

function MilestoneListIcon({
  milestone,
}: {
  milestone: MilestoneWithProjectName
}) {
  if (isProjectMilestone(milestone)) {
    return (
      <img
        src={milestone.projectIcon}
        className="mt-px size-3.5 shrink-0 rounded-full"
      />
    )
  }

  return milestone.type === 'general' ? (
    <MilestoneIcon className="mt-px size-3.5 shrink-0" />
  ) : (
    <IncidentIcon className="mt-px size-3.5 shrink-0" />
  )
}

export function MilestoneDrawerContent({
  milestoneIndex,
  allMilestones,
}: {
  milestoneIndex: number
  allMilestones: MilestoneWithProjectName[]
}) {
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] =
    useState<number>(milestoneIndex)
  const tooltipMilestone = allMilestones[selectedMilestoneIndex]
  assert(tooltipMilestone)

  const Icon = isProjectMilestone(tooltipMilestone) ? (
    <img
      src={tooltipMilestone.projectIcon}
      className="size-[18px] shrink-0 rounded-full"
    />
  ) : tooltipMilestone.type === 'general' ? (
    <MilestoneIcon className="size-[18px] shrink-0" />
  ) : (
    <IncidentIcon className="size-[18px] shrink-0" />
  )

  return (
    <>
      <DrawerHeader>
        <DialogTitle className="flex gap-1.5 font-bold">
          {Icon}
          <span>{tooltipMilestone.title}</span>
        </DialogTitle>
        <p className="ml-6 text-secondary text-xs">
          {formatDate(tooltipMilestone.date.slice(0, 10))}
          {tooltipMilestone.projectName
            ? ` • ${tooltipMilestone.projectName}`
            : ''}
        </p>
        {tooltipMilestone.description && (
          <p className="text-sm leading-[140%]">
            {tooltipMilestone.description}
          </p>
        )}
        <CustomLink href={tooltipMilestone.url} className="mt-2">
          Learn more
        </CustomLink>
      </DrawerHeader>
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
    </>
  )
}

function isProjectMilestone(
  milestone: MilestoneWithProjectName,
): milestone is ProjectMilestone {
  return milestone.type === 'project'
}

type TimestampedMilestone = {
  timestamp: number
  milestones: Milestone[]
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

function getCountLabel(count: number) {
  return count > 9 ? '9+' : count.toString()
}
