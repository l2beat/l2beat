import { formatCurrency } from '@l2beat/shared-pure'
import type { ColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import { TableLink } from '~/components/table/TableLink'
import type { LiquidStakingStatsEntry } from '~/server/features/defi/liquid-staking/getLiquidStakingEntries'
import {
  formatLatestValue,
  LIQUID_STAKING_METRICS,
  TVL_TOOLTIP,
} from '../liquidStakingMetrics'

export const TVL_COLUMN_ID = 'totalValueLockedUsd'

/** The name, linked to the project page. */
export function getLiquidStakingNameColumn<T extends LiquidStakingStatsEntry>(
  columnHelper: ColumnHelper<T>,
) {
  return columnHelper.accessor((entry) => entry.name, {
    id: 'name',
    header: 'Name',
    enableHiding: false,
    cell: (ctx) => (
      <TableLink href={ctx.row.original.href}>
        <ProjectNameCell
          project={{
            name: ctx.row.original.name,
            shortName: ctx.row.original.shortName,
            slug: ctx.row.original.slug,
            icon: ctx.row.original.icon,
            backgroundColor: undefined,
            description: ctx.row.original.description,
            statuses: {
              underReview: ctx.row.original.isUnderReview
                ? 'config'
                : undefined,
            },
          }}
        />
      </TableLink>
    ),
    enableSorting: false,
    meta: {
      cellClassName: 'pl-4',
      headClassName: 'pl-4',
    },
  })
}

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
            <span className="font-medium text-sm">
              {formatLatestValue(metric, latest)}
            </span>
          )
        },
        sortUndefined: 'last',
        meta: { align: 'right', tooltip: metric.tooltip },
      }),
    ),
  ]
}
