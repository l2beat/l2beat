import { createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { PrimaryValueCell } from '~/components/table/cells/primary-value-cell'
import { ValueWithPercentageChange } from '~/components/table/cells/value-with-percentage-change'
import { type CommonProjectColumnsOptions } from '~/components/table/utils/common-project-columns/common-project-columns'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { formatInteger } from '~/utils/number-format/format-integer'
import { formatUops } from '~/utils/number-format/format-uops'
import { formatUopsRatio } from '~/utils/number-format/format-uops-ratio'
import { SyncStatusWrapper } from '../../../finality/_components/table/sync-status-wrapper'
import { MaxUopsCell } from './max-uops-cell'

const columnHelper = createColumnHelper<ScalingActivityEntry>()

export const getScalingActivityColumns = (
  opts?: CommonProjectColumnsOptions,
) => [
  ...getScalingCommonProjectColumns(columnHelper, opts),
  columnHelper.accessor('data.pastDayUops', {
    header: 'Past day UOPS',
    cell: (ctx) => {
      const data = ctx.row.original.data
      return (
        <SyncStatusWrapper syncStatus={data.syncStatus}>
          <PrimaryValueCell>{formatUops(data.pastDayUops)}</PrimaryValueCell>
        </SyncStatusWrapper>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      headClassName: 'max-w-[60px]',
      tooltip: 'User operations per second averaged over the past day.',
    },
  }),
  columnHelper.accessor('data.maxUops.value', {
    header: 'Max UOPS',
    sortUndefined: 'last',
    cell: (ctx) => {
      const data = ctx.row.original.data
      return (
        <SyncStatusWrapper syncStatus={data.syncStatus}>
          <MaxUopsCell
            maxUops={data.maxUops.value}
            timestamp={data.maxUops.timestamp}
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
  columnHelper.accessor('data.ratio', {
    header: 'UOPS/TPS RATIO',
    sortUndefined: 'last',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (!data) {
        return <NoDataBadge />
      }
      return (
        <SyncStatusWrapper syncStatus={data.syncStatus}>
          <PrimaryValueCell>{formatUopsRatio(data.ratio)}</PrimaryValueCell>
        </SyncStatusWrapper>
      )
    },
    meta: {
      align: 'right',
      tooltip:
        'The ratio of user operations to transactions over the past day. A high ratio indicates that for some transactions multiple individual user operations are bundled in a single transaction.',
    },
  }),
]
