import InfoIcon from '~/icons/info.svg'
import { type TvlChartRange } from '~/server/features/scaling/tvl/utils/range'
import { Skeleton } from '../../skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/tooltip'
import { tvlRangeToReadable } from '../tvl/tvl-range-to-readable'

export function ActivityChartHeader({
  scalingFactor,
  range,
}: {
  scalingFactor: number | undefined
  range: TvlChartRange
}) {
  return (
    <header className="mb-4" data-role="chart-header">
      <div className="flex items-baseline justify-between">
        <h1 className="mb-1 text-3xl font-bold">Activity</h1>
        {scalingFactor !== undefined ? (
          <p className="text-right text-3xl font-bold group-data-[interactivity-disabled]/chart:pointer-events-none group-data-[interactivity-disabled]/chart:opacity-0">
            <span className="hidden text-sm md:inline md:text-2xl">
              Scaling factor:{' '}
            </span>
            <span>{scalingFactor.toFixed(2)}x</span>
          </p>
        ) : (
          <Skeleton className="h-[29px] w-20 md:w-[243px]" />
        )}
      </div>
      <div className="flex items-baseline justify-between text-xs md:text-base">
        <p className="hidden text-gray-500 dark:text-gray-600 md:block">
          Transactions per second
        </p>
        <div className="flex w-full items-center gap-1.5 text-right text-gray-500 group-data-[interactivity-disabled]/chart:pointer-events-none group-data-[interactivity-disabled]/chart:opacity-0 dark:text-gray-600 md:w-auto">
          {range === 'max'
            ? 'All time'
            : `Observed over the last ${tvlRangeToReadable(range)}`}
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="fill-current" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-2">
                <div>
                  How many more transactions are settled by Ethereum if we take
                  into account projects listed below.
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-bold">Exact formula:</div>
                  <div className="text-xs">
                    {range === 'max'
                      ? '(projext txs + ETH txs) / ETX txs'
                      : `(project txs/${range} + ETH txs/${range}) / ETH txs/${range}`}
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <hr className="mt-2 w-full border-gray-200 dark:border-zinc-700 md:hidden md:border-t" />
    </header>
  )
}
