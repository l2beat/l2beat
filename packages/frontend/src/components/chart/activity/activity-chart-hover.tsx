import { assertUnreachable } from '@l2beat/shared-pure'
import { type ActivityMetric } from '~/app/(side-nav)/scaling/activity/_components/activity-metric-context'
import { countPerSecond } from '~/server/features/scaling/activity/utils/count-per-second'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { formatActivityCount } from '~/utils/number-format/format-activity-count'
import { formatInteger } from '~/utils/number-format/format-integer'
import { type ActivityChartType } from './use-activity-chart-render-params'

interface Props {
  timestamp: number
  count: number
  ethereumCount: number
  showEthereum: boolean
  metric?: ActivityMetric
  singleProject?: boolean
  syncedUntil?: number
  type?: ActivityChartType
}

export function ActivityChartHover(props: Props) {
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
          <div
            className={cn(
              'relative inline-block size-3 rounded-full',
              getColorByType(props.type),
            )}
          ></div>
          <span>{props.singleProject ? 'Project' : 'Projects'}</span>
        </div>
        <span className="whitespace-nowrap font-bold tabular-nums">
          {props.syncedUntil && props.syncedUntil < props.timestamp
            ? 'Not synced'
            : formatActivityCount(countPerSecond(props.count), {
                morePrecision: !!props.singleProject,
              })}
        </span>
      </div>

      {props.showEthereum && (
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <div className="relative inline-block size-3 rounded bg-indicator-ethereum"></div>
            <span>Ethereum</span>
          </div>
          <span className="whitespace-nowrap font-bold tabular-nums">
            {formatActivityCount(countPerSecond(props.ethereumCount), {
              morePrecision: !!props.singleProject,
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
          <div
            className={cn(
              'relative inline-block size-3 rounded-full',
              getColorByType(props.type),
            )}
          ></div>
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
            <div className="relative inline-block size-3 rounded bg-indicator-ethereum"></div>
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

function getColorByType(type?: ActivityChartType) {
  switch (type) {
    case 'Rollups':
      return 'bg-indicator-rollups'
    case 'ValidiumsAndOptimiums':
      return 'bg-indicator-validiums-optimiums'
    case 'Others':
    case undefined:
      return 'bg-indicator-others'
    default:
      assertUnreachable(type)
  }
}
