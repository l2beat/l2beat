import { InfoIcon } from '~/icons/info'
import { type ActivityChartStats } from '~/server/features/scaling/activity/get-activity-chart-stats'
import { countToTps } from '~/server/features/scaling/activity/utils/count-to-tps'
import { cn } from '~/utils/cn'
import { formatTps } from '~/utils/number-format/format-tps'
import { Skeleton } from '../../core/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/tooltip'
import { ChartTimeRange } from '../core/chart-time-range'

interface Props {
  stats: ActivityChartStats | undefined
  range: [number, number] | undefined
}

export function ActivityChartHeader({ stats, range }: Props) {
  return (
    <header data-role="chart-header">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold max-md:hidden">
          Daily average transactions per second
        </h1>
        <h1 className="text-xl font-bold md:hidden">Daily average TPS</h1>
        {stats !== undefined ? (
          <p className="text-right font-bold group-data-[interactivity-disabled]/chart:pointer-events-none group-data-[interactivity-disabled]/chart:opacity-0">
            <span className="text-xl md:text-2xl">
              {formatTps(countToTps(stats.latestProjectsTxCount))} TPS
            </span>
          </p>
        ) : (
          <Skeleton className="my-[5px] h-5 w-28 md:my-1.5 md:h-6 md:w-[200px] lg:w-[243px]" />
        )}
      </div>

      <div className="flex justify-between text-xs lg:text-base">
        <ChartTimeRange range={range} />
        {stats !== undefined ? (
          <div className="flex items-center gap-1.5 text-right text-secondary group-data-[interactivity-disabled]/chart:pointer-events-none group-data-[interactivity-disabled]/chart:opacity-0 lg:w-auto">
            <div>
              <span className="max-md:hidden">Scaling factor: </span>
              {stats.scalingFactor.toFixed(2)}x
            </div>
            <ScalingFactorTooltip />
          </div>
        ) : (
          <Skeleton className="h-6 w-16 md:w-44" />
        )}
      </div>
    </header>
  )
}

export function ScalingFactorTooltip({ className }: { className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <InfoIcon className={cn('size-3.5 fill-current', className)} />
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-2">
          <div className="font-bold">What is scaling factor?</div>

          <div>
            How many more transactions are settled by Ethereum if we take into
            account projects listed below.
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xs font-bold">Exact formula:</div>
            <div className="text-xs">
              (project txs/7d + ETH txs/7d) / ETH txs/7d
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
