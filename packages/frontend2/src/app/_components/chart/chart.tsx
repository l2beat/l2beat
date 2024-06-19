'use client'
import { cn } from '~/utils/cn'
import { Logo } from '../logo'
import { ChartLabels } from './chart-labels'
import {
  ChartContextProvider,
  type ChartContextProviderParams,
} from './chart-context'
import { ChartHover } from './chart-hover'
import { ChartRenderer } from './chart-renderer'
import { ChartMilestones } from './chart-milestones'

export function Chart<T>({
  className,
  ...rest
}: { className?: string } & ChartContextProviderParams<T>) {
  return (
    <ChartContextProvider {...rest}>
      <div className={cn('relative', className)} role="img" aria-label="chart">
        <ChartRenderer />
        <ChartHover />
        <ChartLabels />
        <ChartMilestones />
        <Logo className="absolute right-2 bottom-2 z-30 h-[25px] w-[60px] opacity-20" />
      </div>
    </ChartContextProvider>
  )
}
