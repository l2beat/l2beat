import { countToTps } from '~/server/features/scaling/activity/utils/count-to-tps'
import { formatTimestamp } from '~/utils/dates'
import { formatInteger } from '~/utils/number-format/format-integer'
import { formatTps } from '~/utils/number-format/format-tps'

interface Props {
  timestamp: number
  count: number
  ethereumCount: number
  showEthereum: boolean
  singleProject?: boolean
}

export function ActivityChartHover(props: Props) {
  return (
    <div>
      <div className="mb-1.5 whitespace-nowrap">
        {formatTimestamp(props.timestamp, {
          mode: 'date',
          longMonthName: true,
        })}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-50 ">
            Average TPS
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
          {formatTps(countToTps(props.count), {
            morePrecision: !!props.singleProject,
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
            {formatTps(countToTps(props.ethereumCount), {
              morePrecision: !!props.singleProject,
            })}
          </span>
        </div>
      )}

      <div className="mt-2 flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-700 dark:text-gray-50 ">
            Transaction count
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
          {formatInteger(props.count)}
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
