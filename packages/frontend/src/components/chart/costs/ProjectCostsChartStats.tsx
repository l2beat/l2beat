import { assertUnreachable } from '@l2beat/shared-pure'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { formatCostValue } from '~/pages/scaling/costs/utils/formatCostValue'
import type { ProjectCostsChartResponse } from '~/server/features/scaling/costs/getProjectCostsChart'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { rangeToLabel } from '~/utils/project/rangeToLabel'

export function ProjectCostsChartStats({
  range,
  unit,
  isLoading,
  data,
}: {
  range: CostsTimeRange
  unit: CostsUnit
  isLoading: boolean
  data: ProjectCostsChartResponse | undefined
}) {
  return (
    <ChartStats className="mt-4 lg:grid-cols-3">
      <ChartStatsItem
        label={
          range === 'max'
            ? `Total ${unitToLabel(unit)}`
            : `${rangeToLabel(range)} total ${unitToLabel(unit)}`
        }
        className="max-md:h-7"
        tooltip="The total cost for the selected time period that the project paid to Ethereum. This includes the costs for calldata, computation, blobs, and overhead."
        isLoading={isLoading}
      >
        {data?.stats?.total[unit]
          ? formatCostValue(data?.stats.total[unit], unit, 'total')
          : undefined}
      </ChartStatsItem>
      <ChartStatsItem
        label={`Avg ${unitToLabel(unit)} per L2 UOP`}
        tooltip="The average cost per L2 user operation for the selected time period."
        isLoading={isLoading}
        className="max-md:h-7"
      >
        {data?.stats?.perL2Uop?.[unit]
          ? formatCostValue(data.stats.perL2Uop[unit], unit, 'per-l2-uop')
          : undefined}
      </ChartStatsItem>
      <ChartStatsItem
        label={`Avg ${unitToLabel(unit)} per day`}
        tooltip="The average onchain cost paid per day, calculated by dividing the total cost over the selected time period by the number of days."
        isLoading={isLoading}
        className="max-md:h-7"
      >
        {data?.stats?.perDay?.[unit]
          ? formatCostValue(data.stats.perDay[unit], unit, 'total')
          : undefined}
      </ChartStatsItem>
    </ChartStats>
  )
}

function unitToLabel(unit: CostsUnit) {
  switch (unit) {
    case 'usd':
    case 'eth':
      return 'cost'
    case 'gas':
      return 'gas'
    default:
      assertUnreachable(unit)
  }
}
