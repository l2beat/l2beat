import { formatCostValue } from '~/app/(side-nav)/scaling/costs/_utils/format-cost-value'
import { type CostsUnit } from '~/server/features/scaling/costs/types'
import { formatTimestamp } from '~/utils/dates'
import { HorizontalSeparator } from '../../core/horizontal-separator'
import { Square } from '../../square'

export interface CostsChartPointData {
  timestamp: number
  total: number
  calldata: number
  blobs: number | undefined
  compute: number
  overhead: number
}

export function CostsChartHover({
  data,
  unit,
}: { data: CostsChartPointData; unit: CostsUnit }) {
  const showLessThanZero = data.total !== 0
  return (
    <div>
      <div className="mb-1 whitespace-nowrap">
        {formatTimestamp(data.timestamp, {
          mode: 'datetime',
        })}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-50">Total</span>
        <span className="whitespace-nowrap font-bold tabular-nums">
          {formatCostValue(data.total, unit, 'total', showLessThanZero)}
        </span>
      </div>
      <HorizontalSeparator className="my-1" />
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Square variant="calldata" />
          <span className="text-sm text-gray-700 dark:text-gray-50">
            Calldata
          </span>
        </div>
        <span className="whitespace-nowrap font-bold tabular-nums">
          {formatCostValue(data.calldata, unit, 'total', showLessThanZero)}
        </span>
      </div>
      {data.blobs ? (
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Square variant="blobs" />
            <span className="text-sm text-gray-700 dark:text-gray-50">
              Blobs
            </span>
          </div>
          <span className="whitespace-nowrap font-bold tabular-nums">
            {formatCostValue(data.blobs, unit, 'total', showLessThanZero)}
          </span>
        </div>
      ) : null}
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Square variant="compute" />
          <span className="text-sm text-gray-700 dark:text-gray-50">
            Compute
          </span>
        </div>
        <span className="whitespace-nowrap font-bold tabular-nums">
          {formatCostValue(data.compute, unit, 'total', showLessThanZero)}
        </span>
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Square variant="overhead" />
          <span className="text-sm text-gray-700 dark:text-gray-50">
            Overhead
          </span>
        </div>
        <span className="whitespace-nowrap font-bold tabular-nums">
          {formatCostValue(data.overhead, unit, 'total', showLessThanZero)}
        </span>
      </div>
    </div>
  )
}
