import { createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { NumberCell } from '~/components/table/cells/number-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { formatInteger } from '~/utils/number-format/format-integer'
import { formatTps } from '~/utils/number-format/format-tps'
import { MaxTpsCell } from './max-tps-cell'

const columnHelper = createColumnHelper<ScalingActivityEntry>()

export const scalingActivityColumns = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  }),
  columnHelper.accessor('data.pastDayTps', {
    header: 'Past day TPS',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (!data) {
        return <NoDataBadge />
      }
      return formatTps(data.pastDayTps)
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip: 'Transactions per second averaged over the past day.',
    },
  }),
  columnHelper.accessor('data.maxTps.value', {
    header: 'Max TPS',
    sortUndefined: 'last',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (!data) {
        return <NoDataBadge />
      }
      return (
        <MaxTpsCell
          maxTps={data.maxTps.value}
          timestamp={data.maxTps.timestamp}
        />
      )
    },
    meta: {
      align: 'right',
    },
  }),
  columnHelper.accessor('data.summedCount', {
    header: '30D Count',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (!data) {
        return <NoDataBadge />
      }
      return (
        <div className="flex items-center justify-end">
          <NumberCell className="font-bold">
            {formatInteger(data.summedCount)}
          </NumberCell>
          <NumberCell signed className="ml-1 !text-base font-medium">
            {data.change}
          </NumberCell>
        </div>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
    },
  }),
  columnHelper.accessor('dataSource', {
    header: 'Data source',
  }),
]
