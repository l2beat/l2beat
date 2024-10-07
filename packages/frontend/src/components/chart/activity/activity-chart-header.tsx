import { InfoIcon } from '~/icons/info'
import { Skeleton } from '../../core/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/tooltip'
import { ChartTimeRange } from '../core/chart-time-range'

interface Props {
  scalingFactor: number | undefined
  range: [number, number] | undefined
}

export function ActivityChartHeader({ scalingFactor, range }: Props) {
  return (
    <header data-role="chart-header">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold max-md:hidden">
          Daily average transactions per second
        </h1>
        <h1 className="text-xl font-bold md:hidden">Daily average TPS</h1>
        {scalingFactor !== undefined ? (
          <p className="text-right font-bold group-data-[interactivity-disabled]/chart:pointer-events-none group-data-[interactivity-disabled]/chart:opacity-0">
            <span className="text-base max-md:hidden md:text-lg">
              Scaling factor:{' '}
            </span>
            <span className="text-xl md:text-2xl">
              {scalingFactor.toFixed(2)}x
            </span>
            <ScalingFactorTooltip className="ml-1 md:hidden" />
          </p>
        ) : (
          <Skeleton className="h-[30px] w-20 md:h-9 md:w-[200px] lg:w-[243px]" />
        )}
      </div>

      <div className="flex justify-between text-xs lg:text-base">
        <ChartTimeRange range={range} />
        <div className="flex items-center gap-1.5 text-right text-secondary group-data-[interactivity-disabled]/chart:pointer-events-none group-data-[interactivity-disabled]/chart:opacity-0 max-md:hidden lg:w-auto">
          Observed over the last 7 days
          <ScalingFactorTooltip />
        </div>
      </div>
    </header>
  )
}

function ScalingFactorTooltip({ className }: { className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger className={className}>
        <InfoIcon className="fill-current" />
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-2">
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
