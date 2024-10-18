import { createColumnHelper } from '@tanstack/react-table'
import { PrimaryValueCell } from '~/components/table/cells/primary-value-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { getCommonProjectColumns } from '~/components/table/utils/common-project-columns'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { formatInteger } from '~/utils/number-format/format-integer'
import { formatTps } from '~/utils/number-format/format-tps'
import { SyncStatusWrapper } from '../../../finality/_components/table/sync-status-wrapper'
import { MaxTpsCell } from './max-tps-cell'

const columnHelper = createColumnHelper<ScalingActivityEntry>()

export const scalingActivityColumns = [
  ...getCommonProjectColumns(columnHelper, { activity: true }),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
    meta: {
      headClassName: 'w-0 min-w-[154px]',
    },
  }),
  columnHelper.accessor('data.pastDayTps', {
    header: 'Past day TPS',
    cell: (ctx) => {
      const data = ctx.row.original.data
      return (
        <SyncStatusWrapper syncStatus={data.syncStatus}>
          <PrimaryValueCell>{formatTps(data.pastDayTps)}</PrimaryValueCell>
        </SyncStatusWrapper>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      headClassName: 'max-w-[60px]',
      tooltip: 'Transactions per second averaged over the past day.',
    },
  }),
  columnHelper.accessor('data.maxTps.value', {
    header: 'Max TPS',
    sortUndefined: 'last',
    cell: (ctx) => {
      const data = ctx.row.original.data
      return (
        <SyncStatusWrapper syncStatus={data.syncStatus}>
          <MaxTpsCell
            maxTps={data.maxTps.value}
            timestamp={data.maxTps.timestamp}
          />
        </SyncStatusWrapper>
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
      return (
        <SyncStatusWrapper syncStatus={data.syncStatus}>
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
    },
  }),
  columnHelper.accessor('dataSource', {
    header: 'Data source',
    meta: {
      headClassName: 'w-0',
    },
  }),
]
