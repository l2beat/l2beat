import { assertUnreachable } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { Fragment } from 'react'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { formatCostValue } from '~/pages/scaling/costs/utils/formatCostValue'
import type { ProjectCostsChartResponse } from '~/server/features/scaling/costs/getProjectCostsChart'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { cn } from '~/utils/cn'

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
  const elements = compact([
    <ChartStatsItem
      key="totalCost"
      label={
        range === 'max'
          ? `Total ${unitToLabel(unit)}`
          : `${rangeToLabel(range)} total ${unitToLabel(unit)}`
      }
      className="max-md:h-7"
      tooltip="The total cost for the selected time period that the project paid to Ethereum. This includes the costs for calldata, computation, blobs, and overhead."
      isLoading={isLoading}
    >
      {data?.stats?.total[unit].total
        ? formatCostValue(data?.stats.total[unit].total, unit, 'total')
        : undefined}
    </ChartStatsItem>,
    <ChartStatsItem
      key="costPerL2Uop"
      label={`Avg ${unitToLabel(unit)} per L2 UOP`}
      tooltip="The average cost per L2 user operation for the selected time period."
      isLoading={isLoading}
      className="max-md:h-7"
    >
      {data?.stats?.perL2Uop?.[unit]?.total
        ? formatCostValue(data.stats.perL2Uop[unit].total, unit, 'per-l2-uop')
        : undefined}
    </ChartStatsItem>,
  ])

  return (
    <ChartStats
      className={cn(
        'mt-4',
        elements.length === 2 && 'lg:grid-cols-2',
        elements.length === 4 && 'lg:grid-cols-4',
      )}
    >
      {elements.map((element, index) => (
        <Fragment key={index}>{element}</Fragment>
      ))}
    </ChartStats>
  )
}

function rangeToLabel(range: Exclude<CostsTimeRange, 'max'>) {
  switch (range) {
    case '1d':
      return 'Past day'
    case '7d':
      return '7 days'
    case '30d':
      return '30 days'
    case '90d':
      return '90 days'
    case '180d':
      return '180 days'
    case '1y':
      return '1 year'
    default:
      assertUnreachable(range)
  }
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
