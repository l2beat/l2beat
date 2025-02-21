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

const columnHelper = createColumnHelper<DaThroughputEntry>()

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
      columnHelper.display({
        header: 'PAST DAY AVG',
        cell: (ctx) => (
          <SyncStatusWrapper isSynced={ctx.row.original.isSynced}>
            <TableValueCell
              emptyMode="no-data"
              value={
                ctx.row.original.pastDayAvgThroughputPerSecond
                  ? {
                      value: formatBpsToMbps(
                        ctx.row.original.pastDayAvgThroughputPerSecond,
                      ),
                    }
                  : undefined
              }
            />
          </SyncStatusWrapper>
        ),
        meta: {
          tooltip:
            'The total size of the data posted over the past day, divided by the number of seconds in a day.',
        },
      }),
      columnHelper.display({
        header: 'SUSTAINED MAX',
        cell: (ctx) => (
          <TableValueCell
            value={
              ctx.row.original.maxThroughputPerSecond
                ? {
                    value: formatBpsToMbps(
                      ctx.row.original.maxThroughputPerSecond,
                    ),
                  }
                : undefined
            }
          />
        ),
        meta: {
          tooltip:
            'The maximum data throughput that can be maintained over time. For Ethereum, it refers to the target blob throughput, as the blob base fee increases exponentially when blob usage exceeds the target.',
        },
      }),
    ],
  }),
  columnHelper.display({
    header: 'past day avg\ncapacity used',
    cell: (ctx) => (
      <SyncStatusWrapper isSynced={ctx.row.original.isSynced}>
        <TableValueCell
          value={
            ctx.row.original.pastDayAvgCapacityUtilization
              ? {
                  value: `${ctx.row.original.pastDayAvgCapacityUtilization}%`,
                }
              : undefined
          }
        />
      </SyncStatusWrapper>
    ),
    meta: {
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
            ctx.row.original.largestPoster
              ? {
                  value: `${ctx.row.original.largestPoster.name} (${ctx.row.original.largestPoster.percentage}%)`,
                  secondLine: formatBytes(
                    ctx.row.original.largestPoster.totalPosted,
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
  columnHelper.display({
    header: 'past day\ntotal data posted',
    cell: (ctx) => (
      <SyncStatusWrapper isSynced={ctx.row.original.isSynced}>
        <TableValueCell
          value={{
            value: ctx.row.original.totalPosted
              ? formatBytes(ctx.row.original.totalPosted)
              : '',
          }}
        />
      </SyncStatusWrapper>
    ),
    meta: {
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
