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

export function RecategorizedActivityChartHover(props: Props) {
  const values = [
    {
      title: 'Rollups',
      value: props.rollupsCount,
      className: 'bg-n-pink-400',
    },
    {
      title: 'Validiums and Optimiums',
      value: props.validiumAndOptimiumsCount,
      className: 'bg-n-cyan-600',
    },
    {
      title: 'Others',
      value: props.othersCount,
      className: 'bg-n-yellow-700',
    },
    {
      title: 'Ethereum',
      value: props.ethereumCount,
      className: 'bg-blue-600',
    },
  ]

  return (
    <div className="min-w-36">
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
      <hr className="my-1 w-full border-gray-200 dark:border-gray-650 md:border-t" />
      {values.map((v) => (
        <div
          key={v.title}
          className="flex w-full items-center justify-between gap-2"
        >
          <div className="flex items-center gap-1">
            <div
              className={cn(
                'relative inline-block size-3 rounded',
                v.className,
              )}
            ></div>
            <span>{v.title}</span>
          </div>
          <span className="whitespace-nowrap font-bold tabular-nums">
            {props.syncedUntil && props.syncedUntil < props.timestamp
              ? 'Not synced'
              : formatActivityCount(countPerSecond(v.value), {
                  morePrecision: false,
                })}
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
      <hr className="my-1 w-full border-gray-200 dark:border-gray-650 md:border-t" />
      {values.map((v) => (
        <div
          key={v.title}
          className="flex w-full items-center justify-between gap-2"
        >
          <div className="flex items-center gap-1">
            <div
              className={cn(
                'relative inline-block size-3 rounded',
                v.className,
              )}
            ></div>
            <span>{v.title}</span>
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
