import { createColumnHelper } from '@tanstack/react-table'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { TableValueCell } from '~/components/table/cells/table-value-cell'
import { getDaCommonProjectColumns } from '~/components/table/utils/common-project-columns/da-common-project-columns'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/get-da-throughput-entries'

const columnHelper = createColumnHelper<DaThroughputEntry>()

export const [indexColumn, logoColumn] = getDaCommonProjectColumns(columnHelper)

const daLayerColumn = columnHelper.accessor('name', {
  header: 'DA Layer',
  cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  meta: {
    tooltip:
      'The data availability layer where the data (transaction data or state diffs) is posted.',
  },
})

const pastDayAvgThroughput = columnHelper.display({
  header: 'PAST DAY AVG',
  cell: (ctx) =>
    ctx.row.original.pastDayAvgThroughput && (
      <div>{ctx.row.original.pastDayAvgThroughput} MB/s</div>
    ),
})

const maxThroughput = columnHelper.display({
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
})

const throughputGroup = columnHelper.group({
  header: 'Throughput',
  columns: [pastDayAvgThroughput, maxThroughput],
})

const utilization = columnHelper.display({
  header: 'past day avg\ncapacity used',
  cell: (ctx) => (
    <TableValueCell
      value={
        ctx.row.original.pastDayAvgCapacityUtilization
          ? {
              value: `${ctx.row.original.pastDayAvgCapacityUtilization}%`,
            }
          : undefined
      }
    />
  ),
  meta: {
    headClassName: 'pl-2',
    cellClassName: 'pl-2',
  },
})

const largestPoster = columnHelper.display({
  header: 'past day avg\nlargest poster',
  cell: (ctx) => (
    <TableValueCell
      value={
        ctx.row.original.largestPoster
          ? {
              value: `${ctx.row.original.largestPoster.name} ${ctx.row.original.largestPoster.percentage}%`,
              secondLine: ctx.row.original.largestPoster.totalPosted,
            }
          : undefined
      }
    />
  ),
})

const totalPosted = columnHelper.display({
  header: 'past day\ntotal data posted',
  cell: (ctx) => (
    <TableValueCell value={{ value: ctx.row.original.totalPosted ?? '' }} />
  ),
})

const finality = columnHelper.display({
  header: 'Finality',
  cell: (ctx) => (
    <TableValueCell value={{ value: ctx.row.original.finality ?? '' }} />
  ),
})

export const publicSystemsColumns = [
  indexColumn,
  logoColumn,
  daLayerColumn,
  throughputGroup,
  utilization,
  largestPoster,
  totalPosted,
  finality,
]
