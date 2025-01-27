import { countPerSecond } from '~/server/features/scaling/activity/utils/count-per-second'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { formatActivityCount } from '~/utils/number-format/format-activity-count'
import { formatInteger } from '~/utils/number-format/format-integer'

interface Props {
  timestamp: number
  rollupsCount: number
  validiumAndOptimiumsCount: number
  othersCount: number
  ethereumCount: number
  syncedUntil?: number
}

export function RecategorisedActivityChartHover(props: Props) {
  const values = [
    {
      title: 'Rollups',
      value: props.rollupsCount,
      className: 'bg-indicator-rollups',
    },
    {
      title: 'Validiums and Optimiums',
      value: props.validiumAndOptimiumsCount,
      className: 'bg-indicator-validiums-optimiums',
    },
    {
      title: 'Others',
      value: props.othersCount,
      className: 'bg-indicator-others',
    },
    {
      title: 'Ethereum',
      value: props.ethereumCount,
      className: 'bg-indicator-ethereum',
    },
  ]

  return (
    <div className="w-40 sm:w-60">
      <div className="mb-1.5 whitespace-nowrap">
        {formatTimestamp(props.timestamp, {
          mode: 'date',
          longMonthName: true,
        })}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-50 ">
            Average UOPS
          </span>
        </div>
      </div>
      <hr className="dark:border-gray-650 my-1 w-full border-gray-200 md:border-t" />
      {values.map((v) => (
        <div
          key={v.title}
          className="flex w-full items-start justify-between gap-2"
        >
          <div className="flex items-start gap-1">
            <div
              className={cn(
                'relative mt-0.5 inline-block size-3 rounded-sm sm:mt-1',
                v.className,
              )}
            ></div>
            <span className="w-20 sm:w-fit">{v.title}</span>
          </div>
          <span className="whitespace-nowrap font-bold tabular-nums">
            {props.syncedUntil && props.syncedUntil < props.timestamp
              ? 'Not synced'
              : formatActivityCount(countPerSecond(v.value))}
          </span>
        </div>
      ))}

      <div className="mt-2 flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-50 ">
            Operations count
          </span>
        </div>
      </div>
      <hr className="dark:border-gray-650 my-1 w-full border-gray-200 md:border-t" />
      {values.map((v) => (
        <div
          key={v.title}
          className="flex w-full items-start justify-between gap-2"
        >
          <div className="flex items-start gap-1">
            <div
              className={cn(
                'relative mt-0.5 inline-block size-3 rounded-sm sm:mt-1',
                v.className,
              )}
            ></div>
            <span className="w-20 sm:w-fit">{v.title}</span>
          </div>
          <span className="whitespace-nowrap font-bold tabular-nums">
            {props.syncedUntil && props.syncedUntil < props.timestamp
              ? 'Not synced'
              : formatInteger(v.value)}
          </span>
        </div>
      ))}
    </div>
  )
}
