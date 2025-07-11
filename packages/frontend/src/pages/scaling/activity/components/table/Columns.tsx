import { ProjectId } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import { PrimaryValueCell } from '~/components/table/cells/PrimaryValueCell'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import type { CommonProjectColumnsOptions } from '~/components/table/utils/common-project-columns/CommonProjectColumns'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/ScalingCommonProjectColumns'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/getScalingActivityEntries'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { formatUopsRatio } from '~/utils/number-format/formatUopsRatio'
import type { ActivityMetric } from '../ActivityMetricContext'
import { MaxCountCell } from './MaxCountCell'

export type ScalingActivityTableEntry = ScalingActivityEntry & {
  data:
    | {
        isSynced: boolean
        change: number
        pastDayCount: number
        summedCount: number
        maxCount: {
          value: number
          timestamp: number
        }
      }
    | undefined
}

const columnHelper = createColumnHelper<ScalingActivityTableEntry>()

export const getScalingActivityColumns = (
  metric: ActivityMetric,
  opts?: CommonProjectColumnsOptions,
) => [
  ...getScalingCommonProjectColumns(
    columnHelper,
    (row) =>
      row.id === ProjectId.ETHEREUM
        ? undefined
        : `/scaling/projects/${row.slug}#activity`,
    opts,
  ),
  columnHelper.accessor('data.pastDayCount', {
    header: `Past day ${metric === 'uops' ? 'UOPS' : 'TPS'}`,
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (!data) {
        return <NoDataBadge className="w-full" />
      }
      return (
        <SyncStatusWrapper isSynced={data.isSynced}>
          <PrimaryValueCell>
            {formatActivityCount(data.pastDayCount)}
          </PrimaryValueCell>
        </SyncStatusWrapper>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      headClassName: 'max-w-[110px]',
      tooltip: `${metric === 'uops' ? 'User operations' : 'Transactions'} per second averaged over the past day.`,
      colSpan: (cell) => (cell.row.original.data ? 1 : 100),
    },
  }),
  columnHelper.accessor('data.maxCount.value', {
    header: `Max ${metric === 'uops' ? 'UOPS' : 'TPS'}`,
    sortUndefined: 'last',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (!data) {
        return null
      }
      return (
        <SyncStatusWrapper isSynced={data.isSynced}>
          <MaxCountCell
            maxCount={data.maxCount.value}
            timestamp={data.maxCount.timestamp}
          />
        </SyncStatusWrapper>
      )
    },
    meta: {
      align: 'right',
      hideIfNull: true,
    },
  }),
  columnHelper.accessor('data.summedCount', {
    header: '30D Count',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (!data) {
        return null
      }
      return (
        <SyncStatusWrapper isSynced={data.isSynced}>
          <ValueWithPercentageChange
            change={data.change}
            className="font-medium"
            containerClassName="justify-end"
          >
            {formatInteger(data.summedCount)}
          </ValueWithPercentageChange>
        </SyncStatusWrapper>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      hideIfNull: true,
    },
  }),
  columnHelper.accessor('data.ratio', {
    header: 'UOPS/TPS RATIO',
    sortUndefined: 'last',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (!data) {
        return null
      }
      return (
        <SyncStatusWrapper isSynced={data.isSynced}>
          <PrimaryValueCell>{formatUopsRatio(data.ratio)}</PrimaryValueCell>
        </SyncStatusWrapper>
      )
    },
    meta: {
      align: 'right',
      tooltip:
        'The ratio of user operations to transactions over the past day. A high ratio indicates that for some transactions multiple individual user operations are bundled in a single transaction.',
      hideIfNull: true,
    },
  }),
]
