import { formatSeconds } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
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
  cell: (ctx) =>
    ctx.row.original.maxThroughput && (
      <div>{ctx.row.original.maxThroughput} MB/s</div>
    ),
})

const throughputGroup = columnHelper.group({
  header: 'Throughput',
  columns: [pastDayAvgThroughput, maxThroughput],
})

const finality = columnHelper.display({
  header: 'Finality',
  cell: (ctx) =>
    ctx.row.original.finality && (
      <div>{formatSeconds(ctx.row.original.finality)}</div>
    ),
})

const totalPosted = columnHelper.display({
  header: 'past day\ntotal data posted',
  cell: (ctx) =>
    ctx.row.original.totalPosted && <div>{ctx.row.original.totalPosted}</div>,
})

const utilization = columnHelper.display({
  header: 'past day avg\ncapacity used',
  cell: (ctx) =>
    ctx.row.original.pastDayAvgCapacityUtilization && (
      <div className="pl-2">
        {ctx.row.original.pastDayAvgCapacityUtilization}%
      </div>
    ),
  meta: {
    headClassName: 'pl-2',
  },
})

export const publicSystemsColumns = [
  indexColumn,
  logoColumn,
  daLayerColumn,
  throughputGroup,
  utilization,
  totalPosted,
  finality,
]
