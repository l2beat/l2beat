import { assertUnreachable } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { Fragment } from 'react'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import { formatCostValue } from '~/pages/scaling/costs/utils/formatCostValue'
import type { ProjectCostsChartResponse } from '~/server/features/scaling/costs/getProjectCostsChart'
import type { CostsUnit } from '~/server/features/scaling/costs/types'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import { cn } from '~/utils/cn'
import { formatBytes } from '~/utils/number-format/formatBytes'
import { rangeToLabel } from '~/utils/project/rangeToLabel'

export function ProjectCostsChartStats({
  range,
  unit,
  isLoading,
  data,
  hasPostedData,
}: {
  range: CostsTimeRange
  unit: CostsUnit
  isLoading: boolean
  data: ProjectCostsChartResponse | undefined
  hasPostedData?: boolean
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
    hasPostedData && (
      <ChartStatsItem
        key="totalPosted"
        label={
          range === 'max'
            ? 'Total data posted'
            : `${rangeToLabel(range)} data posted`
        }
        tooltip="The total amount of data posted to Ethereum for the selected time period."
        isLoading={isLoading}
        className="max-md:h-7"
      >
        {data?.stats?.total.posted
          ? formatBytes(data.stats.total.posted)
          : undefined}
      </ChartStatsItem>
    ),
    hasPostedData && (
      <ChartStatsItem
        key="sizePerL2Uop"
        label="Avg size per L2 UOP"
        tooltip="The average posted data size of a L2 user operation for the selected time period."
        isLoading={isLoading}
        className="max-md:h-7"
      >
        {data?.stats?.perL2Uop?.posted
          ? formatBytes(data.stats.perL2Uop.posted)
          : undefined}
      </ChartStatsItem>
    ),
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
