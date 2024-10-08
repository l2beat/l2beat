'use client'
import { cn } from '~/utils/cn'
import { Logo } from '../../logo'
import { ChartHover } from './chart-hover'
import { ChartInteractionZone } from './chart-interaction-zone'
import { ChartLabels } from './chart-labels'
import { ChartLoader } from './chart-loader'
import { ChartMilestones } from './chart-milestones'
import { ChartNoDataState } from './chart-no-data-state'
import { ChartRenderer } from './chart-renderer'
import { ChartTimeline } from './chart-timeline'

interface Props {
  className?: string
  disableHovers?: boolean
  disableMilestones?: boolean
}

export function Chart({ className, disableHovers, disableMilestones }: Props) {
  return (
    <div
      className={cn(
        'relative mb-5 h-[160px] select-none xs:h-[200px] sm:h-[260px]',
        className,
      )}
      role="img"
      aria-label="chart"
    >
      <ChartRenderer />
      <ChartLabels />
      <ChartLoader />
      {!disableHovers && <ChartInteractionZone />}
      {!disableHovers && <ChartHover />}
      {!disableMilestones && <ChartMilestones />}
      <ChartNoDataState />
      <Logo
        animated={false}
        className="absolute left-1/2 top-1/4 z-30 h-8 w-20 -translate-x-1/2 opacity-[0.33]"
      />
      <ChartTimeline />
    </div>
  )
}
