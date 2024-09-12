'use client'
import { cn } from '~/utils/cn'
import { Logo } from '../../logo'
import { ChartHover } from './chart-hover'
import { ChartInteractionZone } from './chart-interaction-zone'
import { ChartLabels } from './chart-labels'
import { ChartLoader } from './chart-loader'
import { ChartMilestones } from './chart-milestones'
import { ChartRenderer } from './chart-renderer'

interface Props {
  className?: string
}

export function Chart({ className }: Props) {
  return (
    <div
      className={cn('relative h-[160px] xs:h-[200px] sm:h-[260px]', className)}
      role="img"
      aria-label="chart"
    >
      <ChartRenderer />
      <ChartLabels />
      <ChartLoader />
      <ChartInteractionZone />
      <ChartHover />
      <ChartMilestones />
      <Logo
        animated={false}
        className="absolute bottom-2 right-2 z-30 h-[25px] w-[60px] opacity-20"
      />
    </div>
  )
}
