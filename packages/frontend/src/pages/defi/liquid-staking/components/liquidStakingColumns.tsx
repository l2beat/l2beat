import { formatCurrency } from '@l2beat/shared-pure'
import type { ColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { LiquidStakingStatsEntry } from '~/server/features/defi/liquid-staking/getLiquidStakingEntries'
import {
  formatLatestDate,
  formatLatestValue,
  LIQUID_STAKING_METRICS,
  TVL_TOOLTIP,
} from '../liquidStakingMetrics'

export const TVL_COLUMN_ID = 'totalValueLockedUsd'

/** TVL, then the latest yield and cost of exit. */
export function getLiquidStakingStatColumns<T extends LiquidStakingStatsEntry>(
  columnHelper: ColumnHelper<T>,
) {
  return [
    columnHelper.accessor((entry) => entry.totalValueLockedUsd, {
      id: TVL_COLUMN_ID,
      header: 'TVL',
      cell: (ctx) => {
        const value = ctx.row.original.totalValueLockedUsd
        return value === undefined ? (
          <NoDataBadge />
        ) : (
          <span className="font-medium text-sm">
            {formatCurrency(value, 'usd')}
          </span>
        )
      },
      sortUndefined: 'last',
      meta: {
        align: 'right',
        tooltip: TVL_TOOLTIP,
      },
    }),
    ...LIQUID_STAKING_METRICS.map((metric) =>
      columnHelper.accessor((entry) => entry[metric.key]?.value, {
        id: metric.key,
        header: metric.title,
        cell: (ctx) => {
          const latest = ctx.row.original[metric.key]
          return latest === undefined ? (
            <NoDataBadge />
          ) : (
            <Tooltip>
              <TooltipTrigger disabledOnTouch className="font-medium text-sm">
                {formatLatestValue(metric, latest)}
              </TooltipTrigger>
              <TooltipContent>
                Latest value from {formatLatestDate(metric, latest)}.
              </TooltipContent>
            </Tooltip>
          )
        },
        sortUndefined: 'last',
        meta: { align: 'right', tooltip: metric.tooltip },
      }),
    ),
  ]
}
