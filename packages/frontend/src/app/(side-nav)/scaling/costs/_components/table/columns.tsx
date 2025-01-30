import { assertUnreachable } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/no-data-badge'
import { Skeleton } from '~/components/core/skeleton'
import { getScalingCommonProjectColumns } from '~/components/table/utils/common-project-columns/scaling-common-project-columns'
import type { ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { formatNumber } from '~/utils/number-format/format-number'
import { getColumnHeaderUnderline } from '~/utils/table/get-column-header-underline'
import { SyncStatusWrapper } from '../../../finality/_components/table/sync-status-wrapper'
import { CostsBreakdownValueCell } from '../costs-breakdown-value-cell'
import type { CostsMetric } from '../costs-metric-context'
import { CostsTotalCell } from '../costs-total-cell'

export type ScalingCostsTableEntry = ScalingCostsEntry & {
  data: CostsData
}

export type CostsData = CostsAvailableData | CostsNotAvailableData

type CostsAvailableData = {
  type: 'available'
  total: number
  calldata: number
  blobs: number | undefined
  compute: number
  overhead: number
  uopsCount: number | undefined
  isSynced: boolean
}

type CostsNotAvailableData = {
  type: 'not-available'
  reason: 'loading' | 'no-data'
  syncStatus?: never
}

const columnHelper = createColumnHelper<ScalingCostsTableEntry>()

export function getScalingCostsColumns(metric: CostsMetric) {
  return [
    ...getScalingCommonProjectColumns(columnHelper),
    columnHelper.group({
      id: 'total-cost-group',
      header: undefined,
      columns: [
        columnHelper.accessor('data.total', {
          id: 'total-cost',
          header: metric === 'total' ? 'Total cost' : 'Avg PER L2 User op',
          cell: (ctx) => (
            <SyncStatusWrapper
              isSynced={
                ctx.row.original.data.type === 'available' &&
                ctx.row.original.data.isSynced
              }
            >
              <CostsTotalCell
                data={ctx.row.original.data}
                warning={ctx.row.original.costsWarning}
              />
            </SyncStatusWrapper>
          ),
          sortUndefined: 'last',
          meta: {
            hash: 'onchain-costs',
            align: 'center',
            tooltip: `The ${metric === 'total' ? 'total cost' : 'average cost per L2 user operation'} that is a sum of the costs for calldata, computation, blobs, and overhead.`,
          },
        }),
      ],
    }),
    columnHelper.accessor('data.calldata', {
      header: 'Calldata',
      cell: (ctx) => (
        <SyncStatusWrapper
          isSynced={
            ctx.row.original.data.type === 'available' &&
            ctx.row.original.data.isSynced
          }
        >
          <CostsBreakdownValueCell
            data={ctx.row.original.data}
            type="calldata"
          />
        </SyncStatusWrapper>
      ),
      sortUndefined: 'last',
      meta: {
        hash: 'onchain-costs',
        align: 'right',
        headClassName: getColumnHeaderUnderline(
          'w-[132px]',
          'before:bg-sky-550',
          'dark:before:bg-sky-500',
        ),
        tooltip:
          'The cost for posting data as calldata on Ethereum for the selected time period. Shows a sum or an average per L2 transaction, depending on the selected option.',
      },
    }),
    columnHelper.accessor('data.blobs', {
      header: 'Blobs',
      cell: (ctx) => (
        <SyncStatusWrapper
          isSynced={
            ctx.row.original.data.type === 'available' &&
            ctx.row.original.data.isSynced
          }
        >
          <CostsBreakdownValueCell data={ctx.row.original.data} type="blobs" />
        </SyncStatusWrapper>
      ),
      sortUndefined: 'last',
      meta: {
        hash: 'onchain-costs',
        align: 'right',
        headClassName: getColumnHeaderUnderline(
          'w-[132px]',
          'before:bg-orange-400',
          'dark:before:bg-yellow-100',
        ),
        tooltip:
          'The cost for posting data as blobs on Ethereum for the selected time period. Shows a sum or an average per L2 transaction, depending on the selected option.',
      },
    }),
    columnHelper.accessor('data.compute', {
      header: 'Compute',
      cell: (ctx) => (
        <SyncStatusWrapper
          isSynced={
            ctx.row.original.data.type === 'available' &&
            ctx.row.original.data.isSynced
          }
        >
          <CostsBreakdownValueCell
            data={ctx.row.original.data}
            type="compute"
          />
        </SyncStatusWrapper>
      ),
      sortUndefined: 'last',
      meta: {
        hash: 'onchain-costs',
        align: 'right',
        headClassName: getColumnHeaderUnderline(
          'w-[132px]',
          'before:bg-pink-100',
        ),
        tooltip:
          'The cost for carrying out different operations within a transaction for the selected time period. Shows a sum or an average per L2 transaction, depending on the selected option.',
      },
    }),
    columnHelper.accessor('data.overhead', {
      header: 'Overhead',
      cell: (ctx) => (
        <SyncStatusWrapper
          isSynced={
            ctx.row.original.data.type === 'available' &&
            ctx.row.original.data.isSynced
          }
        >
          <CostsBreakdownValueCell
            data={ctx.row.original.data}
            type="overhead"
          />
        </SyncStatusWrapper>
      ),
      sortUndefined: 'last',
      meta: {
        hash: 'onchain-costs',
        align: 'right',
        headClassName: getColumnHeaderUnderline(
          'w-[132px]',
          'before:bg-purple-100',
        ),
        tooltip:
          'The cost of the fixed 21,000 GAS overhead per L1 transaction for the selected time period. Shows a sum or an average per L2 transaction, depending on the selected option.',
      },
    }),

    columnHelper.accessor('data.uopsCount', {
      header: 'L2 User ops count',
      cell: (ctx) => {
        const data = ctx.row.original.data
        if (data.type === 'available') {
          const value = data.uopsCount
          if (value === undefined) return <NoDataBadge />
          return formatNumber(value)
        }

        switch (data.reason) {
          case 'loading':
            return <Skeleton className="ml-auto h-6 w-24" />
          case 'no-data':
            return <NoDataBadge />
          default:
            assertUnreachable(data.reason)
        }
      },
      sortUndefined: 'last',
      meta: {
        hash: 'onchain-costs',
        align: 'right',
        tooltip: 'Total number of L2 User ops over the selected time period.',
      },
    }),
  ]
}
