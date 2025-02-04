import { formatCostValue } from '~/app/(side-nav)/scaling/costs/_utils/format-cost-value'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { Square } from '~/components/square'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsResolution } from '~/server/features/scaling/costs/utils/range'
import { formatTimestamp } from '~/utils/dates'

export interface CostsChartPointData {
  timestamp: number
  total: number
  calldata: number
  blobs: number | undefined
  compute: number
  overhead: number
}

interface Props {
  data: CostsChartPointData
  unit: CostsUnit
  resolution: CostsResolution
}

export function CostsChartHover({ data, unit, resolution }: Props) {
  return (
    <div className="min-w-40">
      <div className="mb-1 whitespace-nowrap">
        {formatTimestamp(data.timestamp, {
          mode: resolution === 'daily' ? 'date' : 'datetime',
          longMonthName: resolution === 'daily',
        })}
      </div>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm text-gray-700 dark:text-gray-50">Total</span>
        <span className="whitespace-nowrap font-bold tabular-nums">
          {formatCostValue(data.total, unit, 'total')}
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
          {formatCostValue(data.calldata, unit, 'total')}
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
            {formatCostValue(data.blobs, unit, 'total')}
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
          {formatCostValue(data.compute, unit, 'total')}
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
          {formatCostValue(data.overhead, unit, 'total')}
        </span>
      </div>
    </div>
  )
}
