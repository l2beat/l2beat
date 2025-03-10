import { createColumnHelper } from '@tanstack/react-table'
import { SyncStatusWrapper } from '~/app/(side-nav)/scaling/finality/_components/table/sync-status-wrapper'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import { getDaCommonProjectColumns } from '~/components/table/utils/common-project-columns/da-common-project-columns'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/get-da-throughput-entries'
import {
  formatBpsToMbps,
  formatBytes,
} from '~/utils/number-format/format-bytes'

export type DaThroughputTableData = Omit<DaThroughputEntry, 'scalingOnlyData'>

const columnHelper = createColumnHelper<DaThroughputTableData>()

export const [indexColumn, logoColumn] = getDaCommonProjectColumns(columnHelper)

export const publicSystemsColumns = [
  indexColumn,
  logoColumn,
  columnHelper.accessor('name', {
    header: 'DA Layer',
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
    meta: {
      tooltip:
        'The data availability layer where the data (transaction data or state diffs) is posted.',
    },
  }),
  columnHelper.group({
    header: 'Throughput',
    columns: [
      columnHelper.accessor((e) => e.data.pastDayAvgThroughputPerSecond, {
        id: 'pastDayAvgThroughputPerSecond',
        header: 'PAST DAY AVG',
        cell: (ctx) => (
          <SyncStatusWrapper isSynced={ctx.row.original.isSynced}>
            <TableValueCell
              emptyMode="no-data"
              value={{
                value: formatBpsToMbps(
                  ctx.row.original.data.pastDayAvgThroughputPerSecond,
                ),
              }}
            />
          </SyncStatusWrapper>
        ),
        meta: {
          align: 'right',
          tooltip:
            'The total size of the data posted over the past day, divided by the number of seconds in a day.',
        },
      }),
      columnHelper.accessor((e) => e.data.maxThroughputPerSecond, {
        header: 'MAX CAPACITY',
        cell: (ctx) => (
          <TableValueCell
            value={{
              value: formatBpsToMbps(
                ctx.row.original.data.maxThroughputPerSecond,
              ),
            }}
          />
        ),
        meta: {
          align: 'right',
          tooltip:
            'The maximum data throughput that can be maintained over time. For Ethereum, it refers to the target blob throughput, as the blob base fee increases exponentially when blob usage exceeds the target.',
        },
      }),
    ],
  }),
  columnHelper.accessor((e) => e.data.pastDayAvgCapacityUtilization, {
    header: 'past day avg\ncapacity used',
    cell: (ctx) => (
      <SyncStatusWrapper isSynced={ctx.row.original.isSynced}>
        <TableValueCell
          value={{
            value: `${ctx.row.original.data.pastDayAvgCapacityUtilization}%`,
          }}
        />
      </SyncStatusWrapper>
    ),
    meta: {
      align: 'right',
      headClassName: 'pl-2',
      cellClassName: 'pl-2',
      tooltip:
        "The percentage of utilization, calculated based on the past day's average throughput relative to the maximum.",
    },
  }),
  columnHelper.display({
    header: 'past day\nlargest poster (L2)',
    cell: (ctx) => (
      <SyncStatusWrapper isSynced={ctx.row.original.isSynced}>
        <TableValueCell
          emptyMode="no-data"
          value={
            ctx.row.original.data.largestPoster
              ? {
                  value: `${ctx.row.original.data.largestPoster.name} (${ctx.row.original.data.largestPoster.percentage}%)`,
                  secondLine: formatBytes(
                    ctx.row.original.data.largestPoster.totalPosted,
                  ),
                }
              : undefined
          }
        />
      </SyncStatusWrapper>
    ),
    meta: {
      tooltip:
        'The project that has posted the largest amount of data over the past day.',
    },
  }),
  columnHelper.accessor((e) => e.data.totalPosted, {
    header: 'past day\ntotal data posted',
    cell: (ctx) => (
      <SyncStatusWrapper isSynced={ctx.row.original.isSynced}>
        <TableValueCell
          value={{
            value: formatBytes(ctx.row.original.data.totalPosted),
          }}
        />
      </SyncStatusWrapper>
    ),
    meta: {
      align: 'right',
      tooltip:
        'The total amount of data posted to the layer over the past day.',
    },
  }),
  columnHelper.display({
    header: 'Finality',
    cell: (ctx) => (
      <TableValueCell value={{ value: ctx.row.original.finality ?? '' }} />
    ),
    meta: {
      tooltip:
        'The time required for a data batch to achieve consensus finality, reducing the risk of reorgs or rollbacks. It represents the most optimistic case (normal network conditions). Faster finality means users can trust that data is available sooner, minimizing the wait time before proceeding with subsequent operations.',
    },
  }),
]
