import { ProjectId } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import compact from 'lodash/compact'
import { Badge } from '~/components/badge/Badge'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import { NumberCell } from '~/components/table/cells/NumberCell'
import { PrimaryValueCell } from '~/components/table/cells/PrimaryValueCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { TypeInfo } from '~/components/table/cells/TypeInfo'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import type { CommonProjectColumnsOptions } from '~/components/table/common-project-columns/CommonProjectColumns'
import { getScalingCommonProjectColumns } from '~/components/table/common-project-columns/ScalingCommonProjectColumns'
import { EM_DASH } from '~/consts/characters'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/getScalingActivityEntries'
import { formatTimestamp } from '~/utils/dates'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { formatUopsRatio } from '~/utils/number-format/formatUopsRatio'
import type { ActivityMetric } from '../ActivityMetricContext'
import { MaxCountCell } from './MaxCountCell'

type ScalingActivityTableEntry = ScalingActivityEntry & {
  data:
    | {
        isSynced: boolean
        pastDayCount: {
          value: number
          change: number
        }
        summedCount: {
          value: number
          change: number
        }
        maxCount: {
          value: number
          timestamp: number
        }
        totalCount?: {
          value: number
          sinceTimestamp: number
        }
      }
    | undefined
}

const columnHelper = createColumnHelper<ScalingActivityTableEntry>()

export const getScalingActivityColumns = (
  metric: ActivityMetric,
  opts?: CommonProjectColumnsOptions,
) =>
  compact([
    ...getScalingCommonProjectColumns(
      columnHelper,
      (row) =>
        row.id === ProjectId.ETHEREUM
          ? undefined
          : `/scaling/projects/${row.slug}#activity`,
      opts,
    ),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (ctx) => {
        const { type, id, stacks } = ctx.row.original

        let content
        if (id === ProjectId.ETHEREUM) {
          content = EM_DASH
        } else if (!type) {
          content = (
            <Badge type="gray" size="small">
              Unknown
            </Badge>
          )
        } else {
          content = type
        }

        return (
          <TwoRowCell>
            <TwoRowCell.First>
              <TypeInfo stacks={type ? stacks : []}>{content}</TypeInfo>
            </TwoRowCell.First>
          </TwoRowCell>
        )
      },
    }),
    columnHelper.accessor('data.pastDayCount', {
      header: `Past day ${metric === 'uops' ? 'UOPS' : 'TPS'}`,
      cell: (ctx) => {
        const data = ctx.row.original.data
        if (!data) {
          return <NoDataBadge className="w-full" />
        }
        return (
          <SyncStatusWrapper isSynced={data.isSynced}>
            <ValueWithPercentageChange
              change={data.pastDayCount.change}
              className="font-medium"
              containerClassName="justify-end"
            >
              {formatActivityCount(data.pastDayCount.value)}
            </ValueWithPercentageChange>
          </SyncStatusWrapper>
        )
      },
      sortUndefined: 'last',
      meta: {
        align: 'right',
        headClassName: 'max-w-[110px]',
        tooltip: `${metric === 'uops' ? 'User operations' : 'Transactions'} per second averaged over the past day, shown together with a percentage changed compared to 7D ago.`,
        colSpan: (ctx) => (ctx.row.original.data ? 1 : 100),
      },
    }),
    columnHelper.accessor('data.maxCount.value', {
      header: `Max ${metric === 'uops' ? 'UOPS' : 'TPS'}`,
      sortUndefined: 'last',
      cell: (ctx) => {
        const data = ctx.row.original.data
        if (!data) {
          return null
        }
        return (
          <SyncStatusWrapper isSynced={data.isSynced}>
            <MaxCountCell
              maxCount={data.maxCount.value}
              timestamp={data.maxCount.timestamp}
            />
          </SyncStatusWrapper>
        )
      },
      meta: {
        align: 'right',
        hideIfNull: true,
        tooltip: `Shows the maximum sustained ${metric === 'uops' ? 'UOPS' : 'TPS'}, calculated as an average over the count for a day.`,
      },
    }),
    columnHelper.accessor('data.summedCount.value', {
      header: '30D Count',
      cell: (ctx) => {
        const data = ctx.row.original.data
        if (!data) {
          return null
        }
        return (
          <SyncStatusWrapper isSynced={data.isSynced}>
            <ValueWithPercentageChange
              change={data.summedCount.change}
              className="font-medium"
              containerClassName="justify-end"
            >
              {formatInteger(data.summedCount.value)}
            </ValueWithPercentageChange>
          </SyncStatusWrapper>
        )
      },
      sortUndefined: 'last',
      meta: {
        align: 'right',
        hideIfNull: true,
      },
    }),
    metric === 'tps' &&
      columnHelper.accessor('data.totalCount.value', {
        header: 'Total count',
        cell: (ctx) => {
          const totalCount = ctx.row.original.data?.totalCount
          if (!totalCount) {
            return <NoDataBadge className="w-full" />
          }
          return (
            <TwoRowCell>
              <TwoRowCell.First className="text-right">
                <NumberCell>{formatInteger(totalCount.value)}</NumberCell>
              </TwoRowCell.First>
              <TwoRowCell.Second className="text-right">
                since {formatTimestamp(totalCount.sinceTimestamp)}
              </TwoRowCell.Second>
            </TwoRowCell>
          )
        },
        sortUndefined: 'last',
        meta: {
          align: 'right',
          tooltip:
            'All-time transaction count since the first available TPS data point.',
        },
      }),
    columnHelper.accessor('data.ratio', {
      header: 'UOPS/TPS RATIO',
      sortUndefined: 'last',
      cell: (ctx) => {
        const data = ctx.row.original.data
        if (!data) {
          return null
        }
        return (
          <SyncStatusWrapper isSynced={data.isSynced}>
            <PrimaryValueCell>{formatUopsRatio(data.ratio)}</PrimaryValueCell>
          </SyncStatusWrapper>
        )
      },
      meta: {
        align: 'right',
        tooltip:
          'The ratio of user operations to transactions over the past day. A high ratio indicates that for some transactions multiple individual user operations are bundled in a single transaction.',
        hideIfNull: true,
      },
    }),
  ])
