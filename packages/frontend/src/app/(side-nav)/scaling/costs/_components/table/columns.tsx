import { assertUnreachable } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import { Skeleton } from '~/components/core/skeleton'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { EM_DASH } from '~/consts/characters'
import { type ScalingCostsEntry } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { type SyncStatus } from '~/types/sync-status'
import { formatNumber } from '~/utils/format-number'
import { getColumnHeaderUnderline } from '~/utils/table/get-column-header-underline'
import { SyncStatusWrapper } from '../../../finality/_components/table/sync-status-wrapper'
import { CostsBreakdownValueCell } from '../costs-breakdown-value-cell'
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
  txCount: number | undefined
  syncStatus: SyncStatus
}

type CostsNotAvailableData = {
  type: 'not-available'
  reason: 'loading' | 'coming-soon' | 'no-per-tx-metric' | 'no-data'
  syncStatus?: never
}

const columnHelper = createColumnHelper<ScalingCostsTableEntry>()

export const scalingCostsColumns = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  }),
  columnHelper.group({
    id: 'total-cost',
    header: undefined,
    columns: [
      columnHelper.accessor('data.total', {
        header: 'Total cost',
        cell: (ctx) => (
          <SyncStatusWrapper syncStatus={ctx.row.original.data.syncStatus}>
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
          tooltip:
            'The total cost that is a sum of the costs for calldata, computation, blobs, and overhead.',
          cellClassName: '!px-2',
          headClassName: '!px-2',
        },
      }),
    ],
  }),
  columnHelper.accessor('data.calldata', {
    header: 'Calldata',
    cell: (ctx) => (
      <SyncStatusWrapper syncStatus={ctx.row.original.data.syncStatus}>
        <CostsBreakdownValueCell data={ctx.row.original.data} type="calldata" />
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
      <SyncStatusWrapper syncStatus={ctx.row.original.data.syncStatus}>
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
      <SyncStatusWrapper syncStatus={ctx.row.original.data.syncStatus}>
        <CostsBreakdownValueCell data={ctx.row.original.data} type="compute" />
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
      <SyncStatusWrapper syncStatus={ctx.row.original.data.syncStatus}>
        <CostsBreakdownValueCell data={ctx.row.original.data} type="overhead" />
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

  columnHelper.accessor('data.txCount', {
    header: 'L2 Tx count',
    cell: (ctx) => {
      const data = ctx.row.original.data
      if (data.type === 'available') {
        const value = data.txCount
        if (!value) return EM_DASH
        return formatNumber(value)
      }

      switch (data.reason) {
        case 'loading':
          return <Skeleton className="ml-auto h-6 w-24" />
        case 'coming-soon':
        case 'no-data':
        case 'no-per-tx-metric':
          return EM_DASH
        default:
          assertUnreachable(data.reason)
      }
    },
    sortUndefined: 'last',
    meta: {
      hash: 'onchain-costs',
      align: 'right',
      tooltip: 'Total number of L2 transactions over the selected time period.',
    },
  }),
]
