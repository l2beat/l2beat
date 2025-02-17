import { createColumnHelper } from '@tanstack/react-table'
import { SyncStatusWrapper } from '~/app/(side-nav)/scaling/finality/_components/table/sync-status-wrapper'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import { getDaCommonProjectColumns } from '~/components/table/utils/common-project-columns/da-common-project-columns'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/get-da-throughput-entries'

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
                ctx.row.original.pastDayAvgThroughput
                  ? {
                      value: `${ctx.row.original.pastDayAvgThroughput} MB/s`,
                    }
                  : undefined
              }
            />
          </SyncStatusWrapper>
        ),
      }),
      columnHelper.display({
        header: 'MAX',
        cell: (ctx) => (
          <TableValueCell
            value={
              ctx.row.original.maxThroughput
                ? {
                    value: `${ctx.row.original.maxThroughput} MB/s`,
                  }
                : undefined
            }
          />
        ),
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
                  value: `${ctx.row.original.largestPoster.name} ${ctx.row.original.largestPoster.percentage}%`,
                  secondLine: ctx.row.original.largestPoster.totalPosted,
                }
              : undefined
          }
        />
      </SyncStatusWrapper>
    ),
  }),
  columnHelper.display({
    header: 'past day\ntotal data posted',
    cell: (ctx) => (
      <SyncStatusWrapper isSynced={ctx.row.original.isSynced}>
        <TableValueCell value={{ value: ctx.row.original.totalPosted ?? '' }} />
      </SyncStatusWrapper>
    ),
  }),
  columnHelper.display({
    header: 'Finality',
    cell: (ctx) => (
      <TableValueCell value={{ value: ctx.row.original.finality ?? '' }} />
    ),
  }),
]
