import { Skeleton } from '~/components/core/Skeleton'
import { InfoIcon } from '~/icons/Info'
import type { ActivityMetric } from '~/pages/scaling/activity/components/ActivityMetricContext'
import { useActivityMetricContext } from '~/pages/scaling/activity/components/ActivityMetricContext'
import { ActivityMetricControls } from '~/pages/scaling/activity/components/ActivityMetricControls'
import type { ActivityChartStats } from '~/server/features/scaling/activity/getActivityChartStats'
import { countPerSecond } from '~/server/features/scaling/activity/utils/countPerSecond'
import { cn } from '~/utils/cn'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { ChartTimeRange } from '../../core/chart/ChartTimeRange'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/Tooltip'

interface Props {
  stats: ActivityChartStats | undefined
  range: [number, number] | undefined
  hideScalingFactor?: boolean
}

export function ActivityChartHeader({
  stats,
  range,
  hideScalingFactor,
}: Props) {
  const { metric, setMetric } = useActivityMetricContext()

  const isTps = metric === 'tps'
  return (
    <header data-role="chart-header">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-start max-md:mb-2 max-md:flex-col md:items-center md:gap-2">
            <h1 className="whitespace-nowrap font-bold text-xl max-md:ml-1 md:text-2xl">
              Daily average
            </h1>
            <div className="flex items-center gap-2">
              <ActivityMetricControls
                value={metric}
                onValueChange={setMetric}
                className="h-9"
              />
              <SwitchInfoTooltip />
            </div>
          </div>
          <ChartTimeRange range={range} />
        </div>
        <div className="flex flex-col items-end">
          {stats !== undefined ? (
            <p className="text-right font-bold group-data-interactivity-disabled/chart:pointer-events-none group-data-interactivity-disabled/chart:opacity-0">
              <span className="text-xl md:text-2xl">
                {`${formatActivityCount(countPerSecond(stats[metric].latestProjectsTxCount))} ${isTps ? 'TPS' : 'UOPS'}`}
              </span>
            </p>
          ) : (
            <Skeleton className="my-[5px] h-5 w-28 md:my-1.5 md:h-6 md:w-[200px] lg:w-[243px]" />
          )}
          {hideScalingFactor ? null : stats !== undefined ? (
            <div className="flex items-center gap-1.5 text-right text-secondary group-data-interactivity-disabled/chart:pointer-events-none group-data-interactivity-disabled/chart:opacity-0 lg:w-auto">
              <div>
                <span className="max-md:hidden">Scaling factor: </span>
                {stats[metric].scalingFactor.toFixed(2)}x
              </div>
              <ScalingFactorTooltip metric={metric} />
            </div>
          ) : (
            <Skeleton className="h-5 w-16 md:h-6 md:w-44" />
          )}
        </div>
      </div>
    </header>
  )
}

function SwitchInfoTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <InfoIcon className="size-3.5 fill-blue-700" />
      </TooltipTrigger>
      <TooltipContent>
        User Operations Per Second (UOPS) takes into account the user
        operations, including regular transactions and actions bundled into a
        single transaction. Transactions Per Second (TPS) takes into account the
        regular transactions only.
      </TooltipContent>
    </Tooltip>
  )
}

export function ScalingFactorTooltip({
  className,
  metric = 'uops',
}: {
  className?: string
  metric?: ActivityMetric
}) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <InfoIcon className={cn('size-3.5 fill-current', className)} />
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-2">
          <div className="font-bold">What is scaling factor?</div>

          <div>
            {`How many more ${metric === 'tps' ? 'transactions' : 'operations'} are settled by Ethereum if we take into
            account projects listed below.`}
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-xs">Exact formula:</div>
            <div className="text-xs">
              {`(project ${metric}/7d + ETH ${metric}/7d) / ETH ${metric}/7d`}
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
