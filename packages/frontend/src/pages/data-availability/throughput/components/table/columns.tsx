import { createColumnHelper } from '@tanstack/react-table'
import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { TableLink } from '~/components/table/TableLink'
import { getDaCommonProjectColumns } from '~/components/table/utils/common-project-columns/DaCommonProjectColumns'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/getDaThroughputEntries'
import { formatBpsToMbps, formatBytes } from '~/utils/number-format/formatBytes'

export type DaThroughputTableData = Omit<DaThroughputEntry, 'scalingOnlyData'>

const columnHelper = createColumnHelper<DaThroughputTableData>()

export const [indexColumn, logoColumn] = getDaCommonProjectColumns(
  columnHelper,
  (row) => `${row.href}#throughput`,
)

export const publicSystemsColumns = [
  indexColumn,
  logoColumn,
  columnHelper.accessor('name', {
    header: 'DA Layer',
    cell: (ctx) => (
      <TableLink href={`${ctx.row.original.href}#throughput`}>
        <ProjectNameCell project={ctx.row.original} />
      </TableLink>
    ),
    meta: {
      tooltip:
        'The data availability layer where the data (transaction data or state diffs) is posted.',
    },
  }),
  columnHelper.group({
    header: 'Throughput',
    columns: [
      columnHelper.accessor(
        (e) => e.data?.pastDayData?.avgThroughputPerSecond,
        {
          id: 'pastDayAvgThroughputPerSecond',
          header: 'PAST DAY AVG',
          cell: (ctx) => (
            <SyncStatusWrapper isSynced={ctx.row.original.isSynced}>
              <TableValueCell
                emptyMode="upcoming"
                value={
                  ctx.row.original.data?.pastDayData?.avgThroughputPerSecond
                    ? {
                        value: formatBpsToMbps(
                          ctx.row.original.data?.pastDayData
                            ?.avgThroughputPerSecond,
                        ),
                      }
                    : undefined
                }
              />
            </SyncStatusWrapper>
          ),
          meta: {
            tooltip:
              'The total size of the data posted over the past day, divided by the number of seconds in a day.',
          },
          sortingFn: (rowA, rowB) => {
            return (
              (rowA.original.data?.pastDayData?.avgThroughputPerSecond ?? 0) -
              (rowB.original.data?.pastDayData?.avgThroughputPerSecond ?? 0)
            )
          },
          sortUndefined: 'last',
        },
      ),
      columnHelper.accessor((e) => e.data?.maxThroughputPerSecond, {
        header: 'MAX CAPACITY',
        cell: (ctx) => (
          <TableValueCell
            emptyMode="upcoming"
            value={
              ctx.row.original.data?.maxThroughputPerSecond
                ? {
                    value: formatBpsToMbps(
                      ctx.row.original.data.maxThroughputPerSecond,
                    ),
                  }
                : undefined
            }
          />
        ),
        meta: {
          align: 'right',
          tooltip:
            'The maximum data throughput that can be maintained over time. For Ethereum, it refers to the target blob throughput, as the blob base fee increases exponentially when blob usage exceeds the target.',
        },
      }),
    ],
  }),
  columnHelper.accessor((e) => e.data?.pastDayData?.avgCapacityUtilization, {
    header: 'past day avg\ncapacity used',
    cell: (ctx) => (
      <SyncStatusWrapper isSynced={ctx.row.original.isSynced}>
        <TableValueCell
          emptyMode="upcoming"
          value={
            ctx.row.original.data?.pastDayData?.avgCapacityUtilization
              ? {
                  value: `${ctx.row.original.data.pastDayData?.avgCapacityUtilization}%`,
                }
              : undefined
          }
        />
      </SyncStatusWrapper>
    ),
    meta: {
      headClassName: 'pl-2',
      cellClassName: 'pl-2',
      tooltip:
        "The percentage of utilization, calculated based on the past day's average throughput relative to the maximum.",
    },
  }),
  columnHelper.display({
    header: 'past day\nlargest poster (L2)',
    cell: (ctx) => (
      <SyncStatusWrapper isSynced={ctx.row.original.isSynced}>
        <TableValueCell
          emptyMode="upcoming"
          value={
            ctx.row.original.data?.pastDayData?.largestPoster
              ? {
                  value: `${ctx.row.original.data.pastDayData?.largestPoster.name} (${ctx.row.original.data.pastDayData?.largestPoster.percentage}%)`,
                  secondLine: formatBytes(
                    ctx.row.original.data.pastDayData?.largestPoster
                      .totalPosted,
                  ),
                }
              : undefined
          }
          href={ctx.row.original.data?.pastDayData?.largestPoster?.href}
        />
      </SyncStatusWrapper>
    ),
    meta: {
      tooltip:
        'The project that has posted the largest amount of data over the past day.',
    },
  }),
  columnHelper.accessor((e) => e.data?.pastDayData?.totalPosted, {
    header: 'past day\ntotal data posted',
    cell: (ctx) => {
      const data = ctx.row.original.data?.pastDayData
      if (!data?.totalPosted) {
        return (
          <SyncStatusWrapper isSynced={ctx.row.original.isSynced}>
            <TableValueCell emptyMode="upcoming" value={undefined} />
          </SyncStatusWrapper>
        )
      }

      return (
        <SyncStatusWrapper isSynced={ctx.row.original.isSynced}>
          <ValueWithPercentageChange
            change={data.change}
            className="font-medium text-xs md:text-sm"
          >
            {formatBytes(data.totalPosted)}
          </ValueWithPercentageChange>
        </SyncStatusWrapper>
      )
    },
    meta: {
      tooltip:
        'The total amount of data posted to the layer over the past day, displayed along with the percentage change compared to 1D ago.',
    },
  }),
  columnHelper.display({
    header: 'Finality',
    cell: (ctx) => (
      <TableValueCell
        emptyMode="upcoming"
        value={
          ctx.row.original.finality
            ? { value: ctx.row.original.finality }
            : undefined
        }
      />
    ),
    meta: {
      tooltip:
        'The time required for a data batch to achieve consensus finality, reducing the risk of reorgs or rollbacks. It represents the most optimistic case (normal network conditions). Faster finality means users can trust that data is available sooner, minimizing the wait time before proceeding with subsequent operations.',
    },
  }),
]
