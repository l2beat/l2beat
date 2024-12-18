import { type ActivityMetric } from '~/app/(side-nav)/scaling/activity/_components/activity-metric-context'
import { countPerSecond } from '~/server/features/scaling/activity/utils/count-per-second'
import { formatTimestamp } from '~/utils/dates'
import { getFirstTwoNonZeroPrecision } from '~/utils/get-first-two-non-zero-precision'
import { formatActivityCount } from '~/utils/number-format/format-activity-count'
import { formatInteger } from '~/utils/number-format/format-integer'

interface Props {
  timestamp: number
  count: number
  ethereumCount: number
  showEthereum: boolean
  metric?: ActivityMetric
  singleProject?: boolean
  syncedUntil?: number
}

export function ActivityChartHover(props: Props) {
  const decimals =
    props.count < 1 ? getFirstTwoNonZeroPrecision(props.count) : 2
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
            {`Average ${props.metric === 'tps' ? 'TPS' : 'UOPS'}`}
          </span>
        </div>
      </div>
      <hr className="my-1 w-full border-gray-200 dark:border-gray-650 md:border-t" />
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <div className="relative -top-px inline-block size-2 rounded-full border-2 border-current bg-red-300"></div>
          <span>{props.singleProject ? 'Project' : 'Projects'}</span>
        </div>
        <span className="whitespace-nowrap font-bold tabular-nums">
          {props.syncedUntil && props.syncedUntil < props.timestamp
            ? 'Not synced'
            : formatActivityCount(countPerSecond(props.count), {
                decimals,
              })}
        </span>
      </div>

      {props.showEthereum && (
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <div className="relative -top-px inline-block size-2 border-2 border-current bg-blue-600"></div>
            <span>Ethereum</span>
          </div>
          <span className="whitespace-nowrap font-bold tabular-nums">
            {formatActivityCount(countPerSecond(props.ethereumCount), {
              decimals,
            })}
          </span>
        </div>
      )}

      <div className="mt-2 flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-50 ">
            {props.metric === 'tps' ? 'Transactions count' : 'Operations count'}
          </span>
        </div>
      </div>
      <hr className="my-1 w-full border-gray-200 dark:border-gray-650 md:border-t" />
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <div className="relative -top-px inline-block size-2 rounded-full border-2 border-current bg-red-300"></div>
          <span>{props.singleProject ? 'Project' : 'Projects'}</span>
        </div>
        <span className="whitespace-nowrap font-bold tabular-nums">
          {props.syncedUntil && props.syncedUntil < props.timestamp
            ? 'Not synced'
            : formatInteger(props.count)}
        </span>
      </div>

      {props.showEthereum && (
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <div className="relative -top-px inline-block size-2 border-2 border-current bg-blue-600"></div>
            <span>Ethereum</span>
          </div>
          <span className="whitespace-nowrap font-bold tabular-nums">
            {formatInteger(props.ethereumCount)}
          </span>
        </div>
      )}
    </div>
  )
}
