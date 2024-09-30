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

interface Props {
  className?: string
  logo?: {
    position?: 'bottom-right' | 'center'
    className?: string
  }
  hideBottomLabel?: boolean
  disableHovers?: boolean
  disableMilestones?: boolean
}

export function Chart({
  className,
  logo,
  disableHovers,
  disableMilestones,
  hideBottomLabel,
}: Props) {
  return (
    <div
      className={cn('relative h-[160px] xs:h-[200px] sm:h-[260px]', className)}
      role="img"
      aria-label="chart"
    >
      <ChartRenderer />
      <ChartLabels hideBottomLabel={hideBottomLabel} />
      <ChartLoader />
      {!disableHovers && <ChartInteractionZone />}
      {!disableHovers && <ChartHover />}
      {!disableMilestones && <ChartMilestones />}
      <ChartNoDataState />
      <Logo
        animated={false}
        className={cn(
          'absolute z-30 h-[25px] w-[60px] opacity-20',
          logo?.position === 'bottom-right' || (!logo && 'bottom-2 right-2'),
          logo?.position === 'center' && 'left-1/2 top-1/4 -translate-x-1/2',
          logo?.className,
        )}
      />
    </div>
  )
}
