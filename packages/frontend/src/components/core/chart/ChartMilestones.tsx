import type { Milestone } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { useEffect, useMemo, useState } from 'react'
import { CustomLink } from '~/components/link/CustomLink'
import { useDevice } from '~/hooks/useDevice'
import { useEventListener } from '~/hooks/useEventListener'
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

type ChartMilestoneData = Milestone & {
  projectIcon?: string
}

interface Props<T extends { timestamp: number }> {
  data: T[] | undefined
  milestones: ChartMilestoneData[]
  ref: React.RefObject<HTMLDivElement | null>
}

export function ChartMilestones<T extends { timestamp: number }>({
  data,
  milestones,
  ref,
}: Props<T>) {
  const [width, setWidth] = useState<number>()

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

  const milestonesWithPositions = useMemo(() => {
    if (!data || data.length < 2) return []

    return sortedMilestones
      .map((milestone) => {
        const milestoneTimestamp = new Date(milestone.date).getTime() / 1000

        // Find closest data point index
        let closestIndex = 0
        const firstPoint = data[0]
        if (!firstPoint) return null

        let minDiff = Math.abs(firstPoint.timestamp - milestoneTimestamp)

        for (let i = 1; i < data.length; i++) {
          const point = data[i]
          if (!point) continue

          const diff = Math.abs(point.timestamp - milestoneTimestamp)
          if (diff < minDiff) {
            minDiff = diff
            closestIndex = i
          }
        }

        // Only show milestones that are within the range of data
        const lastPoint = data[data.length - 1]
        if (!lastPoint) return null

        const firstTimestamp = firstPoint.timestamp
        const lastTimestamp = lastPoint.timestamp
        if (
          milestoneTimestamp < firstTimestamp ||
          milestoneTimestamp > lastTimestamp
        ) {
          return null
        }

        return {
          milestone,
          left: (closestIndex / (data.length - 1)) * 100,
        }
      })
      .filter((m) => m !== null)
  }, [data, sortedMilestones])

  if (width === undefined) return null

  return (
    <div data-role="milestones">
      {milestonesWithPositions.map((m) => {
        const milestoneIndex = sortedMilestones.findIndex(
          (sm) => sm.date === m.milestone.date,
        )

        return (
          <ChartMilestone
            key={m.milestone.date}
            left={(m.left / 100) * width - 10}
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
  allMilestones: ChartMilestoneData[]
}) {
  const { isDesktop } = useDevice()
  const triggerMilestone = allMilestones[milestoneIndex]
  assert(triggerMilestone)
  const { interactiveLegend } = useChart()
  const { hasFinishedOnboardingInitial } = useChartLegendOnboarding()

  const Icon = triggerMilestone.projectIcon ? (
    <img src={triggerMilestone.projectIcon} className="size-5 rounded-full" />
  ) : triggerMilestone.type === 'general' ? (
    <MilestoneIcon />
  ) : (
    <IncidentIcon />
  )

  const common = cn(
    'absolute bottom-5 group-has-[.recharts-legend-wrapper]:bottom-[34px]',
    !hasFinishedOnboardingInitial &&
      interactiveLegend &&
      !interactiveLegend.disableOnboarding &&
      'group-has-[.recharts-legend-wrapper]:bottom-[46px]',
  )
  if (isDesktop) {
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
            {Icon}
          </a>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="mb-1 whitespace-nowrap">
            {formatDate(triggerMilestone.date.slice(0, 10))}
          </div>
          <div className="flex max-w-[216px] font-bold">
            {triggerMilestone.projectIcon ? (
              <img
                src={triggerMilestone.projectIcon}
                className="mt-px size-3.5 shrink-0 rounded-full"
              />
            ) : triggerMilestone.type === 'general' ? (
              <MilestoneIcon className="mt-px size-3.5 shrink-0" />
            ) : (
              <IncidentIcon className="mt-px size-3.5 shrink-0" />
            )}
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

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className={cn(common, 'scale-75 cursor-pointer')} style={{ left }}>
          {Icon}
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

export function MilestoneDrawerContent({
  milestoneIndex,
  allMilestones,
}: {
  milestoneIndex: number
  allMilestones: (ChartMilestoneData & { projectName?: string })[]
}) {
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] =
    useState<number>(milestoneIndex)
  const tooltipMilestone = allMilestones[selectedMilestoneIndex]
  assert(tooltipMilestone)

  const Icon = tooltipMilestone.projectIcon ? (
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
