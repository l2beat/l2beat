'use client'
import { cn } from '~/utils/cn'
import { Logo } from '../logo'
import {
  ChartContextProvider,
  type ChartContextProviderParams,
} from './chart-context'
import { ChartHover } from './chart-hover'
import {
  ChartHoverContextProvider,
  type ChartHoverContextProviderParams,
} from './chart-hover-context'
import { ChartInteractionZone } from './chart-interaction-zone'
import { ChartLabels } from './chart-labels'
import { ChartMilestones } from './chart-milestones'
import { ChartRenderer } from './chart-renderer'

interface Props<T>
  extends ChartContextProviderParams<T>,
    ChartHoverContextProviderParams<T> {
  className?: string
}

export function Chart<T>({
  className,
  renderHoverContents,
  ...rest
}: Props<T>) {
  return (
    <ChartContextProvider {...rest}>
      <div
        className={cn(
          'relative h-[160px] sm:h-[260px] xs:h-[200px]',
          className,
        )}
        role="img"
        aria-label="chart"
      >
        <ChartRenderer />
        <ChartLabels />
        <ChartHoverContextProvider renderHoverContents={renderHoverContents}>
          <ChartInteractionZone />
          <ChartHover />
          <ChartMilestones />
        </ChartHoverContextProvider>
        <Logo
          animated={false}
          className="absolute right-2 bottom-2 z-30 h-[25px] w-[60px] opacity-20"
        />
      </div>
    </ChartContextProvider>
  )
}
