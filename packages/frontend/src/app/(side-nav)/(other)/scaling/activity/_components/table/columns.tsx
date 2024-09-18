import { createColumnHelper } from '@tanstack/react-table'
import { NumberCell } from '~/components/table/cells/number-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { EM_DASH } from '~/consts/characters'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { formatNumber } from '~/utils/format-number'
import { formatTps } from '~/utils/format-tps'
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
        return EM_DASH
      }
      return formatTps(data.pastDayTps)
    },
    sortUndefined: 'last',
    meta: {
      tooltip: 'Transactions per second averaged over the past day.',
    },
  }),
  columnHelper.accessor('data.maxTps.value', {
    header: 'Max TPS',
    sortUndefined: 'last',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (!data) {
        return EM_DASH
      }
      return (
        <MaxTpsCell
          maxTps={data.maxTps.value}
          timestamp={data.maxTps.timestamp}
        />
      )
    },
  }),
  columnHelper.accessor('data.summedCount', {
    header: '30D Count',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (!data) {
        return EM_DASH
      }
      return (
        <div className="flex items-center">
          <NumberCell className="font-bold">
            {formatNumber(data.summedCount)}
          </NumberCell>
          <NumberCell signed className="ml-1 !text-base font-medium">
            {data.change}
          </NumberCell>
        </div>
      )
    },
    sortUndefined: 'last',
  }),
  columnHelper.accessor('dataSource', {
    header: 'Data source',
  }),
]
