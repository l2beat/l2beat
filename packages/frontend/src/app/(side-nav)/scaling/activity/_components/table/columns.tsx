import { createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { PrimaryValueCell } from '~/components/table/cells/primary-value-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
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
      return <PrimaryValueCell>{formatTps(data.pastDayTps)}</PrimaryValueCell>
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
        <ValueWithPercentageChange
          change={data.change}
          className="font-medium"
          containerClassName="justify-end"
        >
          {formatInteger(data.summedCount)}
        </ValueWithPercentageChange>
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
