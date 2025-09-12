import type { Milestone } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { useEffect, useMemo, useState } from 'react'
import { CustomLink } from '~/components/link/CustomLink'
import { useEventListener } from '~/hooks/useEventListener'
import { useIsMobile } from '~/hooks/useIsMobile'
import { ChevronIcon } from '~/icons/Chevron'
import { IncidentIcon } from '~/icons/Incident'
import { MilestoneIcon } from '~/icons/Milestone'
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

type TimestampedMilestone = {
  timestamp: number
  milestone: Milestone | undefined
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

  if (!timestampedMilestones || width === undefined) return null

  const sortedMilestones = [...milestones].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  return (
    <div data-role="milestones">
      {timestampedMilestones?.map((data, index) => {
        if (!data.milestone) return null
        const x = index / (timestampedMilestones.length - 1)
        const milestoneIndex = sortedMilestones.findIndex(
          (m) => m.date === data.milestone?.date,
        )

        return (
          <ChartMilestone
            key={data.milestone.date}
            left={x * width - 10}
            milestoneIndex={milestoneIndex}
            allMilestones={sortedMilestones}
          />
        )
      })}
    </div>
  )
}

function ChartMilestone({
  left,
  milestoneIndex,
  allMilestones,
}: {
  left: number
  milestoneIndex: number
  allMilestones: Milestone[]
}) {
  const isMobile = useIsMobile()
  const triggerMilestone = allMilestones[milestoneIndex]
  assert(triggerMilestone)
  const { interactiveLegend } = useChart()
  const { hasFinishedOnboardingInitial } = useChartLegendOnboarding()

  const Icon =
    triggerMilestone.type === 'general' ? MilestoneIcon : IncidentIcon

  const common = cn(
    'absolute bottom-5 group-has-[.recharts-legend-wrapper]:bottom-[34px]',
    !hasFinishedOnboardingInitial &&
      interactiveLegend &&
      !interactiveLegend.disableOnboarding &&
      'group-has-[.recharts-legend-wrapper]:bottom-[46px]',
  )
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Icon className={cn(common, 'scale-75')} style={{ left }} />
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

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <a
          className={common}
          href={triggerMilestone.url}
          style={{ left }}
          target="_blank"
          rel="noreferrer"
        >
          <Icon />
        </a>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <div className="mb-1 whitespace-nowrap">
          {formatDate(triggerMilestone.date.slice(0, 10))}
        </div>
        <div className="flex max-w-[216px] font-bold">
          <Icon className="mt-px size-3.5 shrink-0" />
          <span className="ml-1.5 text-left">{triggerMilestone.title}</span>
        </div>
        {triggerMilestone.description && (
          <div className="mt-2 max-w-[216px] text-left">
            {triggerMilestone.description}
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

export function MilestoneDrawerContent({
  milestoneIndex,
  allMilestones,
}: {
  milestoneIndex: number
  allMilestones: (Milestone & { projectName?: string })[]
}) {
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] =
    useState<number>(milestoneIndex)
  const tooltipMilestone = allMilestones[selectedMilestoneIndex]
  assert(tooltipMilestone)

  const Icon =
    tooltipMilestone.type === 'general' ? MilestoneIcon : IncidentIcon

  return (
    <>
      <DrawerHeader>
        <DialogTitle className="flex gap-1.5 font-bold">
          <Icon className="size-[18px] shrink-0" />
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

function getTimestampedMilestones<T extends { timestamp: number }>(
  data: T[] | undefined,
  milestones: Milestone[],
): TimestampedMilestone[] {
  const mappedMilestones = mapMilestones(milestones)
  return (
    data?.map((point) => ({
      timestamp: point.timestamp,
      milestone: mappedMilestones[point.timestamp],
    })) ?? []
  )
}

function mapMilestones(milestones: Milestone[]): Record<number, Milestone> {
  const result: Record<number, Milestone> = {}
  for (const milestone of milestones) {
    const timestamp = Math.floor(new Date(milestone.date).getTime() / 1000)
    result[timestamp] = milestone
  }
  return result
}
