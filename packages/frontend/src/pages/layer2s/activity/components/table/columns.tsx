import {
  formatActivityCount,
  formatInteger,
  formatUopsRatio,
  ProjectId,
} from '@l2beat/shared-pure'
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
import { getL2CommonProjectColumns } from '~/components/table/common-project-columns/L2CommonProjectColumns'
import { withChangeSort } from '~/components/table/sorting/changeSortColumn'
import { EM_DASH } from '~/consts/characters'
import { ETHEREUM_PROJECT_PATH } from '~/pages/ethereum/paths'
import type { L2ActivityEntry } from '~/server/features/layer2s/activity/getL2ActivityEntries'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import type { ActivityMetric } from '../ActivityMetricContext'
import { MaxCountCell } from './MaxCountCell'

type L2ActivityTableEntry = L2ActivityEntry & {
  data:
    | {
        isSynced: boolean
        pastDayCount: {
          value: number
          change: number
          changePeriod: PercentageChangePeriod
        }
        summedCount: {
          value: number
          change: number
          changePeriod: PercentageChangePeriod
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

const columnHelper = createColumnHelper<L2ActivityTableEntry>()

export const getL2ActivityColumns = (
  metric: ActivityMetric,
  opts?: CommonProjectColumnsOptions & {
    /**
     * Hides Type with CSS on phones, for the markup painted before the
     * viewport is known. After that the table hides it through its column
     * visibility, which the Columns menu can turn back on.
     */
    hideTypeOnPhones?: boolean
  },
) =>
  compact([
    ...getL2CommonProjectColumns(
      columnHelper,
      (row) =>
        row.id === ProjectId.ETHEREUM
          ? `${ETHEREUM_PROJECT_PATH}#activity`
          : `/layer2s/projects/${row.slug}#activity`,
      opts,
    ),
    columnHelper.accessor('type', {
      header: 'Type',
      meta: opts?.hideTypeOnPhones
        ? { headClassName: 'max-md:hidden', cellClassName: 'max-md:hidden' }
        : undefined,
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
    ...withChangeSort(
      columnHelper,
      columnHelper.accessor((row) => row.data?.pastDayCount.value, {
        id: 'pastDayCount',
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
                changePeriod={data.pastDayCount.changePeriod}
                className="font-medium md:text-label-value-15"
                containerClassName="flex-nowrap justify-end max-md:justify-start"
              >
                {formatActivityCount(data.pastDayCount.value)}
              </ValueWithPercentageChange>
            </SyncStatusWrapper>
          )
        },
        sortUndefined: 'last',
        meta: {
          align: 'right',
          // Phones scroll the table sideways: starting the column at its left
          // edge keeps the figure in the first view, as on the Layer 2s summary.
          headClassName: 'max-md:[&>div]:justify-start',
          cellClassName: 'max-md:text-left',
          tooltip: `${metric === 'uops' ? 'User operations' : 'Transactions'} per second averaged over the past day, shown together with a percentage change compared to 7 days ago.`,
          colSpan: (ctx) => (ctx.row.original.data ? 1 : 100),
        },
      }),
      (row) => ({
        change: row.data?.pastDayCount.change,
        period: row.data?.pastDayCount.changePeriod,
      }),
    ),
    columnHelper.accessor((row) => row.data?.maxCount.value, {
      // Ids match the former 'data.x' accessor keys; column visibility is persisted by id.
      id: 'data_maxCount_value',
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
    ...withChangeSort(
      columnHelper,
      columnHelper.accessor((row) => row.data?.summedCount.value, {
        id: 'summedCount',
        header: '30d count',
        cell: (ctx) => {
          const data = ctx.row.original.data
          if (!data) {
            return null
          }
          return (
            <SyncStatusWrapper isSynced={data.isSynced}>
              <ValueWithPercentageChange
                change={data.summedCount.change}
                changePeriod={data.summedCount.changePeriod}
                className="font-medium md:text-label-value-15"
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
          tooltip: `${metric === 'uops' ? 'User operations' : 'Transactions'} over the last 30 days, shown together with a percentage change compared to the previous 30 days.`,
        },
      }),
      (row) => ({
        change: row.data?.summedCount.change,
        period: row.data?.summedCount.changePeriod,
      }),
    ),
    metric === 'tps' &&
      columnHelper.accessor((row) => row.data?.totalCount?.value, {
        id: 'data_totalCount_value',
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
    columnHelper.accessor((row) => row.data?.ratio, {
      id: 'data_ratio',
      header: 'UOPS/TPS\nratio',
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
